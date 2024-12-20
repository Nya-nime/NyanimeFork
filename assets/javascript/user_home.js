const userSearchButton = document.getElementById('search-button');
const userSearchBar = document.getElementById('search-bar');
const userAnimeList = document.getElementById('anime-list');

userSearchButton.addEventListener('click', () => {
  const query = userSearchBar.value;
  fetch(`/api/anime?search=${query}`)
    .then(response => response.json())
    .then(data => {
      userAnimeList.innerHTML = data.map(anime => `<div>${anime.title}</div>`).join('');
    });
});

const logoutButton = document.getElementById('logout');
logoutButton.addEventListener('click', () => {
  fetch('/api/logout', { method: 'POST' })
    .then(() => {
      window.location.href = 'index.html';
    });
});
