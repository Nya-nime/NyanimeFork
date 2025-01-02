const searchBar = document.getElementById('search-bar');
const animeList = document.getElementById('anime-list');
const genreDropdown = document.getElementById('genre-dropdown');
const searchYear = document.getElementById('search-year');
const modal = document.getElementById('anime-modal');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const closeButton = document.querySelector('.close-button');

// Function to generate a random color
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Function to load anime list
function loadAnimeList(query = '', genre = '', year = '') {
    const url = new URL('http://localhost:8080/anime/');
    if (query) {
        url.searchParams.append('search', query);
    }
    if (genre) {
        url.searchParams.append('genre', genre);
    }
    if (year) {
        url.searchParams.append('year', year);
    }

    fetch(url, {
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
        animeList.innerHTML = ''; // Clear the existing list
        if (data.length === 0) {
            animeList.innerHTML = '<div>No anime found.</div>'; // Message if no results
            return;
        }
        data.forEach(anime => {
            const animeCard = document.createElement('div');
            animeCard.classList.add('anime-card');
            animeCard.innerHTML = `
                <h3>${anime.title}</h3>
                <p>${anime.description.length > 100 ? anime.description.substring(0, 100) + '...' : anime.description}</p>
                <p style="font-weight: bold;">Genre: ${anime.genre}</p>
                <p style="font-weight: bold;">Release Date: ${anime.releaseDate}</p>
            `;
            animeList.appendChild(animeCard); // Append the card to the list

            // Generate a random color for the shadow
            const randomColor = getRandomColor();

            // Add hover effect for the card
            animeCard.addEventListener('mouseenter', () => {
                animeCard.style.boxShadow = `0 2px 10px ${randomColor}`; // Set random shadow color on hover
            });

            animeCard.addEventListener('mouseleave', () => {
                animeCard.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)'; // Kembalikan bayangan default saat tidak hover
            });;

            // Tambahkan event listener untuk card
            animeCard.addEventListener('click', () => {
                modalTitle.textContent = anime.title;
                modalDescription.textContent = anime.description;
                modal.style.display = 'block'; // Tampilkan modal
                modal.querySelector('.modal-content').classList.add('show'); // Tambahkan kelas show
            });
        });
    })
    .catch(error => {
        console.error('Error:', error);
        animeList.innerHTML = '<div>Error loading anime list</div>';
    });
}

// Close modal when the close button is clicked
closeButton.addEventListener('click', () => {
    modal.style.display = 'none'; // Sembunyikan modal
    modal.querySelector('.modal-content').classList.remove('show'); // Hapus kelas show
});

// Close modal when clicking outside of the modal content
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none'; // Sembunyikan modal
        modal.querySelector('.modal-content').classList.remove('show'); // Hapus kelas show
    }
});

// Search functionality
searchBar.addEventListener('input', () => {
    const query = searchBar.value.trim(); // Get the search query
    const genre = genreDropdown.value; // Get selected genre
    const year = searchYear.value; // Get selected year

    loadAnimeList(query, genre, year); // Load anime list based on search query, genre, and year
});

// Handle genre dropdown change
genreDropdown.addEventListener('change', () => {
    const query = searchBar.value.trim(); // Get the search query
    const genre = genreDropdown.value; // Get selected genre
    const year = searchYear.value; // Get selected year

    loadAnimeList(query, genre, year); // Load anime list based on search query, genre, and year
});

// Handle year dropdown change
searchYear.addEventListener('change', () => {
    const query = searchBar.value.trim(); // Get the search query
    const genre = genreDropdown.value; // Get selected genre

    loadAnimeList(query, genre, searchYear.value); // Load anime list based on search query, genre, and year
});

// Redirect to frontend when accessing the root
window.onload = () => {
    if (window.location.href === 'http://localhost:8080/') {
        window.location.href = 'http://127.0.0.1:5500/index.html';
    } else {
        loadAnimeList(); // Load all anime on page load
    }
};
