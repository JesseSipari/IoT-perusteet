google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart);

function drawChart() {
  fetch('https://api.thingspeak.com/channels/3079297/feeds.json?api_key=II4XLFVZGA1Z1R9O')
    .then(response => response.json())
    .then(jsonData => {
      const chartData = [['Time', 'Temperature']];
      jsonData.feeds.forEach(item => {
        const temp = parseFloat(item.field1);
        if (!isNaN(temp)) {
          chartData.push([new Date(item.created_at), temp]);
        }
      });

      var data = google.visualization.arrayToDataTable(chartData);

      var options = {
        title: 'Temperature Over Time',
        curveType: 'function',
        legend: { position: 'bottom' }
      };

      var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
      chart.draw(data, options);
    })
    .catch(error => {
      console.error('Error fetching temperature data:', error);
    });
}