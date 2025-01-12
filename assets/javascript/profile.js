const logoutButton = document.getElementById('logout');      
const reviewsButton = document.getElementById('reviewsButton'); // Ambil tombol Reviews  
const favoriteButton = document.getElementById('favoriteButton'); // Ambil tombol Favorites  
const contentContainer = document.getElementById('contentContainer'); // Kontainer untuk reviews dan favorites  
  
// Fetch profile data      
console.log('Fetching profile data...');    
fetch('http://localhost:8080/user/profile', {      
  method: 'GET',      
  headers: {      
    'Authorization': `Bearer ${localStorage.getItem('jwtToken')}` // Ambil token dari localStorage      
  }      
})      
  .then((response) => {      
    console.log('Response status:', response.status); // Log status respons    
    if (!response.ok) {      
      throw new Error('Failed to fetch profile data');      
    }      
    return response.json();      
  })      
  .then((data) => {       
    document.querySelector('.username').textContent = data.username; // Menampilkan username      
  })      
  .catch((error) => {      
    console.error('Error fetching profile data:', error);      
    alert('Error fetching profile data. Please try again later.');      
  });      
  
// Logout functionality      
logoutButton.addEventListener('click', () => {      
  fetch('http://localhost:8080/api/logout', { method: 'POST' })      
    .then(() => {      
      localStorage.removeItem('jwtToken'); // Hapus token dari localStorage saat logout      
      window.location.href = 'index.html';      
    });      
});      
   
reviewsButton.addEventListener('click', () => {  
  fetch('http://localhost:8080/review/reviews', {  
      method: 'GET',  
      headers: {  
          'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`  
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
      alert('Error fetching reviews. Please try again later.');  
  });  
});  

  
// Fetch user favorites when the Favorites button is clicked  
favoriteButton.addEventListener('click', () => {  
  fetch('http://localhost:8080/user/favorite', {  
    method: 'GET',  
    headers: {  
      'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`  
    }  
  })  
  .then((response) => {  
    if (!response.ok) {  
      throw new Error('Failed to fetch favorites');  
    }  
    return response.json();  
  })  
  .then((favorites) => {  
    // Tampilkan favorites di UI  
    contentContainer.innerHTML = ''; // Kosongkan kontainer sebelumnya  
  
    favorites.forEach(favorite => {  
      const favoriteElement = document.createElement('div');  
      favoriteElement.textContent = `Anime: ${favorite.animeTitle}`;  
      contentContainer.appendChild(favoriteElement);  
    });  
  })  
  .catch((error) => {  
    console.error('Error fetching favorites:', error);  
    alert('Error fetching favorites. Please try again later.');  
  });  
});  

function createReviewCard(review) {  
  const animeCard = document.createElement('div');  
  animeCard.classList.add('anime-card');  
  animeCard.innerHTML = `  
      <h3>${review.anime_title}</h3> <!-- Pastikan ini sesuai dengan nama field -->  
      <p style="font-weight: bold;">Genre: ${review.genre}</p>  
      <p style="font-weight: bold;">Release Date: ${review.release_date}</p>  
      <p style="font-weight: bold;">Rating: <span class="rating-display">${review.rating ? review.rating.toFixed(1) : 'N/A'}</span></p>  
      <p class="anime-description">${review.content}</p>
      <button class="delete-button" data-review-id="${review.id}">Delete</button>  
      `;  
  
    // Tambahkan event listener untuk tombol delete  
    animeCard.querySelector('.delete-button').addEventListener('click', () => {  
        deleteReview(review.id);  
    });  

  return animeCard;  
}  

function editReview(reviewId) {  
  const newContent = prompt("Enter new content for the review:");  
  const newRating = prompt("Enter new rating for the review:");  

  if (newContent && newRating) {  
      fetch(`http://localhost:8080/review/${reviewId}`, { // Gunakan rute yang sesuai  
          method: 'PUT',  
          headers: {  
              'Content-Type': 'application/json',  
              'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`  
          },  
          body: JSON.stringify({  
              content: newContent,  
              rating: parseFloat(newRating)  
          })  
      })  
      .then(response => {  
          if (!response.ok) {  
              throw new Error('Failed to update review');  
          }  
          return response.json();  
      })  
      .then(updatedReview => {  
          console.log('Review updated:', updatedReview);  
          reviewsButton.click(); // Refresh daftar review  
      })  
      .catch(error => {  
          console.error('Error updating review:', error);  
          alert('Error updating review. Please try again later.');  
      });  
  }  
}  


function deleteReview(reviewId) {  
  if (confirm("Are you sure you want to delete this review?")) {  
      fetch(`http://localhost:8080/review/${reviewId}`, { // Gunakan rute yang sesuai  
          method: 'DELETE',  
          headers: {  
              'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`  
          }  
      })  
      .then(response => {  
          if (!response.ok) {  
              throw new Error('Failed to delete review');  
          }  
          console.log('Review deleted');  
          reviewsButton.click(); // Refresh daftar review  
      })  
      .catch(error => {  
          console.error('Error deleting review:', error);  
          alert('Error deleting review. Please try again later.');  
      });  
  }  
}  


