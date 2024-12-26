document.addEventListener('DOMContentLoaded', () => {
    const addAnimeButton = document.getElementById('add-anime-button');
    const heroSection = document.getElementById('hero-section');
    const addAnimeForm = document.getElementById('add-anime-form');
    const adminAnimeList = document.getElementById('anime-list');
    const cancelButton = document.getElementById('cancel-button');
    const adminLogoutButton = document.getElementById('logout');

    // Tampilkan form penambahan anime
    addAnimeButton.addEventListener('click', () => {
        console.log('Add Anime button clicked'); // Log ketika tombol diklik
        heroSection.style.display = 'block'; // Tampilkan hero section
        addAnimeButton.style.display = 'none'; // Sembunyikan tombol "Add Anime"
    });

    // Sembunyikan form penambahan anime dan reset form
    cancelButton.addEventListener('click', () => {
        heroSection.style.display = 'none'; // Sembunyikan hero section
        addAnimeForm.reset(); // Reset form
        addAnimeButton.style.display = 'block'; // Tampilkan kembali tombol "Add Anime"
    }); 
    // Menangani pengiriman form penambahan anime
    addAnimeForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const genre = document.getElementById('genre').value;
        const releaseDate = document.getElementById('release-date').value;

        fetch('http://localhost:8080/anime', { // Ganti dengan URL lengkap
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, description, genre, releaseDate }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to add anime');
            }
            return response.json();
        })
        .then(data => {
            const newAnime = `<div class="anime-item" id="anime-${data.id}">${data.title} <button onclick="editAnime(${data.id})">Edit</button> <button onclick="deleteAnime(${data.id})">Delete</button></div>`;
            adminAnimeList.innerHTML += newAnime;
            heroSection.style.display = 'none'; // Sembunyikan hero section setelah menambahkan anime
            addAnimeForm.reset(); // Reset form
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });

    // Fungsi untuk mengedit anime
    window.editAnime = function(id) {
        const title = prompt("Enter new title:");
        const description = prompt("Enter new description:");
        const genre = prompt("Enter new genre:");
        const releaseDate = prompt("Enter new release date:");

        fetch(`http://localhost:8080/anime/${id}`, { // Ganti dengan URL lengkap
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, title, description, genre, releaseDate }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to edit anime');
            }
            return response.json();
        })
        .then(data => {
            document.getElementById(`anime-${id}`).innerHTML = `${data.title} <button onclick="editAnime(${data.id})">Edit</button> <button onclick="deleteAnime(${data.id})">Delete</button>`;
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    // Fungsi untuk menghapus anime
    window.deleteAnime = function(id) {
        fetch(`http://localhost:8080/anime/${id}`, { // Ganti dengan URL lengkap
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete anime');
            }
            document.getElementById(`anime-${id}`).remove();
        })
        .catch(error => {
            console.error('Error:', error);
        });
    };

    // Menangani logout
    adminLogoutButton.addEventListener('click', (event) => {
        event.preventDefault(); // Mencegah default action dari link
    
        const token = localStorage.getItem('jwtToken'); // Ambil token dari localStorage
    
        if (!token) {
            alert('You are not logged in.'); // Jika tidak ada token, tampilkan pesan
            return;
        }
    
        console.log('Token being sent:', token); // Log token yang akan dikirim
    
        fetch('http://localhost:8080/user/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Kirim token dalam header Authorization
            }
        })
        .then(response => {
            console.log('Logout response status:', response.status); // Log status respons
            if (!response.ok) {
                return response.text().then(errorMessage => {
                    throw new Error('Logout failed: ' + errorMessage);
                });
            }
            return response.text(); // Atau response.json() jika Anda mengembalikan JSON
        })
        .then(data => {
            console.log(data); // Tampilkan pesan sukses
            localStorage.removeItem('jwtToken'); // Hapus token dari localStorage
            console.log("Redirecting to login page...");
            window.location.href = 'login.html'; // Ganti dengan URL halaman login Anda
        })
        .catch(error => {
            console.error('Error during logout:', error);
            alert('Logout failed: ' + error.message);
        });
    });

    // Mengganti entri terakhir di riwayat browser
    history.replaceState(null, null, window.location.href);
});
