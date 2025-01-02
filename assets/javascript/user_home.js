document.addEventListener('DOMContentLoaded', () => {
    const adminAnimeList = document.getElementById('anime-list');
    const searchBar = document.getElementById('search-bar');
    const searchButton = document.getElementById('search-button');
    const adminLogoutButton = document.getElementById('logout');

    // Cek apakah pengguna sudah login
    const token = localStorage.getItem('jwtToken');
    if (!token) {
        // Jika tidak ada token, arahkan ke halaman login
        window.location.href = 'llogin.html'; // Ganti dengan URL halaman login Anda
    }

    // Load the anime list on page load
    loadAnimeList();

    // Search functionality
    searchButton.addEventListener('click', () => {
        const searchTerm = searchBar.value.toLowerCase();
        loadAnimeList(searchTerm);
    });

    function loadAnimeList(searchTerm = '') {
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
            adminAnimeList.innerHTML = ''; // Clear previous content
            const filteredData = data.filter(anime => anime.title.toLowerCase().includes(searchTerm));
            filteredData.forEach(anime => createAnimeCard(anime));
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }

    function createAnimeCard(anime) {
        const animeCard = document.createElement('div');
        animeCard.classList.add('anime-card');
        animeCard.innerHTML = `
            <h3>${anime.title}</h3>
            <p class="anime-description">${anime.description}</p> <!-- Tambahkan kelas untuk deskripsi -->
            <p style="font-weight: bold;">Genre: ${anime.genre}</p>
            <p style="font-weight: bold;">Release Date: ${anime.releaseDate}</p>
            <p style="font-weight: bold;">Rating: <span class="rating-display">${anime.rating ? anime.rating.toFixed(1) : 'N/A'}</span></p>
            <div class="star-rating" data-id="${anime.id}">
                <span class="star" data-value="1">&#9733;</span>
                <span class="star" data-value="2">&#9733;</span>
                <span class="star" data-value="3">&#9733;</span>
                <span class="star" data-value="4">&#9733;</span>
                <span class="star" data-value="5">&#9733;</span>
            </div>
            <div class="button-container">
                <button class="favorite-button" data-id="${anime.id}">Favorite</button>
                <button class="review-button" data-id="${anime.id}">Add Review</button>
            </div>
            <div class="review-section" id="review-section-${anime.id}" style="display: none;">
                <textarea id="review-input-${anime.id}" placeholder="Write your review here..."></textarea>
                <button class="submit-review" data-id="${anime.id}">Submit Review</button>
                <button class="cancel-review" data-id="${anime.id}">Cancel</button> <!-- Tambahkan tombol Cancel Review -->
            </div>
        `;
    
        // Handle star rating click
        const starRating = animeCard.querySelector('.star-rating');
        starRating.addEventListener('click', (event) => {
            const target = event.target;
            if (target.classList.contains('star')) {
                const ratingValue = parseFloat(target.getAttribute('data-value'));
                submitRating(anime.id, ratingValue);
                updateStarDisplay(starRating, ratingValue); // Update star display
            }
        });
    
        // Handle favorite button click
        const favoriteButton = animeCard.querySelector('.favorite-button');
        favoriteButton.addEventListener('click', (event) => {
            event.stopPropagation();
            markAsFavorite(anime.id);
        });
    
        // Handle review button click
        const reviewButton = animeCard.querySelector('.review-button');
        reviewButton.addEventListener('click', (event) => {
            event.stopPropagation();
            const reviewSection = document.getElementById(`review-section-${anime.id}`);
            const description = animeCard.querySelector('.anime-description'); // Ambil elemen deskripsi
            if (reviewSection.style.display === 'none') {
                description.style.display = 'none'; // Sembunyikan deskripsi
                reviewSection.style.display = 'block'; // Tampilkan bagian review
            } else {
                description.style.display = 'block'; // Tampilkan deskripsi
                reviewSection.style.display = 'none'; // Sembunyikan bagian review
            }
        });
    
        // Handle review submission
        const submitReviewButton = animeCard.querySelector('.submit-review');
        submitReviewButton.addEventListener('click', (event) => {
            event.stopPropagation();
            const reviewInput = document.getElementById(`review-input-${anime.id}`);
            const reviewText = reviewInput.value;
            if (reviewText) {
                submitReview(anime.id, reviewText).then(() => {
                    const description = animeCard.querySelector('.anime-description'); // Ambil elemen deskripsi
                    description.style.display = 'block'; // Tampilkan deskripsi kembali
                    reviewSection.style.display = 'none'; // Sembunyikan bagian review
                    reviewInput.value = ''; // Clear input after submission
                });
            } else {
                alert('Please enter a review before submitting.');
            }
        });
    
        // Handle cancel review button click
        const cancelReviewButton = animeCard.querySelector('.cancel-review');
        cancelReviewButton.addEventListener('click', (event) => {
            event.stopPropagation();
            const reviewSection = document.getElementById(`review-section-${anime.id}`);
            const description = animeCard.querySelector('.anime-description'); // Ambil elemen deskripsi
            description.style.display = 'block'; // Tampilkan deskripsi kembali
            reviewSection.style.display = 'none'; // Sembunyikan bagian review
        });
    
        adminAnimeList.appendChild(animeCard); // Add the card to the list
    }
    

    function updateStarDisplay(starRating, ratingValue) {
        const stars = starRating.querySelectorAll('.star');
        stars.forEach(star => {
            const value = parseFloat(star.getAttribute('data-value'));
            if (value <= ratingValue) {
                star.style.color = 'gold'; // Highlight selected stars
            } else {
                star.style.color = 'gray'; // Default color for unselected stars
            }
        });
    }

    function markAsFavorite(animeId) {
        fetch(`http://localhost:8080/anime/favorite/${animeId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: localStorage.getItem('userId') }) // Assuming you need to send userId
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to mark as favorite');
            }
            alert('Anime marked as favorite!');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error marking as favorite. Please try again.');
        });
    }

    function submitRating(animeId, rating) {
        fetch(`http://localhost:8080/anime/rate/${animeId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: localStorage.getItem('userId'), rating: rating })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to submit rating');
            }
            alert('Rating submitted successfully!');
            // Optionally, refresh the rating display
            const ratingDisplay = document.querySelector(`.rating-display`);
            ratingDisplay.textContent = rating.toFixed(1); // Update the displayed rating
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error submitting rating. Please try again.');
        });
    }

    function submitReview(animeId, reviewText) {
        return fetch(`http://localhost:8080/anime/review/${animeId}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: localStorage.getItem('userId'), review: reviewText })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to submit review');
            }
            alert('Review submitted successfully!');
            // Optionally, refresh the user's profile or the anime list
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error submitting review. Please try again.');
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
            window.location.href = 'login.html';
        })
        .catch(error => {
            console.error('Error during logout:', error);
            alert('Logout failed: ' + error.message);
        });
    });
});
