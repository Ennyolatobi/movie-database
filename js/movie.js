const API_KEY = "9a5c3803";
const params = new URLSearchParams(window.location.search);
const movieID = params.get("id");

const moviePoster = document.getElementById("moviePoster");
const movieTitle = document.getElementById("movieTitle");
const movieMeta = document.getElementById("movieMeta");
const moviePlot = document.getElementById("moviePlot");
const watchTrailerBtn = document.getElementById("watchTrailerBtn");
const similarMoviesDiv = document.getElementById("similarMovies");
const ratingStars = document.getElementById("ratingStars");
const ratingValue = document.getElementById("ratingValue");
const favoritesBtn = document.getElementById("favoritesBtn");

async function fetchMovieDetails(id) {
  const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&i=${id}&plot=full`);
  const data = await res.json();
  return data.Response === "True" ? data : null;
}

async function fetchSimilarMovies(title) {
  const keywords = title.split(" ").slice(0,2).join(" ");
  const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${keywords}`);
  const data = await res.json();
  return data.Search ? data.Search.filter(m => m.imdbID !== movieID).slice(0,6) : [];
}

function movieCard(movie) {
  return `
    <div class="min-w-[200px] cursor-pointer group">
      <div class="relative rounded-xl overflow-hidden shadow-lg">
        <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300'}" class="h-72 w-full object-cover"/>
        <div class="absolute top-3 left-3 bg-black/70 px-2 py-1 rounded text-sm">⭐ ${movie.Year}</div>
        <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-4">
          <h3 class="font-bold">${movie.Title}</h3>
        </div>
      </div>
    </div>
  `;
}

/* ================= FAVORITES ================= */
function loadFavorites() {
  const favs = JSON.parse(localStorage.getItem("favorites") || "[]");
  return favs;
}

function isFavorite(id) {
  return loadFavorites().some(m => m.imdbID === id);
}

function toggleFavorite(movie) {
  let favs = loadFavorites();
  if (isFavorite(movie.imdbID)) {
    favs = favs.filter(m => m.imdbID !== movie.imdbID);
    favoritesBtn.textContent = "Add to Favorites ❤️";
  } else {
    favs.push(movie);
    favoritesBtn.textContent = "In Favorites ✅";
  }
  localStorage.setItem("favorites", JSON.stringify(favs));
}

/* ================= RATINGS ================= */
function renderRating(saved = 0) {
  ratingStars.innerHTML = "";
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("span");
    star.className = "star";
    star.innerHTML = "★";
    if (i <= saved) star.classList.add("selected");

    star.addEventListener("mouseover", () => {
      for (let j = 0; j < 5; j++) {
        ratingStars.children[j].classList.toggle("hovered", j < i);
      }
    });
    star.addEventListener("mouseleave", () => {
      for (let j = 0; j < 5; j++) {
        ratingStars.children[j].classList.remove("hovered");
      }
    });
    star.addEventListener("click", () => {
      localStorage.setItem(`rating-${movieID}`, i);
      renderRating(i);
    });

    ratingStars.appendChild(star);
  }
  ratingValue.textContent = saved ? `${saved}/5` : "";
}


/* ================= responsive footer for mobile ================= */
document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".footer-section");

  sections.forEach(section => {
    const header = section.querySelector("h3, h4");
    const content = section.querySelector(".footer-content");
    const toggleIcon = header.querySelector("span");

    if (!content || !toggleIcon) return;

    header.addEventListener("click", () => {
      const isOpen = !content.classList.contains("hidden");
      content.classList.toggle("hidden");
      toggleIcon.textContent = isOpen ? "+" : "−";
    });
  });
});




/* ================= DISPLAY MOVIE ================= */
async function init() {
  if (!movieID) return window.location.href = "index.html";

  const movie = await fetchMovieDetails(movieID);
  if (!movie) return alert("Movie not found");

  // Poster
  moviePoster.src = movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300";
  moviePoster.classList.remove("hidden");
  document.getElementById("posterSkeleton").remove();

  // Title & Meta
  movieTitle.textContent = movie.Title;
  movieTitle.classList.remove("skeleton", "h-12", "w-3/4");

  movieMeta.innerHTML = `
    <span>${movie.Year}</span>
    <span>${movie.Rated}</span>
    <span>${movie.Runtime}</span>
    <span>${movie.Genre}</span>
  `;
  movieMeta.classList.remove("skeleton","h-6","w-1/2");

  // Plot
  moviePlot.textContent = movie.Plot;
  moviePlot.classList.remove("skeleton","h-40");

  // Trailer
  watchTrailerBtn.onclick = () => openTrailer(movie.Title);

  // Favorites
  if (isFavorite(movieID)) favoritesBtn.textContent = "In Favorites ✅";
  favoritesBtn.onclick = () => toggleFavorite(movie);

  // Rating
  const savedRating = parseInt(localStorage.getItem(`rating-${movieID}`) || "0");
  renderRating(savedRating);

  // Similar Movies
  const similarMovies = await fetchSimilarMovies(movie.Title);
  if (similarMovies.length === 0) {
    similarMoviesDiv.innerHTML = `<p class="text-gray-500">No similar movies found 🎬</p>`;
  } else {
    similarMoviesDiv.innerHTML = similarMovies.map(m => `<div onclick="location.href='movie.html?id=${m.imdbID}'">${movieCard(m)}</div>`).join("");
  }
}

/* ================= TRAILER ================= */
function openTrailer(title) {
  document.getElementById("trailerModal").classList.remove("hidden");
  document.getElementById("trailerFrame").src =
    `https://www.youtube.com/embed?listType=search&list=${title} trailer`;
}

function closeTrailer() {
  document.getElementById("trailerModal").classList.add("hidden");
  document.getElementById("trailerFrame").src = "";
}

/* ================= THEME ================= */
const themeToggle = document.getElementById("themeToggle");
themeToggle.onclick = () => {
  document.documentElement.classList.toggle("dark");
  localStorage.setItem("theme", document.documentElement.classList.contains("dark") ? "dark" : "light");
};
if (localStorage.getItem("theme") === "dark") document.documentElement.classList.add("dark");

/* ================= INIT ================= */
init();
