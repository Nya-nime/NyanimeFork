document.addEventListener('DOMContentLoaded', () => {    
    const adminAnimeList = document.getElementById('anime-list');    
    const searchBar = document.getElementById('search-bar');    
    const searchButton = document.getElementById('search-button');      
    const profileButton = document.getElementById('profile');    
    
    // Cek apakah pengguna sudah login    
    const token = localStorage.getItem('jwtToken'); 
    if (!token) {    
        window.location.href = 'llogin.html'; // Ganti dengan URL halaman login Anda    
    }else{
        loadAnimeList(); 
    }  
   
    // Search functionality    
    searchButton.addEventListener('click', () => {    
        const searchTerm = searchBar.value.toLowerCase();    
        loadAnimeList(searchTerm);    
    });    
    
    // Event listener untuk tombol profile    
    profileButton.addEventListener('click', () => {    
        window.location.href = 'profile.html'; // Ganti dengan URL halaman profil Anda    
    });    
    
    function loadAnimeList(searchTerm = '') {    
        fetch('http://localhost:8080/anime/', {    
            method: 'GET',    
            headers: {    
                'Authorization': `Bearer ${token}`    
            }    
        })    
        .then(response => {  
            if (response.status === 401) {  
                alert('Session expired. Please log in again.');  
                window.location.href = 'llogin.html';  
                return;  
            }  
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
            <p class="anime-description">${anime.description}</p>    
            <p style="font-weight: bold;">Genre: ${anime.genre}</p>    
            <p style="font-weight: bold;">Release Date: ${anime.releaseDate}</p>    
            <p style="font-weight: bold;">Rating: <span class="rating-display">${anime.average_rating ? anime.average_rating.toFixed(1) : 'N/A'}</span></p>    
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
                <button class="cancel-review" data-id="${anime.id}">Cancel</button>    
            </div>    
        `;    
    
        // Handle star rating click    
        const starRating = animeCard.querySelector('.star-rating');    
        let selectedRating = 0; // Variabel untuk menyimpan rating yang dipilih    
    
        starRating.addEventListener('click', (event) => {    
            const target = event.target;    
            if (target.classList.contains('star')) {    
                selectedRating = parseFloat(target.getAttribute('data-value'));    
                updateStarDisplay(starRating, selectedRating);    
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
            const description = animeCard.querySelector('.anime-description');    
            if (reviewSection.style.display === 'none') {    
                description.style.display = 'none';    
                reviewSection.style.display = 'block';    
            } else {    
                description.style.display = 'block';    
                reviewSection.style.display = 'none';    
            }    
        });    
    
        // Handle review submission    
        const submitReviewButton = animeCard.querySelector('.submit-review');    
        submitReviewButton.addEventListener('click', (event) => {    
            event.stopPropagation();    
            const reviewInput = document.getElementById(`review-input-${anime.id}`);    
            const reviewText = reviewInput.value;    
            if (reviewText) {    
                submitReview(anime.id, reviewText, selectedRating).then(() => {    
                    resetCard(animeCard, starRating, reviewInput);    
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
            const description = animeCard.querySelector('.anime-description');    
            description.style.display = 'block';    
            reviewSection.style.display = 'none';    
        });    
    
        adminAnimeList.appendChild(animeCard);    
    }    
    
    function resetCard(animeCard, starRating, reviewInput) {    
        const description = animeCard.querySelector('.anime-description');    
        const reviewSection = animeCard.querySelector('.review-section');    
    
        // Reset tampilan    
        description.style.display = 'block';    
        reviewSection.style.display = 'none';    
        reviewInput.value = ''; // Kosongkan input review    
        updateStarDisplay(starRating, 0); // Reset tampilan bintang    
    }    
    
    function updateStarDisplay(starRating, ratingValue) {    
        const stars = starRating.querySelectorAll('.star');    
        stars.forEach(star => {    
            const value = parseFloat(star.getAttribute('data-value'));    
            star.style.color = value <= ratingValue ? 'gold' : 'gray';    
        });    
    }    
    
    function markAsFavorite(animeId) {          
        fetch(`http://localhost:8080/favorites/${animeId}`, {          
            method: 'POST',          
            headers: {          
                'Authorization': `Bearer ${token}`,          
                'Content-Type': 'application/json'          
            },          
            body: JSON.stringify({}) // Body bisa dikosongkan jika tidak ada data tambahan yang diperlukan          
        })          
        .then(response => {          
            console.log('Response status:', response.status); // Log status respons        
            return response.json().then(data => ({ status: response.status, body: data })); // Ambil data JSON        
        })          
        .then(({ status, body }) => {          
            if (status !== 200 && status !== 201) {          
                throw new Error(`Failed to mark as favorite: ${body.message || 'Unknown error'}`);          
            }          
            alert('Anime marked as favorite!');          
            console.log('Favorite data:', body);          
        })          
        .catch(error => {          
            console.error('Error:', error);          
            alert('Error marking as favorite. Please try again.');          
        });          
    }  
    
    
    function submitReview(animeId, reviewText, rating) {    
        return fetch(`http://localhost:8080/review/anime/${animeId}`, {    
            method: 'POST',    
            headers: {    
                'Authorization': `Bearer ${token}`,    
                'Content-Type': 'application/json'    
            },    
            body: JSON.stringify({    
                content: reviewText,    
                userId: localStorage.getItem('userId'),    
                rating: rating // Kirim rating bersama review    
            })    
        })    
        .then(response => {    
            if (!response.ok) {    
                throw new Error('Failed to submit review');    
            }    
            alert('Review submitted successfully!');    
        })    
        .catch(error => {    
            console.error('Error:', error);    
            alert('Error submitting review. Please try again.');    
        });    
    }    
});    
