const animeList = document.getElementById('anime-list');    
const modal = document.getElementById('anime-modal');    
const modalTitle = document.getElementById('modal-title');    
const modalDescription = document.getElementById('modal-description');    
const closeButton = document.querySelector('.close-button');    
const searchButton = document.getElementById('search-button'); // Get the search button  
  
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
function loadAnimeList(query = '') {    
    const url = new URL('http://localhost:8080/anime/');    
    if (query) {    
        url.searchParams.append('search', query);    
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
                <p style="font-weight: bold;">Release Date: ${anime.releaseDate}</p>    
                <p style="font-weight: bold;">Rating: <span class="rating-display">${anime.average_rating ? anime.average_rating.toFixed(1) : ''}</span></p>    
            `;    
            animeList.appendChild(animeCard); // Append the card to the list    
    
            // Generate a random color for the shadow    
            const randomColor = getRandomColor();    
    
            // Add hover effect for the card    
            animeCard.addEventListener('mouseenter', () => {    
                animeCard.style.boxShadow = `0 2px 10px ${randomColor}`; // Set random shadow color on hover    
            });    
    
            animeCard.addEventListener('mouseleave', () => {    
                animeCard.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)'; // Reset shadow on mouse leave    
            });    
    
            // Add event listener for card click    
            animeCard.addEventListener('click', () => {    
                modalTitle.textContent = anime.title;    
                modalDescription.textContent = anime.description;    
                modal.style.display = 'block'; // Show modal    
                modal.querySelector('.modal-content').classList.add('show'); // Add show class    
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
    modal.style.display = 'none'; // Hide modal    
    modal.querySelector('.modal-content').classList.remove('show'); // Remove show class    
});    
    
// Close modal when clicking outside of the modal content    
window.addEventListener('click', (event) => {    
    if (event.target === modal) {    
        modal.style.display = 'none'; // Hide modal    
        modal.querySelector('.modal-content').classList.remove('show'); // Remove show class    
    }    
});    
    
// Search functionality    
searchButton.addEventListener('click', () => {    
    const searchTerm = searchButton.value.toLowerCase();    
    loadAnimeList(searchTerm);    
});  
// Redirect to frontend when accessing the root    
window.onload = () => {    
    if (window.location.href === 'http://localhost:8080/') {    
        window.location.href = 'http://127.0.0.1:5500/index.html';    
    } else {    
        loadAnimeList(); // Load all anime on page load    
    }    
};    
