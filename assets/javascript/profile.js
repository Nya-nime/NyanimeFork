const userInfoSection = document.getElementById('user-info');
const userReviewsSection = document.getElementById('user-reviews');
const userFavoritesSection = document.getElementById('user-favorites');
const logoutButton = document.getElementById('logout');

// Fetch and display user information
fetch('/api/user/profile')
  .then(response => response.json())
  .then(data => {
    userInfoSection.innerHTML = `
      <p>Username: ${data.username}</p>
      <p>Email: ${data.email}</p>
      <p>Role: ${data.role}</p>
    `;

    userReviewsSection.innerHTML = data.reviews.map(review => `
      <div>
        <h3>${review.animeTitle}</h3>
        <p>Rating: ${review.rating}</p>
        <p>${review.content}</p>
      </div>
    `).join('');

    userFavoritesSection.innerHTML = data.favorites.map(favorite => `
      <div>${favorite.animeTitle}</div>
    `).join('');
  });

// Logout functionality
logoutButton.addEventListener('click', () => {
  fetch('/api/logout', { method: 'POST' })
    .then(() => {
      window.location.href = 'index.html';
    });
});