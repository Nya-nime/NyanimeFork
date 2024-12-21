const searchButton = document.getElementById('search-button');
const searchBar = document.getElementById('search-bar');
const animeList = document.getElementById('anime-list');

searchButton.addEventListener('click', () => {
  const query = searchBar.value;
  fetch(`http://localhost:8080/anime?search=${query}`) // Pastikan URL ini sesuai dengan backend Anda
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      animeList.innerHTML = data.map(anime => `<div>${anime.title}</div>`).join('');
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
      animeList.innerHTML = '<div>Error loading anime list</div>';
    });
});

// Redirect to frontend when accessing the root
window.onload = () => {
  if (window.location.href === 'http://localhost:8080/') {
    window.location.href = 'https://nya-nime.github.io/Nyanime/';
  }
};
