const API_KEY = "9a5c3803";
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const moviesContainer = document.getElementById("moviesContainer");
const errorMessage = document.getElementById("errorMessage");
const loading = document.getElementById("loading");
const sortSelect = document.getElementById("sortSelect");

searchBtn.addEventListener("click", searchMovies);

async function searchMovies() {
  const query = searchInput.value.trim();
  moviesContainer.innerHTML = "";
  errorMessage.classList.add("hidden");

  if (!query) {
    showError("Please enter a movie name.");
    return;
  }

  loading.classList.remove("hidden");

  try {
    const response = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`);
    const data = await response.json();
    loading.classList.add("hidden");

    if (data.Response === "False") {
      showError(data.Error);
      return;
    }

    displayMovies(data.Search);
  } catch (err) {
    loading.classList.add("hidden");
    showError("Something went wrong. Please try again.");
  }
}

function displayMovies(movies) {
  // Sort by selection if chosen
  const sortValue = sortSelect.value;
  if (sortValue === "year") {
    movies.sort((a, b) => a.Year - b.Year);
  }

  movies.forEach(movie => {
    const card = document.createElement("div");
    card.className = "movie-card";
    card.innerHTML = `
      <img src="${movie.Poster !== "N/A" ? movie.Poster : ''}" />
      <h3>${movie.Title}</h3>
      <p>${movie.Year}</p>
      <button onclick="addFavorite('${movie.imdbID}')">⭐ Add to Favorites</button>
      <a href="movie.html?id=${movie.imdbID}">Details</a>
    `;
    moviesContainer.appendChild(card);
  });
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
}

// Favorites in localStorage
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
