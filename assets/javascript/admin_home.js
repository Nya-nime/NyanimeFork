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
        heroSection.style.display = 'none'; // Sembunyikan hero section-
        addAnimeForm.reset(); // Reset form
        addAnimeButton.style.display = 'block'; // Tampilkan kembali tombol "Add Anime"
    });

    // Menangani pengiriman form penambahan anime
    addAnimeForm.addEventListener('submit', (event) => {
        event.preventDefault();
    
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const genre = document.getElementById('genre').value;
        const releaseDate = document.getElementById('release_date').value;
    
    
        // Ambil ID pengguna dari localStorage
        const createdBy = localStorage.getItem('userId');
        console.log('Created By:', createdBy); // Log untuk memeriksa nilai createdBy
        if (!createdBy) {
            alert('User ID is required!');
            return;
        }
    
        // Log payload yang akan dikirim
        console.log('Payload to send:', JSON.stringify({ 
            title, 
            description, 
            genre, 
            releaseDate,
            createdBy 
        }));
    
        fetch('http://localhost:8080/anime/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            },
            body: JSON.stringify({ 
                title, 
                description, 
                genre, 
                releaseDate,
                createdBy 
            }),
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    console.error('Error message from server:', text);
                    throw new Error('Failed to add anime: ' + text);
                });
            }
            return response.json();
        })
        .then(({ status, data }) => {
            console.log('Response data:', data);
            if (status !== 200 && status !== 201) {
                throw new Error(`Failed to add anime. Status: ${status}, Message: ${data.message || 'Unknown error'}`);
            }
    
            const newAnime = `
                <div class="anime-item" id="anime-${data.id}">
                    <h3>${data.title}</h3>
                    <p>${data.description}</p>
                    <p>Genre: ${data.genre}</p>
                    <p>Release Date: ${data.releaseDate}</p>
                    <button onclick="editAnime(${data.id})">Edit</button>
                    <button onclick="deleteAnime(${data.id})">Delete</button>
                </div>
            `;
            adminAnimeList.innerHTML += newAnime;
            addAnimeForm.reset();
        })
        .catch(error => {
            console.error('Error:', error);
            alert(`Error: ${error.message}`);
        });
    });
    
    

    function loadAnimeList() {
        fetch('http://localhost:8080/anime/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}` // Sertakan token jika diperlukan
            }
        })
        .then(response => {
            console.log('Response status:', response.status); // Log status respons
            if (!response.ok) {
                throw new Error('Failed to fetch anime');
            }
            return response.json();
        })
        .then(data => {
            adminAnimeList.innerHTML = ''; // Kosongkan daftar sebelum menambahkan
            data.forEach(anime => {
                const animeItem = `<div class="anime-item" id="anime-${anime.id}">${anime.title} <button onclick="editAnime(${anime.id})">Edit</button> <button onclick="deleteAnime(${anime.id})">Delete</button></div>`;
                adminAnimeList.innerHTML += animeItem;
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    // Panggil fungsi untuk memuat daftar anime saat halaman dimuat
    loadAnimeList();

    // Fungsi untuk mengedit anime
    window.editAnime = function(id) {
        const title = prompt("Enter new title:");
        const description = prompt("Enter new description:");
        const genre = prompt("Enter new genre:");
        const releaseDate = prompt("Enter new release date:");

        fetch(`http://localhost:8080/anime/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}` // Sertakan token jika diperlukan
            },
            body: JSON.stringify({ title, description, genre, releaseDate }),
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
        fetch(`http://localhost:8080/anime/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}` // Sertakan token jika diperlukan
            },
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
