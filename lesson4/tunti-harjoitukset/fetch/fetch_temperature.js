const url = 'https://api.thingspeak.com/channels/3079297/feeds.json?api_key=II4XLFVZGA1Z1R9O';
fetch(url)
    .then(response => response.json())
    .then(data => {
        const feeds = data.feeds;
        const temperatures = feeds.map(feed => ({
            time: feed.created_at,
            temperature: parseFloat(feed.field1)
        }));
        document.getElementById('output').textContent = JSON.stringify(temperatures);
        console.log(temperatures);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        document.getElementById('output').textContent = 'Error fetching data';
    });