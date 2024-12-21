const searchButton = document.getElementById('search-button');
const searchBar = document.getElementById('search-bar');
const animeList = document.getElementById('anime-list');

searchButton.addEventListener('click', () => {
  const query = searchBar.value;
  fetch(`http://192.168.1.5:8080/api/anime?search=${query}`)
    .then(response => response.json())
    .then(data => {
      animeList.innerHTML = data.map(anime => `<div>${anime.title}</div>`).join('');
    });
});