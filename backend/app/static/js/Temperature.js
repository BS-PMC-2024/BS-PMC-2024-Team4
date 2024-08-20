
document.addEventListener("DOMContentLoaded", function() {
    function populateTemperatureReport(data) {
        const tbody = document.getElementById('temperatureTableBody');
        tbody.innerHTML = ''; 

        data.forEach(reading => {
            const row = document.createElement('tr');
            const location = reading.Location ? `${reading.Location.lat}, ${reading.Location.lng}` : 'N/A';
            const sampleTime = new Date(reading.sample_time_utc).toLocaleString();

            row.innerHTML = `
                <td>${reading.Temperature}</td>
                <td>${location}</td>
                <td>${sampleTime}</td>
            `;

            tbody.appendChild(row);
        });
    }

    function fetchTemperatureData() {
        fetch('/manager/TemperatureReport')
            .then(response => response.json())
            .then(data => {
                populateTemperatureReport(data.readings_data);
            })
            .catch(error => {
                console.error('Error fetching temperature data:', error);
            });
    }

    fetchTemperatureData();

    document.getElementById('updateButton').addEventListener('click', fetchTemperatureData);
});

