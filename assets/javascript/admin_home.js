const addAnimeButton = document.getElementById('add-anime-button');
        const heroSection = document.getElementById('hero-section');
        const addAnimeForm = document.getElementById('add-anime-form');
        const adminAnimeList = document.getElementById('anime-list');
        const cancelButton = document.getElementById('cancel-button');

        addAnimeButton.addEventListener('click', () => {
            heroSection.style.display = 'block'; // Tampilkan hero section
        });

        cancelButton.addEventListener('click', () => {
            heroSection.style.display = 'none'; // Sembunyikan hero section
            addAnimeForm.reset(); // Reset form
        });

        addAnimeForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const title = document.getElementById('title').value;
            const description = document.getElementById('description').value;
            const genre = document.getElementById('genre').value;
            const releaseDate = document.getElementById('release-date').value;

            fetch('http://localhost:8080/api/anime', { // Ganti dengan URL lengkap
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

        function editAnime(id) {
            const title = prompt("Enter new title:");
            const description = prompt("Enter new description:");
            const genre = prompt("Enter new genre:");
            const releaseDate = prompt("Enter new release date:");

            fetch(`http://localhost:8080/api/anime/${id}`, { // Ganti dengan URL lengkap
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
        }

        function deleteAnime(id) {
            fetch(`http://localhost:8080/api/anime/${id}`, { // Ganti dengan URL lengkap
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
        }

        const adminLogoutButton = document.getElementById('logout');
        adminLogoutButton.addEventListener('click', () => {
            fetch('http://localhost:8080/api/logout', { method: 'POST' }) // Ganti dengan URL lengkap
                .then(() => {
                    window.location.href = 'index.html';
                })
                .catch(error => {
                    console.error('Logout failed:', error);
                });
        });