@echo off

reg query "HKLM\SOFTWARE\WOW6432Node\Microsoft\EdgeUpdate\Clients\{F3017226-FE2A-4295-8BDF-00C3A9A7E4C5}" /v "pv"
if %ERRORLEVEL% EQU 0 goto RUN

MicrosoftEdgeWebview2Setup.exe /install

:RUN
ProtonShell.exe
exit