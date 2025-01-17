document.addEventListener('DOMContentLoaded', () => {
    const addAnimeButton = document.getElementById('add-anime-button');
    const modalOverlay = document.getElementById('modal-overlay');
    const adminAnimeList = document.getElementById('anime-list');
    const adminLogoutButton = document.getElementById('logout');

    let currentEditId = null;

    // Cek apakah pengguna sudah login
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        // Jika tidak ada token, arahkan ke halaman login
        window.location.href = 'llogin.html'; // Ganti dengan URL halaman login Anda
    }

    // Show modal for adding a new anime
    addAnimeButton.addEventListener('click', () => {
        modalOverlay.classList.remove('hidden');
        document.getElementById('modal-title').innerText = 'Add Anime'; // Set title for adding
        document.getElementById('submit-button').innerText = 'Save'; // Set button text to Save
        modalForm.reset(); // Reset the form for new entry
        currentEditId = null; // Clear the current edit ID
    });

    window.addEventListener('popstate', () => {
        // Clear the token and redirect to login
        localStorage.removeItem('jwtToken');
        window.location.href = 'llogin.html'; // Ganti dengan URL halaman login Anda
    });

        // Clear token on page unload
    window.addEventListener('beforeunload', () => {
        localStorage.removeItem('jwtToken');
    });
    

    // Hide modal
    const modalCancel = document.getElementById('cancel-button');
    modalCancel.addEventListener('click', () => {
        modalOverlay.classList.add('hidden');
        modalForm.reset(); // Reset the form when closing
    });

    // Handle form submission
    const modalForm = document.getElementById('anime-form');
    modalForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const genre = document.getElementById('genre').value;
        const releaseDate = document.getElementById('release_date').value;
        const createdBy = localStorage.getItem('userId');

        if (!createdBy) {
            alert('User ID is required!');
            return;
        }

        const payload = JSON.stringify({ title, description, genre, releaseDate });

        const url = currentEditId ? `http://localhost:8080/anime/${currentEditId}` : 'http://localhost:8080/anime/';
        const method = currentEditId ? 'PUT' : 'POST';

        fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Ensure the token is included
            },
            body: payload,
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    console.error('Response Error:', text); // Log the error response
                    throw new Error(text);
                });
            }
            return response.json();
        })
        .then(() => {
            modalOverlay.classList.add('hidden'); // Hide modal after submission
            modalForm.reset();
            alert("Anime successfully Added/updated!");
            loadAnimeList(); // Refresh the anime list
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
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch anime');
            }
            return response.json();
        })
        .then(data => {
            adminAnimeList.innerHTML = '';
            data.forEach(anime => {
                const animeCard = document.createElement('div');
                animeCard.classList.add('anime-card');
                animeCard.innerHTML = `
                    <h3>${anime.title}</h3>
                    <p>${anime.description}</p>
                    <p style="font-weight: bold;">Genre: ${anime.genre}</p>
                    <p style="font-weight: bold;">Release Date: ${anime.releaseDate}</p>
                    <button class="delete-button" data-id="${anime.id}">Delete</button>
                `;
                
                // Show modal with the form for editing
                animeCard.addEventListener('click', () => {
                    currentEditId = anime.id;
                    document.getElementById('modal-title').innerText = 'Edit Anime'; // Set title for editing
                    document.getElementById('title').value = anime.title;
                    document.getElementById('description').value = anime.description;
                    document.getElementById('genre').value = anime.genre;
                    document.getElementById('release_date').value = anime.releaseDate;
                    modalOverlay.classList.remove('hidden'); // Show modal
                });

                adminAnimeList.appendChild(animeCard);

                animeCard.querySelector('.delete-button').addEventListener('click', (event) => {
                    event.stopPropagation();
                    deleteAnime(anime.id);
                });
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    function deleteAnime(id) {
        fetch(`http://localhost:8080/anime/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete anime');
            }
            alert("Delete anime successfully!");
            loadAnimeList();
        })
        .catch(error => {
            console.error('Error:', error);
            alert(`Error deleting anime: ${error.message}`);
        });
    }

    adminLogoutButton.addEventListener('click', () => {
        if (!token) {
            alert('You are not logged in.');
            return;
        }

        fetch('http://localhost:8080/user/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(errorMessage => {
                    throw new Error('Logout failed: ' + errorMessage);
                });
            }
            localStorage.removeItem('jwtToken');
            window.location.href = 'index.html';
            alert("Logout successful!");
        })
        .catch(error => {
            console.error('Error during logout:', error);
            alert('Logout failed: ' + error.message);
        });
    });

    loadAnimeList();
});
