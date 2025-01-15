document.addEventListener('DOMContentLoaded', () => {    
    const logoutButton = document.getElementById('logout');    
    const reviewsButton = document.getElementById('reviewsButton');    
    const favoriteButton = document.getElementById('favoriteButton');       
    const modalOverlay = document.getElementById('modal-overlay');    
    const modalForm = document.getElementById('review-form');    
    const modalCancel = document.getElementById('cancel-button');    
    const modalSubmit = document.getElementById('submit-button'); // Tombol untuk submit edit    
    const editProfileButton = document.getElementById('editProfileButton'); // Tombol edit profile    
    let currentEditId = null;    
    
    // Cek apakah pengguna sudah login    
    const token = localStorage.getItem('jwtToken');    
    if (!token) {    
        window.location.href = 'login.html'; // Ganti dengan URL halaman login Anda    
    }    
    
    // Fetch profile data    
    console.log('Fetching profile data...');    
    fetch('http://localhost:8080/user/profile', {    
        method: 'GET',    
        headers: {    
            'Authorization': `Bearer ${token}`    
        }    
    })    
    .then((response) => {    
        console.log('Response status:', response.status);    
        if (!response.ok) {    
            throw new Error('Failed to fetch profile data');    
        }    
        return response.json();    
    })    
    .then((data) => {    
        document.querySelector('.username').textContent = data.username;  
        document.querySelector('.bio').textContent = data.bio;  
    })    
    .catch((error) => {    
        console.error('Error fetching profile data:', error);    
    });    
    
    // Logout functionality    
    logoutButton.addEventListener('click', () => {    
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
    
    // Fetch reviews    
    reviewsButton.addEventListener('click', () => {    
        fetch('http://localhost:8080/review/reviews', {    
            method: 'GET',    
            headers: {    
                'Authorization': `Bearer ${token}`    
            }    
        })    
        .then((response) => {    
            if (!response.ok) {    
                throw new Error('Failed to fetch reviews');    
            }    
            return response.json();    
        })    
        .then((reviews) => {    
            const animeList = document.getElementById('anime-list');    
            animeList.innerHTML = ''; // Kosongkan kontainer sebelumnya    
    
            reviews.forEach(review => {    
                const reviewCard = createReviewCard(review);    
                animeList.appendChild(reviewCard);    
            });    
        })    
        .catch((error) => {    
            console.error('Error fetching reviews:', error);    
        });    
    });    
    
    // Fetch favorites    
    favoriteButton.addEventListener('click', () => {    
        getFavorites();    
    });    
    
    function getFavorites() {    
        fetch('http://localhost:8080/favorites/', { // Ganti dengan endpoint yang sesuai    
            method: 'GET',    
            headers: {    
                'Authorization': `Bearer ${token}`    
            }    
        })    
        .then((response) => {    
            if (!response.ok) {    
                throw new Error('Failed to fetch favorites');    
            }    
            return response.json();    
        })    
        .then((favorites) => {    
            console.log(favorites);  
            const animeList = document.getElementById('anime-list');    
            animeList.innerHTML = ''; // Kosongkan kontainer sebelumnya    
    
            favorites.forEach(favorite => {    
                const favoriteCard = createFavoriteCard(favorite);    
                animeList.appendChild(favoriteCard);    
            });    
        })    
        .catch((error) => {    
            console.error('Error fetching favorites:', error);    
        });    
    }    
    
    // Create review card    
    function createReviewCard(review) {    
        const animeCard = document.createElement('div');    
        animeCard.classList.add('anime-card');    
        animeCard.innerHTML = `    
            <h3>${review.anime_title}</h3>    
            <p style="font-weight: bold;">Genre: ${review.genre}</p>    
            <p style="font-weight: bold;">Release Date: ${review.release_date}</p>    
            <p style="font-weight: bold;">Rating: <span class="rating-display">${review.rating ? review.rating.toFixed(1) : 'N/A'}</span></p>    
            <p class="anime-description">${review.content}</p>    
            <button class="delete-button" data-review-id="${review.id}">Delete</button>    
        `;    
    
        // Tambahkan event listener untuk menampilkan modal saat kartu diklik    
        animeCard.addEventListener('click', () => {    
            currentEditId = review.id; // Simpan ID review yang sedang diedit    
            document.getElementById('modal-title').innerText = 'Edit Review'; // Set title untuk editing    
            document.getElementById('content').value = review.content; // Isi form dengan data review    
            document.getElementById('rating').value = review.rating; // Isi rating    
            updateStarDisplay(document.getElementById('star-rating'), review.rating); // Update tampilan bintang    
            modalOverlay.classList.remove('hidden'); // Tampilkan modal    
        });    
    
        // Tambahkan event listener untuk tombol delete    
        animeCard.querySelector('.delete-button').addEventListener('click', (event) => {    
            event.stopPropagation(); // Mencegah event click pada card    
            const reviewId = review.id;    
            console.log('Review ID to delete:', reviewId);    
            deleteReview(reviewId);    
        });    
    
        return animeCard;    
    }    
  
    function createFavoriteCard(favorite) {    
        const animeCard = document.createElement('div');    
        animeCard.classList.add('anime-card');    
        animeCard.innerHTML = `    
            <h3>${favorite.anime_title || 'Unknown Title'}</h3>    
            <p style="font-weight: bold;">Genre: ${favorite.genre || 'N/A'}</p>    
            <p style="font-weight: bold;">Release Date: ${favorite.release_date || 'N/A'}</p>    
            <p style="font-weight: bold;">Rating: <span class="rating-display">${favorite.rating ? favorite.rating.toFixed(1) : 'N/A'}</span></p>    
            <p class="anime-description">${favorite.description || 'No description available.'}</p>    
            <button class="delete-favorite-button" data-favorite-id="${favorite.id}">Delete Favorite</button> <!-- Tombol hapus favorit -->    
        `;    
    
        // Tambahkan event listener untuk tombol delete favorit    
        animeCard.querySelector('.delete-favorite-button').addEventListener('click', (event) => {    
            event.stopPropagation(); // Mencegah event click pada card    
            const favoriteId = favorite.id;    
            console.log('Favorite ID to delete:', favoriteId);    
            deleteFavorite(favoriteId);    
        });    
    
        return animeCard;    
    }    
  
    // Fungsi untuk menghapus favorit    
    function deleteFavorite(favoriteId) {    
        fetch(`http://localhost:8080/favorites/${favoriteId}`, {    
            method: 'DELETE',    
            headers: {    
                'Authorization': `Bearer ${token}`    
            }    
        })    
        .then(response => {    
            if (!response.ok) {    
                throw new Error('Failed to delete favorite');    
            }    
            alert('Favorite deleted successfully!');    
            // Refresh the favorites list after deletion    
            favoriteButton.click();    
        })    
        .catch(error => {    
            console.error('Error deleting favorite:', error);    
            alert('Error deleting favorite. Please try again.');    
        });    
    }    
    
    // Hide modal    
    modalCancel.addEventListener('click', () => {    
        modalOverlay.classList.add('hidden'); // Sembunyikan modal    
        modalForm.reset(); // Reset form saat menutup    
    });    
    
    // Update star display function    
    function updateStarDisplay(starRating, ratingValue) {    
        const stars = starRating.querySelectorAll('.star');    
        stars.forEach(star => {    
            const value = parseFloat(star.getAttribute('data-value'));    
            if (value <= ratingValue) {    
                star.style.color = 'gold';    
            } else {    
                star.style.color = 'gray';    
            }    
        });    
    }    
    
    // Star rating for modal    
    const starRating = document.getElementById('star-rating');    
    starRating.addEventListener('click', (event) => {    
        const target = event.target;    
        if (target.classList.contains('star')) {    
            const ratingValue = parseFloat(target.getAttribute('data-value'));    
            document.getElementById('rating').value = ratingValue; // Update hidden input with rating value    
            updateStarDisplay(starRating, ratingValue); // Update star display    
        }    
    });    
    
    // Fungsi untuk menghapus review    
    function deleteReview(reviewId) {    
        fetch(`http://localhost:8080/review/${reviewId}`, {    
            method: 'DELETE',    
            headers: {    
                'Authorization': `Bearer ${token}`    
            }    
        })    
        .then(response => {    
            if (!response.ok) {    
                throw new Error('Failed to delete review');    
            }    
            alert('Review deleted successfully!');    
            // Refresh the reviews list after deletion    
            reviewsButton.click();    
        })    
        .catch(error => {    
            console.error('Error deleting review:', error);    
            alert('Error deleting review. Please try again.');    
        });    
    }    
    
    // Fungsi untuk mengedit review    
    modalSubmit.addEventListener('click', (event) => {    
        event.preventDefault(); // Mencegah form dari submit default    
        const content = document.getElementById('content').value;    
        const rating = parseFloat(document.getElementById('rating').value); // Pastikan rating adalah angka    
    
        if (currentEditId) {    
            editReview(currentEditId, { content, rating });    
        } else {    
            console.error('No review ID set for editing.'); // Log jika ID tidak ada    
        }    
    });    
    
    function editReview(reviewId, updatedData) {    
        console.log('Updating review with ID:', reviewId);    
        console.log('Data to be sent:', updatedData); // Debugging: lihat data yang akan dikirim    
    
        fetch(`http://localhost:8080/review/${reviewId}`, {    
            method: 'PUT',    
            headers: {    
                'Authorization': `Bearer ${token}`,    
                'Content-Type': 'application/json'    
            },    
            body: JSON.stringify(updatedData)    
        })    
        .then(response => {    
            if (!response.ok) {    
                return response.json().then(err => {    
                    console.error('Error response from server:', err); // Log error dari server    
                    throw new Error(`Failed to update review: ${err.error}`);    
                });    
            }    
            alert('Review updated successfully!');    
            modalOverlay.classList.add('hidden');    
            reviewsButton.click();    
        })    
        .catch(error => {    
            console.error('Error updating review:', error);    
            alert('Error updating review. Please try again.');    
        });    
    }    
    

    editProfileButton.addEventListener('click', () => {    
        window.location.href = 'edit_profile.html';
    });    
});    
