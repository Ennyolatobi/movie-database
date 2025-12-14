const movieDetails = document.getElementById("movieDetails");
const loading = document.getElementById("loading");
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get("id");

async function fetchMovieDetails(id) {
  loading.classList.remove("hidden");
  try {
    const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=full`);
    const movie = await response.json();
    loading.classList.add("hidden");

    movieDetails.innerHTML = `
      <button class="back-btn" onclick="window.history.back()">← Back</button>
      <h2>${movie.Title}</h2>
      <img src="${movie.Poster}" />
      <p><strong>Genre:</strong> ${movie.Genre}</p>
      <p><strong>Actors:</strong> ${movie.Actors}</p>
      <p><strong>Ratings:</strong> ${movie.imdbRating}</p>
      <p><strong>Plot:</strong> ${movie.Plot}</p>
      <button onclick="addFavorite('${movie.imdbID}')">⭐ Add to Favorites</button>
    `;
    movieDetails.classList.remove("hidden");
  } catch (err) {
    loading.classList.add("hidden");
    movieDetails.innerHTML = "<p>Failed to load movie details.</p>";
  }
}

fetchMovieDetails(movieId);

function addFavorite(id) {
  let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  if (!favorites.includes(id)) {
    favorites.push(id);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    alert("Added to favorites!");
  } else {
    alert("Movie is already in favorites.");
  }
}
