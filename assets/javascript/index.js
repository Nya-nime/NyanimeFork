const searchButton = document.getElementById('search-button');
const searchBar = document.getElementById('search-bar');
const animeList = document.getElementById('anime-list');

// Function to load anime list
function loadAnimeList(query = '') {
    const url = query ? `http://localhost:8080/anime?search=${encodeURIComponent(query)}` : 'http://localhost:8080/anime/';
    
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
                <p>${anime.description}</p>
                <p style="font-weight: bold;">Genre: ${anime.genre}</p>
                <p style="font-weight: bold;">Release Date: ${anime.releaseDate}</p>
            `;
            animeList.appendChild(animeCard); // Append the card to the list
        });
    })
    .catch(error => {
        console.error('Error:', error);
        animeList.innerHTML = '<div>Error loading anime list</div>';
    });
}

// Search functionality
searchButton.addEventListener('click', () => {
    const query = searchBar.value.trim(); // Get the search query
    if (query) {
        loadAnimeList(query); // Load anime list based on search query
    } else {
        loadAnimeList(); // If the search bar is empty, load all anime
    }
});

// Redirect to frontend when accessing the root
window.onload = () => {
    if (window.location.href === 'http://localhost:8080/') {
        window.location.href = 'http://127.0.0.1:5500/index.html';
    } else {
        loadAnimeList(); // Load all anime on page load
    }
};
