const logoutButton = document.getElementById('logout');

// Fetch profile data (mocked for demonstration)
fetch('/api/user/profile')
  .then((response) => response.json())
  .then((data) => {
    document.querySelector('.username').textContent = data.username;
    document.querySelector('.profile-pic').src = data.profilePic;
    document.querySelector('.stat:nth-child(1) h2').textContent = data.filmsCount;
    document.querySelector('.stat:nth-child(2) h2').textContent = data.followingCount;
    document.querySelector('.stat:nth-child(3) h2').textContent = data.followersCount;
  });

  const token = localStorage.getItem('jwtToken');
  if (!token) {
      // Jika tidak ada token, arahkan ke halaman login
      window.location.href = 'llogin.html'; // Ganti dengan URL halaman login Anda
  }

// Logout functionality
logoutButton.addEventListener('click', () => {
  fetch('/api/logout', { method: 'POST' })
    .then(() => {
      window.location.href = 'index.html';
    });
});
