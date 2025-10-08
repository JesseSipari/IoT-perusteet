# IoT-pipeline

A small IoT pipeline used in the "IoT-perusteet" course. A Raspberry Pi Pico W (simulated in Wokwi using MicroPython) reads temperature and humidity from a DHT22 sensor, posts the measurements to ThingSpeak, and a Node.js/Express backend serves the data to a Chart.js dashboard in the browser.

Summary
- Device: Raspberry Pi Pico W (Wokwi simulation, MicroPython)
- Sensor: DHT22 (temperature & humidity)
- Ingest: ThingSpeak channel
- Backend: Node.js / Express (fetches ThingSpeak, hides keys)
- Frontend: Chart.js dashboard (fetches backend /api/feeds)
- Default local URL: http://localhost:3000/

Repository layout
- wokwi/ — MicroPython code and Wokwi diagram (main.py, diagram.json)
- backend/ — Node.js / Express server (server.js, .env.example, package.json)
- frontend/ — HTML + Chart.js (index.html, app.js)
- README.md — this file

Prerequisites
- Node.js 14+ and npm
- Internet access for ThingSpeak reads/writes
- Wokwi (for simulation) or a Raspberry Pi Pico W running equivalent MicroPython

Backend — quick install & run
1. cd iot-pipeline/backend
2. Copy example env and edit:
   - cp .env.example .env
   - Edit .env and set:
     - PORT=3000
     - CHANNEL_ID=<your_channel_id>
     - READ_API_KEY=<your_thingspeak_read_key_or_empty_if_public>
     - (Optional) WRITE_API_KEY=<your_thingspeak_write_key_for_device>
3. Install and start:
   - npm install
   - npm start
The backend exposes an API (e.g. GET /api/feeds) and can serve the frontend's static files if configured.

Frontend — quick run
- If backend serves static files, open: http://localhost:3000/
- Otherwise, serve the frontend folder with a simple static server:
  - cd iot-pipeline/frontend
  - npx serve .
  - Open the reported URL or open index.html directly for quick testing.

Wokwi / MicroPython (device) — quick steps
- Open wokwi/diagram.json in Wokwi.
- Ensure wokwi/main.py contains the correct ThingSpeak WRITE API key and channel ID (or configure the simulation accordingly).
- Start the simulation — the device will POST measurements to ThingSpeak.

API
- GET /api/feeds — backend endpoint that returns recent ThingSpeak channel values (backend proxies ThingSpeak and keeps keys hidden)

Troubleshooting
- Check backend logs for network or API errors.
- Use browser DevTools (Console/Network) to inspect frontend requests.
- Verify .env values and ensure API keys are not committed.
- In Wokwi, check the simulator console to confirm sensor reads and POSTs.

Security
- Do not commit API keys or secrets. Add .env to .gitignore.
- Use the backend to avoid exposing ThingSpeak keys to the browser.
