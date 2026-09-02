LEARNHUB REAL BACKEND
=====================

1. Install Node.js (LTS) on the laptop.
2. Open this PORTFOLIO folder in VS Code.
3. Open Terminal in this folder.
4. Run: node server.js
5. Open Chrome: http://localhost:3000/
6. Admin panel: http://localhost:3000/learnhub-admin.html
7. Default admin password: admin123
   For a safer password before starting the server:
   Windows CMD: set LEARNHUB_ADMIN_PASSWORD=YourPassword
   PowerShell: $env:LEARNHUB_ADMIN_PASSWORD="YourPassword"

Classes, questions and uploaded PDFs are stored on the server in data/ and uploads/.
Students fetch the same content from the backend, so it is shared across browsers/devices that can reach the server.

For public internet deployment, deploy this folder on a Node-compatible host and use HTTPS. Do not use the default admin password in production.


Live classes: Admin can add a scheduled live class with a Google Meet, Zoom, YouTube Live, or other HTTPS room URL. Students see it on classes.html with LIVE/UPCOMING status and a Join Live button.
