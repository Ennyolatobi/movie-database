const favoritesContainer = document.getElementById("favoritesContainer");
const emptyMessage = document.getElementById("emptyMessage");

function loadFavorites() {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  if (favorites.length === 0) {
    emptyMessage.classList.remove("hidden");
    return;
  }

  favorites.forEach(async (id) => {
    const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}`);
    const movie = await response.json();
    const card = document.createElement("div");
    card.className = "movie-card";
    card.innerHTML = `
      <img src="${movie.Poster !== "N/A" ? movie.Poster : ''}" />
      <h3>${movie.Title}</h3>
      <p>${movie.Year}</p>
      <button onclick="removeFavorite('${movie.imdbID}')">❌ Remove</button>
      <a href="movie.html?id=${movie.imdbID}">Details</a>
    `;
    favoritesContainer.appendChild(card);
  });
}

function removeFavorite(id) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favorites = favorites.filter(favId => favId !== id);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  location.reload();
}

loadFavorites();
