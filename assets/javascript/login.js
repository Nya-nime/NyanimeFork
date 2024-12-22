const loginForm = document.getElementById('llogin-form'); // Pastikan ID ini benar

loginForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Mencegah pengiriman form default

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Validasi input
    if (!email || !password) {
        alert('Please enter both email and password.');
        return;
    }

    console.log('Attempting to log in with:', { email, password });

    fetch('http://localhost:8080/user/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })
    .then(response => {
        console.log('Response status:', response.status); // Log status respons
        if (!response.ok) {
            throw new Error('Login failed: ' + response.statusText);
        }
        return response.json(); // Mengembalikan respons dalam format JSON
    })
    .then(data => {
        console.log('Response data:', data); // Log data respons
        if (data.token) {
            // Simpan token di localStorage
            localStorage.setItem('jwtToken', data.token);
            console.log('Token saved:', data.token); // Log token yang disimpan

            // Arahkan pengguna berdasarkan peran
            if (data.user && data.user.role === 'admin') {
                window.location.href = 'admin_home.html'; // Halaman untuk admin
            } else {
                window.location.href = 'user_home.html'; // Halaman untuk pengguna biasa
            }
        } else {
            alert('Login failed: No token received.');
        }
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
        alert('Login failed: ' + error.message);
    });
});
