function countWaitingStatusFromDOM() {
    const statusCells = document.querySelectorAll('td[id^="status-"]'); // Select all td elements with ids starting with 'status-'
    let count = 0;
    statusCells.forEach(cell => {
        if (cell.textContent === 'waiting') {
            count++;
        }
    });
    console.log('Number of waiting reports:', count);
    return count;
}

// adding users to table
function populateReports(reports) {
    const tbody = document.getElementById('reportsTableBody');
    tbody.innerHTML = ''; 
    
    reports.forEach(report => {
        const row = document.createElement('tr');
        row.id = `report-row-${report._id}`;
        let buttonHTML = '';
        let statusStyle = '';
        
        if (report.status === 'waiting') { 
            buttonHTML = `<button class="button_table" onclick="updateStatus('${report._id}', '${report.user_id}', 'Backend')">Backend</button>
                        <button class="button_table" onclick="updateStatus('${report._id}', '${report.user_id}', 'Frontend')">Frontend</button>`;
            statusClass = 'status-waiting';
            statusStyle = 'color: red;'; 
        } else if (report.status === 'In Progress') {
            statusStyle = 'color: green;';
        }

    row.innerHTML = `
        <td>${report._id}</td>
        <td>${report.description}</td>
        <td id="status-${report._id}" style="${statusStyle}">${report.status}</td>
        <td>${buttonHTML}</td>
    `;
    tbody.appendChild(row);
    });
    if (countWaitingStatusFromDOM()==0){
        alert("There are no new reports pending! ");
    }
}

function updateStatus(reportId, userId, team) {
    fetch(`/manager/update-status/${reportId}/${userId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'In Progress' })
    })
    .then(response => response.json())
    .then(data => {
        //alert(`Report is now in progress and will be handled by the ${team} team soon.`);
        document.getElementById(`status-${reportId}`).innerText = 'In Progress';
        alert(`Report is now in progress and will be handled by the ${team} team soon.`);
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    })
    .catch(error => {
        console.error('Error updating status:', error);
    });
}

 // Fetch users and put them in the table when the page loads
function fetchReports() {
    fetch('/manager/getReports')
    .then(response => response.json())
    .then(Allreports => {
        populateReports(Allreports);
    })
    .catch(error => {
        console.error('Error fetching users:', error);
    });
}
