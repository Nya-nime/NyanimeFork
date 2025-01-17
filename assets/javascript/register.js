const registerForm = document.getElementById('register-form');  
  
registerForm.addEventListener('submit', (event) => {  
    event.preventDefault();  
  
    const username = document.getElementById('username').value;  
    const email = document.getElementById('email').value;  
    const password = document.getElementById('password').value;  
  
    fetch('http://localhost:8080/user/register', {  
        method: 'POST',  
        headers: {  
            'Content-Type': 'application/json',  
        },  
        body: JSON.stringify({ username, email, password }),  
    })  
    .then(response => {  
        if (!response.ok) {  
            throw new Error('Registration failed');  
        }  
        return response.json();  
    })  
    .then(data => {  
        alert('Registration successful! Welcome, ' + data.user.username);  
        localStorage.setItem('jwtToken', data.token); // Simpan token  
        localStorage.setItem('userId', data.userId);  
        // Redirect to user home page  
        window.location.href = 'user_home.html'; // Redirect ke halaman beranda  
    })  
    .catch(error => {  
        console.error('There was a problem with the fetch operation:', error);  
        alert('Registration failed: ' + error.message);  
    });  
});