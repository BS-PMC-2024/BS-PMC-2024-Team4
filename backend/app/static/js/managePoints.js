var map;
var mapInitialized = false;
var editMode = false; // Flag to indicate if we are editing an existing point
var currentTempMarker = null; // To keep track of the current temporary marker
var markers = {}; // To store all the markers

function initializeMap() {
    if (mapInitialized) return;  // Prevent reinitializing the map

    console.log('Initializing map...');

    map = L.map('map').setView([31.245681880715527, 34.79232788085938], 13);

    // Load and display tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);

    // Fetch and display points of interest
    loadPoints();

    // Add a marker on map click for adding a new point
    map.on('click', function (e) {
        var lat = e.latlng.lat;
        var lng = e.latlng.lng;
        document.getElementById('pointType').disabled = false;
        document.getElementById('submitPointButton').textContent = "Add New Point";
        
        // Reset the form and edit mode
        resetForm();
        handleAddress("park");
    
        // Place a temporary marker on the map at the clicked location
        if (currentTempMarker) {
            map.removeLayer(currentTempMarker);
        }
        document.getElementById('pointLocation').value = `${lat}, ${lng}`;
        currentTempMarker = L.marker([lat, lng], {
            icon: L.icon({
                iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34] 
            })
        }).addTo(map)
          .bindPopup("New Point")
          .openPopup();
    });

    mapInitialized = true;
}

async function loadPoints() {
    const response = await fetch('/manager/listPointsOfInterest');
    const data = await response.json();
    console.log(data);

    data.points_of_interest.forEach(point => {
        var markerOptions = {};

        // Change marker options based on the type of point
        if (point.type === 'park') {
            markerOptions = {
                icon: L.icon({
                    iconUrl: '/static/dog-park.svg',
                    iconSize: [35, 51],
                    iconAnchor: [16, 41],
                    popupAnchor: [1, -34]
                })
            };
        } else if (point.type === 'water') {
            markerOptions = {
                icon: L.icon({
                    iconUrl: 'https://img.icons8.com/?size=100&id=11922&format=png&color=000000',
                    iconSize: [35, 35],
                    iconAnchor: [16, 41],
                    popupAnchor: [1, -34]
                })
            };
        }

        // Add marker to the map with appropriate options and add click event to edit point
        const marker = L.marker([point.location.lat, point.location.lng], markerOptions)
            .addTo(map)
            .bindPopup(point.point_name)
            .on('click', () => editPoint(point, marker));
        
        markers[point.point_id] = marker;
    });
}

function editPoint(point, marker) {
    // Populate the form with point details
    document.getElementById('pointId').value = point.point_id; // Store point ID for updating
    document.getElementById('pointName').value = point.point_name;
    document.getElementById('pointType').value = point.type;
    document.getElementById('pointType').disabled = true;
    document.getElementById('pointLocation').value = `${point.location.lat}, ${point.location.lng}`;
    document.getElementById('submitPointButton').textContent = "Update Point";

    // Show the Remove button
    document.getElementById('removePointButton').style.display = 'block';

    // Set edit mode to true
    editMode = true;

    handleAddress(point.type);
    if(point.type == 'park') {
        console.log(point.park_address)
        document.getElementById('parkAddress').value = point.park_address;
    }

    // Remove the temporary marker if it exists
    if (currentTempMarker) {
        map.removeLayer(currentTempMarker);
        currentTempMarker = null;
    }

    // Open the popup for the marker
    marker.openPopup();
}

// Handle form submission to add/update points
document.getElementById('pointForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    var pointName = document.getElementById('pointName').value;
    var pointType = document.getElementById('pointType').value;
    var location = document.getElementById('pointLocation').value.split(', ');
    var parkAddress = "";
    
    if(pointType === 'park') {
        console.log(pointType)
        parkAddress = document.getElementById('parkAddress').value
    }

    // Check if we are in edit mode or adding a new point
    const url = editMode ? `/manager/updatePointOfInterest/${document.getElementById('pointId').value}` : '/manager/addPointOfInterest';
    const method = editMode ? 'PUT' : 'POST';

    const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            point_name: pointName,
            type: pointType,
            location: { lat: location[0], lng: location[1] },
            park_address: parkAddress,
        })
    });

    const data = await response.json();
    if (data.success) {
        alert('Point of Interest saved successfully!');
        loadPoints();
        resetForm(); // Reset form after successful submission
    } else {
        alert('Failed to save Point of Interest: ' + data.error);
    }
});

// Handle point removal
document.getElementById('removePointButton').addEventListener('click', async function () {
    const pointId = document.getElementById('pointId').value;
    const pointType = document.getElementById('pointType').value;

    if (confirm('Are you sure you want to remove this point?')) {
        const response = await fetch(`/manager/deletePointOfInterest/${pointId}?type=${pointType}`, {
            method: 'DELETE'
        });

        const data = await response.json();
        if (data.success) {
            alert('Point of Interest removed successfully!');
            map.removeLayer(markers[pointId]); // Remove the marker from the map
            delete markers[pointId]; // Remove the marker from the markers object
            resetForm();
            loadPoints();
        } else {
            alert('Failed to remove Point of Interest: ' + data.error);
        }
    }
});

function resetForm() {
    document.getElementById('pointForm').reset();
    document.getElementById('pointId').value = ''; // Clear point ID
    document.getElementById('removePointButton').style.display = 'none'; // Hide the Remove button
    document.getElementById('parkAddress').value = ''; // Clear park address
    editMode = false; // Exit edit mode
    if (currentTempMarker) {
        map.removeLayer(currentTempMarker); // Remove the temporary marker from the map
        currentTempMarker = null;
    }
}

function handleAddress(val) {
    const addressInput = document.getElementById('parkAddress');
    const addressLabel = document.getElementById('parkAddressLabel');
    
    if(val == "park") {
        addressInput.setAttribute('required', 'true');
        addressInput.hidden = false;
        addressLabel.hidden = false;
        document.getElementById('pointName').setAttribute('required', 'true');
    }
    else {
        addressInput.value = "";
        addressInput.removeAttribute('required')
        addressInput.hidden = true;
        addressLabel.hidden = true;
        document.getElementById('pointName').removeAttribute('required');
        document.getElementById('pointName').value = "Unnamed Water Spot";
    }

}
