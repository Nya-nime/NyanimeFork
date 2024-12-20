const addAnimeForm = document.getElementById('add-anime-form');
const adminAnimeList = document.getElementById('anime-list');

addAnimeForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const title = document.getElementById('title').value;
  const description = document.getElementById('description').value;
  const genre = document.getElementById('genre').value;
  const releaseDate = document.getElementById('release-date').value;

  fetch('/api/anime', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title, description, genre, releaseDate }),
  })
    .then(response => response.json())
    .then(data => {
      const newAnime = `<div>${data.title}</div>`;
      adminAnimeList.innerHTML += newAnime;
    });
});

const adminLogoutButton = document.getElementById('logout');
adminLogoutButton.addEventListener('click', () => {
  fetch('/api/logout', { method: 'POST' })
    .then(() => {
      window.location.href = 'index.html';
    });
});