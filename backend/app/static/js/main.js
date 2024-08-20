// Fetch users when the page loads
window.onload = function() {
    fetchUsers();
    fetchReports();
    fetchTemperatureData();
    fetchOvercrowdingData();
};