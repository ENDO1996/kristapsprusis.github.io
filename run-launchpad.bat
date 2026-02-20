@echo off
set PORT=4173
cd /d "%~dp0"
start "" "http://localhost:%PORT%/prompt-launchpad.html"
python -m http.server %PORT%
