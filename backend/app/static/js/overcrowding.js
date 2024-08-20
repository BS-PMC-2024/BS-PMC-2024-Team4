document.addEventListener("DOMContentLoaded", function() {
    function populateOvercrowdingReport(data) {
        const tbody = document.getElementById('overcrowdingReportTableBody');
        tbody.innerHTML = ''; // Clear previous content

        data.forEach(park => {
            const row = document.createElement('tr');
            const location = park.Location ? `${park.Location.lat}, ${park.Location.lng}` : 'N/A';

            row.innerHTML = `
                <td>${location}</td>
                <td>${park.Overcrowding}</td>
            `;

            tbody.appendChild(row);
        });
    }

    function fetchOvercrowdingData() {
        fetch('/manager/overcrowdingReport')
            .then(response => response.json())
            .then(data => {
                populateOvercrowdingReport(data.readings_data);
            })
            .catch(error => {
                console.error('Error fetching overcrowding data:', error);
            });
    }

    fetchOvercrowdingData();

    document.getElementById('updateButton').addEventListener('click', fetchOvercrowdingData);
});
