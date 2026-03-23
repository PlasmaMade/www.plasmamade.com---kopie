Set shell = CreateObject("WScript.Shell")
command = """C:\WINDOWS\System32\WindowsPowerShell\v1.0\powershell.exe"" -NoProfile -ExecutionPolicy Bypass -Command ""Set-Location 'C:\My Web Sites\plasma web\www.plasmamade.com - kopie'; & '.\serve-local.ps1' -Port 8080"""
shell.Run command, 0, False
