@echo off
cd /d "C:\My Web Sites\plasma web\www.plasmamade.com - kopie"
start "PlasmaMade Local Preview" "C:\WINDOWS\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -ExecutionPolicy Bypass -Command "Set-Location 'C:\My Web Sites\plasma web\www.plasmamade.com - kopie'; & '.\serve-local.ps1' -Port 8080"
timeout /t 2 /nobreak >nul
start "" http://127.0.0.1:8080/index.html
