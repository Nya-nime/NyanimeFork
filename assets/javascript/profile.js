document.addEventListener('DOMContentLoaded', () => {  
  const logoutButton = document.getElementById('logout');  
  const reviewsButton = document.getElementById('reviewsButton');  
  const favoriteButton = document.getElementById('favoriteButton');  
  const contentContainer = document.getElementById('contentContainer');  
  const modalOverlay = document.getElementById('modal-overlay');  
  const modalForm = document.getElementById('review-form');  
  const modalCancel = document.getElementById('cancel-button');  
  let currentEditId = null;  

  // Cek apakah pengguna sudah login  
  const token = localStorage.getItem('jwtToken');  
  if (!token) {  
      window.location.href = 'llogin.html'; // Ganti dengan URL halaman login Anda  
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
  })  
  .catch((error) => {  
      console.error('Error fetching profile data:', error);  
  });  

  // Logout functionality  
  logoutButton.addEventListener('click', () => {  
      fetch('http://localhost:8080/api/logout', { method: 'POST' })  
      .then(() => {  
          localStorage.removeItem('jwtToken');  
          window.location.href = 'index.html';  
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
});  
