const loginForm = document.getElementById('login-form');

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const email = document.getElementById('email').value; // Ganti username dengan email
  const password = document.getElementById('password').value;

  // Validasi input
  if (!email || !password) {
    alert('Please enter both email and password.');
    return; // Hentikan eksekusi jika input tidak valid
  }

  fetch('http://localhost:8080/user/login', { // Pastikan URL sesuai dengan endpoint backend Anda
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }), // Kirim email dan password
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Login failed: ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      // Cek apakah token ada dalam respons
      if (data.token) {
        // Simpan token di localStorage
        localStorage.setItem('jwtToken', data.token);
        
        // Redirect berdasarkan peran
        if (data.user.role === 'admin') {
          window.location.href = 'admin_home.html'; // Redirect ke halaman admin
        } else {
          window.location.href = 'user_home.html'; // Redirect ke halaman user
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
