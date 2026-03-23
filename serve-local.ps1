param(
    [int]$Port = 8080,
    [string]$BindAddress = '127.0.0.1'
)

$ErrorActionPreference = 'Stop'

$root = (Get-Location).Path

function Get-ContentType {
    param([string]$Path)

    switch ([System.IO.Path]::GetExtension($Path).ToLowerInvariant()) {
        '.html' { 'text/html; charset=utf-8' }
        '.htm'  { 'text/html; charset=utf-8' }
        '.css'  { 'text/css; charset=utf-8' }
        '.js'   { 'application/javascript; charset=utf-8' }
        '.json' { 'application/json; charset=utf-8' }
        '.svg'  { 'image/svg+xml' }
        '.xml'  { 'application/xml; charset=utf-8' }
        '.txt'  { 'text/plain; charset=utf-8' }
        '.png'  { 'image/png' }
        '.jpg'  { 'image/jpeg' }
        '.jpeg' { 'image/jpeg' }
        '.gif'  { 'image/gif' }
        '.webp' { 'image/webp' }
        '.ico'  { 'image/x-icon' }
        '.pdf'  { 'application/pdf' }
        '.woff' { 'font/woff' }
        '.woff2' { 'font/woff2' }
        '.ttf'  { 'font/ttf' }
        default { 'application/octet-stream' }
    }
}

function Resolve-LocalPath {
    param(
        [string]$RootPath,
        [string]$RequestPath
    )

    $relative = [System.Uri]::UnescapeDataString($RequestPath.TrimStart('/'))
    if ([string]::IsNullOrWhiteSpace($relative)) {
        $relative = 'index.html'
    }

    $fullPath = Join-Path $RootPath $relative

    if (Test-Path -LiteralPath $fullPath -PathType Container) {
        $fullPath = Join-Path $fullPath 'index.html'
    }

    return [System.IO.Path]::GetFullPath($fullPath)
}

function Write-HttpResponse {
    param(
        [System.IO.Stream]$Stream,
        [int]$StatusCode,
        [string]$StatusText,
        [string]$ContentType,
        [byte[]]$Body,
        [bool]$SkipBody = $false
    )

    $headers = "HTTP/1.1 ${StatusCode} ${StatusText}`r`nContent-Type: ${ContentType}`r`nContent-Length: $($Body.LongLength)`r`nConnection: close`r`n`r`n"
    $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($headers)
    $Stream.Write($headerBytes, 0, $headerBytes.Length)

    if (-not $SkipBody -and $Body.Length -gt 0) {
        $Stream.Write($Body, 0, $Body.Length)
    }
}

function Get-ResponseData {
    param(
        [string]$RootPath,
        [string]$RequestPath
    )

    try {
        $localPath = Resolve-LocalPath -RootPath $RootPath -RequestPath $RequestPath

        if (-not $localPath.StartsWith($RootPath, [System.StringComparison]::OrdinalIgnoreCase)) {
            return @{
                StatusCode = 403
                StatusText = 'Forbidden'
                ContentType = 'text/plain; charset=utf-8'
                Body = [System.Text.Encoding]::UTF8.GetBytes('Forbidden')
            }
        }

        if (-not (Test-Path -LiteralPath $localPath -PathType Leaf)) {
            return @{
                StatusCode = 404
                StatusText = 'Not Found'
                ContentType = 'text/plain; charset=utf-8'
                Body = [System.Text.Encoding]::UTF8.GetBytes('Not Found')
            }
        }

        return @{
            StatusCode = 200
            StatusText = 'OK'
            ContentType = Get-ContentType -Path $localPath
            Body = [System.IO.File]::ReadAllBytes($localPath)
        }
    }
    catch {
        return @{
            StatusCode = 500
            StatusText = 'Internal Server Error'
            ContentType = 'text/plain; charset=utf-8'
            Body = [System.Text.Encoding]::UTF8.GetBytes($_.Exception.Message)
        }
    }
}

$prefix = "http://${BindAddress}:${Port}/"
$useHttpListener = $true
$listener = $null
$tcpListener = $null

try {
    $listener = New-Object System.Net.HttpListener
    $listener.Prefixes.Add($prefix)
    $listener.Start()
}
catch {
    $useHttpListener = $false
    $ipAddress = [System.Net.IPAddress]::Parse($BindAddress)
    $tcpListener = [System.Net.Sockets.TcpListener]::new($ipAddress, $Port)
    $tcpListener.Start()
}

try {
    if ($useHttpListener) {
        while ($listener.IsListening) {
            $context = $listener.GetContext()
            $request = $context.Request
            $response = $context.Response

            try {
                $data = Get-ResponseData -RootPath $root -RequestPath $request.Url.AbsolutePath
                $response.StatusCode = $data.StatusCode
                $response.ContentType = $data.ContentType
                $response.ContentLength64 = $data.Body.LongLength
                if ($request.HttpMethod -ne 'HEAD') {
                    $response.OutputStream.Write($data.Body, 0, $data.Body.Length)
                }
            }
            finally {
                $response.OutputStream.Close()
            }
        }
    }
    else {
        while ($true) {
            $client = $tcpListener.AcceptTcpClient()
            try {
                $stream = $client.GetStream()
                $reader = [System.IO.StreamReader]::new($stream, [System.Text.Encoding]::ASCII, $false, 1024, $true)

                $requestLine = $reader.ReadLine()
                if ([string]::IsNullOrWhiteSpace($requestLine)) {
                    continue
                }

                while ($true) {
                    $headerLine = $reader.ReadLine()
                    if ($null -eq $headerLine -or $headerLine -eq '') {
                        break
                    }
                }

                $parts = $requestLine.Split(' ')
                $method = if ($parts.Count -gt 0) { $parts[0].ToUpperInvariant() } else { 'GET' }
                $target = if ($parts.Count -gt 1) { $parts[1] } else { '/' }
                $requestPath = ($target -split '\?')[0]

                if ($method -notin @('GET', 'HEAD')) {
                    $body = [System.Text.Encoding]::UTF8.GetBytes('Method Not Allowed')
                    Write-HttpResponse -Stream $stream -StatusCode 405 -StatusText 'Method Not Allowed' -ContentType 'text/plain; charset=utf-8' -Body $body -SkipBody ($method -eq 'HEAD')
                    continue
                }

                $data = Get-ResponseData -RootPath $root -RequestPath $requestPath
                Write-HttpResponse -Stream $stream -StatusCode $data.StatusCode -StatusText $data.StatusText -ContentType $data.ContentType -Body $data.Body -SkipBody ($method -eq 'HEAD')
            }
            finally {
                if ($reader) {
                    $reader.Dispose()
                }
                if ($stream) {
                    $stream.Dispose()
                }
                $client.Close()
            }
        }
    }
}
finally {
    if ($listener) {
        $listener.Stop()
        $listener.Close()
    }
    if ($tcpListener) {
        $tcpListener.Stop()
    }
}
