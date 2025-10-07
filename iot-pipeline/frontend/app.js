// ---- CONFIG ----
const DEFAULT_CHANNEL_ID = '3079297';
const DEFAULT_RESULTS = 60;
const REFRESH_MS = 20000; 

// ---- CHART ----
const ctx = document.getElementById('chart').getContext('2d');
const chart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: [],
    datasets: [
      { label: 'Temperature (°C)', data: [], yAxisID: 'y1', tension: 0.25, fill: false },
      { label: 'Humidity (%)',    data: [], yAxisID: 'y2', tension: 0.25, fill: false }
    ]
  },
  options: {
    animation: false,
    responsive: true,
    interaction: { mode: 'index', intersect: false },
    scales: {
      x:  { title: { display: true, text: 'Time' } },
      y1: { type: 'linear', position: 'left',  title: { display: true, text: '°C' } },
      y2: { type: 'linear', position: 'right', title: { display: true, text: '%' }, grid: { drawOnChartArea: false } }
    },
    plugins: { legend: { position: 'bottom' } }
  }
});

function setStatus(msg) {
  document.getElementById('status').textContent = msg || '';
}

async function fetchData() {
  const channelId = (document.getElementById('channelId').value || DEFAULT_CHANNEL_ID).trim();
  const results   = (document.getElementById('results').value   || DEFAULT_RESULTS).trim();

  if (!channelId) {
    setStatus('Set Channel ID first.');
    return;
  }


  const url = `/api/feeds?results=${encodeURIComponent(results)}&channelId=${encodeURIComponent(channelId)}`;

  try {
    setStatus('Fetching...');
    const resp = await fetch(url);
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    const json = await resp.json();
    const feeds = json.feeds || [];

    const labels = feeds.map(f => new Date(f.created_at).toLocaleTimeString());
    const temps  = feeds.map(f => parseFloat(f.field1));
    const hums   = feeds.map(f => parseFloat(f.field2));

    chart.data.labels = labels;
    chart.data.datasets[0].data = temps;
    chart.data.datasets[1].data = hums;
    chart.update();

    if (feeds.length) {
      const last = feeds[feeds.length - 1];
      document.getElementById('latest').textContent =
        `Latest: ${Number(last.field1).toFixed(1)} °C, ${Number(last.field2).toFixed(1)} % at ${new Date(last.created_at).toLocaleString()}`;
      setStatus(`OK (${feeds.length} records)`);
    } else {
      document.getElementById('latest').textContent = 'No data yet.';
      setStatus('Channel might be empty.');
    }
  } catch (err) {
    console.error(err);
    document.getElementById('latest').textContent = 'Error fetching data.';
    setStatus(String(err.message));
  }
}

// Init
document.getElementById('channelId').value = DEFAULT_CHANNEL_ID;
document.getElementById('results').value   = DEFAULT_RESULTS;
document.getElementById('reload').addEventListener('click', fetchData);

fetchData();
setInterval(fetchData, REFRESH_MS);
