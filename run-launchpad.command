#!/bin/bash
PORT=4173
cd "$(dirname "$0")"
python3 -m http.server "$PORT" &
SERVER_PID=$!
sleep 1
if command -v xdg-open >/dev/null 2>&1; then
  xdg-open "http://localhost:${PORT}/prompt-launchpad.html"
elif command -v open >/dev/null 2>&1; then
  open "http://localhost:${PORT}/prompt-launchpad.html"
else
  echo "Open http://localhost:${PORT}/prompt-launchpad.html in your browser"
fi
wait "$SERVER_PID"
