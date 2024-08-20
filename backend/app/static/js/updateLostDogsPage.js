function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";

    if (tabName === 'ManagePoints') {
      initializeMap();
      setTimeout(() => map.invalidateSize(), 100); // Adjust the map size if the tab was hidden
  }
  }

  function loadLostDogReports() {
    fetch('/manager/getLostDogReports')
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector('#lostDogsTable tbody');
            tableBody.innerHTML = ''; // Clear existing rows
            data.reports.forEach(report => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${report.dog_name}</td>
                    <td>${report.lost_area}</td>
                    <td>${report.owner_phone}</td>
                    <td class="actions">
                        <button class="btn btn-move" onclick="moveReport('${report._id}')">Move to Permanent</button>
                        <button class="btn btn-delete" onclick="deleteReport('${report._id}')">Delete Report</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching lost dog reports:', error);
        });
}


function moveReport(reportId) {
    fetch(`/manager/moveReport/${reportId}`, {
        method: 'POST'
    })
    .then(response => response.json())
    .then(result => {
        alert(result.message);
        if (result.success) {
            location.reload();
        }
    });
}

function deleteReport(reportId) {
    fetch(`/manager/deleteReport/${reportId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(result => {
        alert(result.message);
        if (result.success) {
            location.reload();
        }
    });
}