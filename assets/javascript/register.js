// assets/javascript/register.js
const registerForm = document.getElementById('register-form');

registerForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;

    fetch('http://localhost:8080/user/register', { // Pastikan URL ini sesuai dengan backend Anda
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password, role }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Registration failed');
        }
        return response.json();
    })
    .then(data => {
        alert('Registration successful! Welcome, ' + data.user.username);
        // Redirect based on role
        if (data.user.role === 'admin') {
            window.location.href = 'admin_home.html'; // Redirect to admin home page
        } else {
            window.location.href = 'user_home.html'; // Redirect to user home page
        }
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        alert('Registration failed: ' + error.message);
    });
});
