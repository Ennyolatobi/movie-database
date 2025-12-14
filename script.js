const API_KEY = "9a5c3803";
const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const moviesContainer = document.getElementById("moviesContainer");
const movieDetails = document.getElementById("movieDetails");
const errorMessage = document.getElementById("errorMessage");

searchBtn.addEventListener("click", searchMovies);

async function searchMovies() {
  const query = searchInput.value.trim();
  moviesContainer.innerHTML = "";
  movieDetails.classList.add("hidden");
  errorMessage.classList.add("hidden");

  if (!query) {
    showError("Please enter a movie name.");
    return;
  }

  try {
    const response = await fetch(
      `https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`
    );
    const data = await response.json();

    if (data.Response === "False") {
      showError(data.Error);
      return;
    }

    displayMovies(data.Search);
  } catch (error) {
    showError("Something went wrong. Please try again.");
  }
}

function displayMovies(movies) {
  movies.forEach(movie => {
    const card = document.createElement("div");
    card.className = "movie-card";
    card.innerHTML = `
      <img src="${movie.Poster !== "N/A" ? movie.Poster : ""}" />
      <h3>${movie.Title}</h3>
      <p>${movie.Year}</p>
    `;
    card.addEventListener("click", () => fetchMovieDetails(movie.imdbID));
    moviesContainer.appendChild(card);
  });
}

async function fetchMovieDetails(id) {
  moviesContainer.innerHTML = "";

  const response = await fetch(
    `https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=full`
  );
  const movie = await response.json();

  movieDetails.innerHTML = `
    <button onclick="goBack()">← Back to Results</button>
    <h2>${movie.Title}</h2>
    <img src="${movie.Poster}" />
    <p><strong>Genre:</strong> ${movie.Genre}</p>
    <p><strong>Actors:</strong> ${movie.Actors}</p>
    <p><strong>Ratings:</strong> ${movie.imdbRating}</p>
    <p><strong>Plot:</strong> ${movie.Plot}</p>
  `;

  movieDetails.classList.remove("hidden");
}

function goBack() {
  movieDetails.classList.add("hidden");
}

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove("hidden");
}
