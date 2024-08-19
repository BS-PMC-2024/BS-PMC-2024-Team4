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
        }

        function loadManageUsersContent() {
            const contentDiv = document.getElementById('manageUsersContent');
            if (contentDiv.innerHTML === '') {
                fetch('/manager/manageUsersPage')
                .then(response => response.text())
                .then(html => {
                    contentDiv.innerHTML = html;
                    fetchUsers(); 
                })
                .catch(error => {
                    console.error('Error fetching the Manage Users content:', error);
                });
            }
        }

        function deleteUser(userId) {
            //change the confirm into a popup window designed
            const confirmDelete = confirm('Are you sure you want to delete this user?');
            if(confirmDelete)
            {
                fetch(`/manager/deleteUser/${userId}`, {
                method: 'DELETE'
                })
                .then(response => {
                    if (response.ok) {
                        document.getElementById(`user-row-${userId}`).remove();
                    } else {
                        alert('Failed to delete user');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            }
            
        }

        // adding users to table
        function populateUsers(users) {
            const tbody = document.getElementById('userTableBody');
            tbody.innerHTML = ''; // Clear existing rows
            users.forEach(user => {
                const row = document.createElement('tr');
                row.id = `user-row-${user._id}`;
                row.innerHTML = `
                    <td>${user._id}</td>
                    <td>${user.email}</td>
                    <td><span class="delete-button" onclick="deleteUser('${user._id}')">Delete</span></td>
                `;
                tbody.appendChild(row);
            });
        }

        // Fetch users and put them in the table when the page loads
        function fetchUsers() {
            fetch('/manager/getUsers')
            .then(response => response.json())
            .then(Allusers => {
                populateUsers(Allusers);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });
        }

        // Fetch users when the page loads
        window.onload = function() {
            fetchUsers();
            fetchReports();
        };