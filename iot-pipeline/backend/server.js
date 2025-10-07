// server.js
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const DEFAULT_CHANNEL_ID = process.env.CHANNEL_ID || '';
const READ_API_KEY = process.env.READ_API_KEY || '';

// Build ThingSpeak URL
function tsUrl(channelId, results = 10) {
  const q = new URLSearchParams({ results: String(results) });
  if (READ_API_KEY) q.set('api_key', READ_API_KEY); 
  return `https://api.thingspeak.com/channels/${channelId}/feeds.json?${q.toString()}`;
}

app.get('/api/health', (_req, res) => res.json({ ok: true }));


app.get('/api/feeds', async (req, res) => {
  try {
    const results = Number(req.query.results || 60);
    const channelId = (req.query.channelId || process.env.CHANNEL_ID || '').toString().trim();
    if (!channelId) return res.status(400).json({ error: 'Missing channelId (query or .env)' });

    const r = await fetch(tsUrl(channelId, results));
    if (!r.ok) return res.status(r.status).json({ error: `ThingSpeak HTTP ${r.status}` });
    res.json(await r.json());
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/last', async (req, res) => {
  try {
    const channelId = (req.query.channelId || DEFAULT_CHANNEL_ID).toString().trim();
    if (!channelId) return res.status(400).json({ error: 'Missing channelId (query or .env)' });

    const r = await fetch(tsUrl(channelId, 1));
    if (!r.ok) return res.status(r.status).json({ error: `ThingSpeak HTTP ${r.status}` });
    const json = await r.json();
    const last = (json.feeds || [])[0];
    if (!last) return res.json(null);
    res.json({
      at: last.created_at,
      temperature: Number(last.field1),
      humidity: Number(last.field2)
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.use(express.static(path.join(__dirname, '../frontend')));
app.listen(PORT, () => console.log(`Backend on http://localhost:${PORT}`));

app.use(express.static(path.join(__dirname, '../frontend')));

// Fallback to index.html
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});