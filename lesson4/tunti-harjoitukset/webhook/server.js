import express from 'express';

const app = express();
const port = 3000;

// Ketunkolo
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1422881414805848064/v4Plrwpy7fgF44087yDFSXTP0pDFnpjU2wEg2wexoO0mb1NJTxdhToVqQ30oNiHjeEjq';

// Miran discord
// const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1422173095879507969/vQQ_ksXiJe_mSFKglShgpuzaATHC7zKMErb2a8P5h2xIr5-OQ9oLkvYLgMrcHVGzDGtH';
app.use(express.json());

app.post('/notify', (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }

    fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: message })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Discord responded with status ${response.status}');
        }
        res.json({ status: 'Message sent to Discord' });

    })
    .catch(error => {
        console.error('Error sending message to Discord:', error);
        res.status(500).json({ error: 'Failed to send message to Discord' });
    })
})

app.listen(port, () => {
    console.log(`Server running at localhost:${port}`);
});
