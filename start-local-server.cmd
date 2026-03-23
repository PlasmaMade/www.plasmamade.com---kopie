@echo off
cd /d "C:\My Web Sites\plasma web\www.plasmamade.com - kopie"
echo [%date% %time%] starting server>.server-out.log
echo [%date% %time%] starting server>.server-err.log
"C:\WINDOWS\System32\WindowsPowerShell\v1.0\powershell.exe" -NoProfile -ExecutionPolicy Bypass -File "C:\My Web Sites\plasma web\www.plasmamade.com - kopie\serve-local.ps1" -Port 8080 1>>.server-out.log 2>>.server-err.log
