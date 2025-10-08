# IoT-pipeline

A small IoT pipeline used in the *"IoT-perusteet"* course.
A **Raspberry Pi Pico W** (simulated in **Wokwi** using **MicroPython**) reads temperature and humidity from a **DHT22** sensor, posts the measurements to **ThingSpeak**, and a **Node.js / Express** backend serves the data to a **Chart.js** dashboard in the browser.

---

## Summary

* **Device:** Raspberry Pi Pico W (Wokwi simulation, MicroPython)
* **Sensor:** DHT22 (temperature & humidity)
* **Ingest:** ThingSpeak channel
* **Backend:** Node.js / Express (fetches ThingSpeak, hides keys)
* **Frontend:** Chart.js dashboard (fetches backend `/api/feeds`)
* **Default local URL:** [http://localhost:3000/](http://localhost:3000/)

---

## Repository layout

```
iot-pipeline/
├─ wokwi/       — MicroPython code and Wokwi diagram (main.py, diagram.json)
├─ backend/     — Node.js / Express server (server.js, .env.example, package.json)
├─ frontend/    — HTML + Chart.js (index.html, app.js)
└─ README.md    — this file
```

---

## Prerequisites

* Node.js 14+ and npm
* Internet access for ThingSpeak reads/writes
* Wokwi (for simulation) or a Raspberry Pi Pico W running equivalent MicroPython

---

## Backend — quick install & run

1. Change directory:

   ```bash
   cd iot-pipeline/backend
   ```

2. Copy the example environment file and edit it:

   ```bash
   cp .env.example .env
   ```

3. Edit `.env` and set your own values:

   ```env
   PORT=3000
   CHANNEL_ID=<your_channel_id>
   READ_API_KEY=<your_thingspeak_api_key>
   ```

4. Install dependencies and start the backend:

   ```bash
   npm install
   npm start
   ```

The backend exposes an API (e.g. `GET /api/feeds`) and can also serve the frontend's static files if configured.

---

## Frontend — quick run

Open `frontend/index.html` in your browser **while the backend is running**.
The dashboard automatically requests data from `http://localhost:3000/api/feeds`.

---

## Wokwi / MicroPython (device) — quick steps

* Open `wokwi/diagram.json` in [Wokwi](https://wokwi.com/).
* Ensure `wokwi/main.py` contains the correct **ThingSpeak WRITE API key** and **channel ID** (or configure the simulation accordingly).
* Start the simulation — the device will POST measurements to ThingSpeak automatically.

---

## API

* **GET** `/api/feeds` — backend endpoint that returns recent ThingSpeak channel values
  (backend proxies ThingSpeak and keeps keys hidden)

Example request:

```bash
curl http://localhost:3000/api/feeds
```

---

## Troubleshooting

* Check backend logs for network or API errors.
* Use browser DevTools (Console/Network) to inspect frontend requests.
* Verify `.env` values and ensure API keys are not committed.
* In Wokwi, open the simulator console to confirm sensor reads and POSTs.

---

## Security

* Do **not** commit API keys or secrets.
* Add `.env` to `.gitignore`.
* Always use the backend to avoid exposing ThingSpeak keys to the browser.

---
* `npx serve` on korvattu ohjeella avata `index.html` suoraan.
* Yleisilme on yhtenäinen ja GitHubissa selkeästi luettava.

Haluatko, että teen vielä “How it works” tai “System diagram” -osion tämän perään? Se antaisi visuaalisen kokonaiskuvan (esim. ASCII-kaavio tai lyhyt 4-vaiheinen datavirran kuvaus).
