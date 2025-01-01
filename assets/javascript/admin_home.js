document.addEventListener('DOMContentLoaded', () => {
    const addAnimeButton = document.getElementById('add-anime-button');
    const heroSection = document.getElementById('hero-section');
    const addAnimeForm = document.getElementById('add-anime-form');
    const adminAnimeList = document.getElementById('anime-list');
    const cancelButton = document.getElementById('cancel-button');
    const adminLogoutButton = document.getElementById('logout');

    // Modal elements
    const modal = document.createElement('div');
    modal.id = 'modal';
    modal.style.display = 'none';
    modal.innerHTML = `
        <div class="modal-content">
            <form id="modal-form">
                <label for="modal-title">Title</label>
                <input type="text" id="modal-title" name="title" required>
                <label for="modal-description">Description</label>
                <textarea id="modal-description" name="description" required></textarea>
                <label for="modal-genre">Genre</label>
                <input type="text" id="modal-genre" name="genre" required>
                <label for="modal-release-date">Release Date</label>
                <input id="modal-release-date" name="release_date" required>
                <button type="submit">Submit</button>
                <button type="button" id="modal-cancel">Cancel</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);

    const modalForm = document.getElementById('modal-form');
    const modalCancel = document.getElementById('modal-cancel');

    let currentEditId = null;

    // Tampilkan modal untuk create anime
    addAnimeButton.addEventListener('click', () => {
        modal.style.display = 'block';
        currentEditId = null;
    });

    // Sembunyikan modal
    modalCancel.addEventListener('click', () => {
        modal.style.display = 'none';
        modalForm.reset();
    });

    // Menangani pengiriman form modal
    modalForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const title = document.getElementById('modal-title').value;
        const description = document.getElementById('modal-description').value;
        const genre = document.getElementById('modal-genre').value;
        const releaseDate = document.getElementById('modal-release-date').value;
        const createdBy = localStorage.getItem('userId');

        if (!createdBy) {
            alert('User ID is required!');
            return;
        }

        const payload = JSON.stringify({ title, description, genre, releaseDate, createdBy });

        const url = currentEditId ? `http://localhost:8080/anime/${currentEditId}` : 'http://localhost:8080/anime/';
        const method = currentEditId ? 'PUT' : 'POST';

        fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            },
            body: payload,
        })
        .then(response => {
            if (!response.ok) {
                return response.text().then(text => {
                    throw new Error(text);
                });
            }
            return response.json();
        })
        .then(data => {
            modal.style.display = 'none';
            modalForm.reset();
            loadAnimeList();
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
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
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
                    <p>Genre: ${anime.genre}</p>
                    <p>Release Date: ${anime.releaseDate}</p>
                    <button class="delete-button" data-id="${anime.id}">Delete</button>
                `;
                animeCard.addEventListener('click', () => {
                    currentEditId = anime.id;
                    document.getElementById('modal-title').value = anime.title;
                    document.getElementById('modal-description').value = anime.description;
                    document.getElementById('modal-genre').value = anime.genre;
                    document.getElementById('modal-release-date').value = anime.releaseDate;
                    modal.style.display = 'block';
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
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete anime');
            }
            loadAnimeList();
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    adminLogoutButton.addEventListener('click', () => {
        const token = localStorage.getItem('jwtToken');

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
            window.location.href = 'login.html';
        })
        .catch(error => {
            console.error('Error during logout:', error);
            alert('Logout failed: ' + error.message);
        });
    });

    loadAnimeList();
});
