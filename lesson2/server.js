const express = require('express');
const app = express();
const port = 3000;
// GET endpoint
app.get('/api/sensor', (req, res) => {
    res.json({
    temperature: 28.5,
    humidity: 55,
    status: "OK"
});
});
app.listen(port, () => {
    console.log(`Server running at
    http://localhost:${port}`);
});