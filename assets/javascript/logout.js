document.addEventListener('DOMContentLoaded', () => {
    // Ambil elemen tombol logout dan cancel
    const logoutButton = document.querySelector('.logout-btn');
    const cancelButton = document.querySelector('.cancel-btn');
  
    // Tambahkan event listener untuk tombol Logout
    logoutButton.addEventListener('click', (event) => {
      // Konfirmasi tambahan sebelum logout
      const confirmLogout = confirm('Are you sure you want to log out?');
      if (!confirmLogout) {
        // Batalkan navigasi jika pengguna menekan "Cancel"
        event.preventDefault();
      }
    });
  
    // Tambahkan event listener untuk tombol Cancel (opsional)
    cancelButton.addEventListener('click', () => {
      // Anda dapat menambahkan logika tambahan di sini jika diperlukan
      console.log('Logout canceled.');
    });
  });
  