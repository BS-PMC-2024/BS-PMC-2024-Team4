let selectedReportAddress = '';

function fetchApprovedReports() {
    fetch('/manager/getApprovedReports')
    .then(response => response.json())
    .then(Allreports => {
        populateNotificationTable(Allreports);
    })
    .catch(error => {
        console.error('Error fetching users:', error);
    });
}

function populateNotificationTable(rows) {
    const tbody = document.getElementById('notifyTableBody');
    tbody.innerHTML = ''; 
    tbody.innerHTML = '';

    rows.forEach(row => {
        const tr = document.createElement('tr');
        tr.dataset.address = row.address; 
        tr.innerHTML = `
            <td>${row.type}</td>
            <td>${row.address}</td>
            <td>${row.description}</td>
        `;
        tbody.appendChild(tr);

        // Add click event listener to the row
        tr.addEventListener('click', () => handleRowClick(tr));
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const table = document.getElementById('approved_reports');
    table.addEventListener('click', (event) => {
        const rows = table.querySelectorAll('tr');
        rows.forEach(row => row.classList.remove('selected'));
        
        let target = event.target;
        while (target && target.nodeName !== 'TR') {
            target = target.parentElement;
        }
        if (target) {
            target.classList.add('selected');
        }
    });
});
function handleRowClick(row) {
    // Remove 'selected' class from previously selected row
    const previouslySelected = document.querySelector('.selected');
    if (previouslySelected) {
        previouslySelected.classList.remove('selected');
    }

    // Add 'selected' class to the clicked row
    row.classList.add('selected');
    selectedReportAddress = row.dataset.address; 
}

function getSelectedRowAddress() {
    return selectedReportAddress;
}

function handleNotifySubmit() {
    const title = document.getElementById('notificationTitle').value;
    const message = document.getElementById('notificationMessage').value;
    const address = getSelectedRowAddress();
    
    if (!title || !message || !address) {
        alert('Please fill in both the title and the message.');
        return;
    }

    const notificationData = { 
        title: title,
        message: message,
        address: address
    }

    fetch('/manager/SendNotification', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationData),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        // Handle the response data
        alert('Notification sent successfully!');
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Failed to send notification.');
    });
}
