const API_KEY = "9a5c3803";

const moviesDiv = document.getElementById("movies");
const trendingDiv = document.getElementById("trendingMovies");
const status = document.getElementById("status");
const searchInput = document.getElementById("searchInput");

let page = 1;
let currentQuery = "";



/* ================= UI ================= */
function skeleton(count = 10) {
  return Array(count).fill(`
    <div class="h-72 bg-gray-300 dark:bg-gray-700 rounded-xl animate-pulse"></div>
  `).join("");
}

function movieCard(movie, showTrailer = true) {
  return `
    <div class="cursor-pointer group">
      <div class="relative rounded-xl overflow-hidden shadow-lg">
        <img src="${movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/300"}"
          class="h-72 w-full object-cover"/>
        
        <div class="absolute top-3 left-3 bg-black/70 px-2 py-1 rounded text-sm">
          ⭐ ${movie.Year}
        </div>

        <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-0 group-hover:opacity-100 transition flex flex-col justify-end p-4">
          <h3 class="font-bold">${movie.Title}</h3>
          ${showTrailer ? `<button onclick="openTrailer('${movie.Title}')" class="mt-2 bg-indigo-600 px-3 py-1 rounded">Trailer</button>` : ""}
        </div>
      </div>
    </div>
  `;
}




/* ================= MOOD PICKER ================= */
const moodMap = {
  happy: "comedy",
  sad: "drama",
  action: "action",
  romance: "romance",
  thriller: "thriller",
  animation: "animation",
  educational: "documentary"
};

document.querySelectorAll(".mood-card").forEach(card=>{
  card.onclick = ()=>{
    searchInput.value = moodMap[card.dataset.mood];
    page = 1;
    searchMovies(false);
    showToast(`Showing ${card.dataset.mood} movies 🎬`);
  };
});


/* ================= TRENDING ================= */
document.addEventListener("DOMContentLoaded", () => {
  const trendingDiv = document.getElementById("trendingMovies");
  const API_KEY = "9a5c3803";

  // Recent/popular movies list
  const trendingList = [
    "Oppenheimer", "Barbie", "Dune: Part Two",
    "Killers of the Flower Moon", "John Wick",
    "Mission: Impossible – Dead Reckoning",
    "The Marvels", "Poor Things",
    "The Hunger Games", "Joker: Folie à Deux",
    "Wonka", "Napoleon"
  ];

  // Scroll handler
  window.scrollTrending = (amount) => {
    trendingDiv.scrollLeft += amount;
  };

  // Skeleton loader
  function showSkeletons(count) {
    trendingDiv.innerHTML = "";
    for (let i = 0; i < count; i++) {
      const skeleton = document.createElement("div");
      skeleton.className =
        "w-32 md:w-36 lg:w-40 h-48 md:h-56 bg-gray-200 dark:bg-gray-700 animate-pulse rounded-lg";
      trendingDiv.appendChild(skeleton);
    }
  }

  // Movie card (small, Netflix style)
  function movieCard(movie) {
    // use fallback placeholder
    const poster =
      movie.Poster && movie.Poster !== "N/A"
        ? movie.Poster
        : "https://via.placeholder.com/300x450?text=No+Image";

    return `
      <div onclick="window.location.href='movie.html?id=${movie.imdbID}'"
           class="min-w-[8rem] md:min-w-[9rem] lg:min-w-[10rem]
                  cursor-pointer transform transition hover:scale-105">
        <img src="${poster}"
             alt="${movie.Title}"
             class="w-full h-48 md:h-56 lg:h-64 object-cover rounded-lg"
        />
      </div>
    `;
  }

  // Load trending movies
  async function loadTrending() {
    showSkeletons(8);
    trendingDiv.innerHTML = "";

    for (let title of trendingList) {
      try {
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${API_KEY}&t=${encodeURIComponent(title)}`
        );
        const data = await res.json();
        if (data.Response === "True") {
          trendingDiv.innerHTML += movieCard(data);
        }
      } catch (err) {
        console.error("Trending load error:", err);
      }
    }
  }

  loadTrending();
});



/* ================= TRAILER PREVIEW ================= */
document.addEventListener("DOMContentLoaded", () => {
const trailerRow = document.getElementById("trailerRow");
const trailerModal = document.getElementById("trailerModal");
const trailerContent = document.getElementById("trailerContent");
const closeTrailer = document.getElementById("closeTrailer");

const trailerAPIKey = "9a5c3803";
const trailerKeywords = ["Avatar", "Oppenheimer", "Barbie", "Guardians", "Black Panther", "Dune"];

// Skeleton loader
function trailerSkeleton(count){
  let html = "";
  for(let i=0;i<count;i++){
    html += `<div class="min-w-[8rem] md:min-w-[9rem] lg:min-w-[10rem] h-48 md:h-56 lg:h-64 bg-gray-300 dark:bg-gray-700 rounded-lg animate-pulse"></div>`;
  }
  return html;
}

// Create movie card with Play button
function trailerCard(movie){
  const poster = movie.Poster && movie.Poster!=="N/A" ? movie.Poster : "https://via.placeholder.com/300x450?text=No+Image";
  return `
    <div class="relative min-w-[8rem] md:min-w-[9rem] lg:min-w-[10rem] cursor-pointer group rounded-lg overflow-hidden">
      <img src="${poster}" alt="${movie.Title}" class="w-full h-48 md:h-56 lg:h-64 object-cover rounded-lg"/>
      <button onclick="playTrailer('${movie.Title}')"
        class="absolute inset-0 m-auto w-10 h-10 bg-indigo-600 text-white rounded-full opacity-90 flex items-center justify-center hover:scale-110 transition">
        ▶
      </button>
      <p class="absolute bottom-2 left-2 right-2 text-sm font-semibold text-white truncate">${movie.Title}</p>
    </div>
  `;
}

// Load trailer preview
async function loadTrailerPreview(){
  trailerRow.innerHTML = trailerSkeleton(6);
  trailerRow.innerHTML = "";

  for(let kw of trailerKeywords){
    try{
      const res = await fetch(`https://www.omdbapi.com/?apikey=${trailerAPIKey}&s=${encodeURIComponent(kw)}`);
      const data = await res.json();
      if(data.Search && data.Search.length > 0){
        trailerRow.innerHTML += trailerCard(data.Search[0]);
      }
    }catch(err){
      console.error("Error loading trailers:", err);
    }
  }
}

// Play trailer in modal
window.playTrailer = function (title) {
  trailerContent.innerHTML = `
    <iframe
      class="w-full h-full rounded"
      src="https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(
        title + " trailer"
      )}&autoplay=1&mute=1"
      frameborder="0"
      allow="autoplay; encrypted-media"
      allowfullscreen>
    </iframe>
  `;
  trailerModal.classList.remove("hidden");
};


// Close modal
closeTrailer.onclick = () => {
  trailerModal.classList.add("hidden");
  trailerContent.innerHTML = '';
};

// Swipe gestures for mobile & drag for desktop
let isDragging = false, startX, scrollLeft;
trailerRow.addEventListener("mousedown", e=>{
  isDragging = true; startX = e.pageX - trailerRow.offsetLeft; scrollLeft = trailerRow.scrollLeft;
  trailerRow.classList.add("cursor-grabbing");
});
trailerRow.addEventListener("mouseleave", ()=>{ isDragging=false; trailerRow.classList.remove("cursor-grabbing"); });
trailerRow.addEventListener("mouseup", ()=>{ isDragging=false; trailerRow.classList.remove("cursor-grabbing"); });
trailerRow.addEventListener("mousemove", e=>{
  if(!isDragging) return;
  e.preventDefault();
  const x = e.pageX - trailerRow.offsetLeft;
  const walk = (x - startX)*2;
  trailerRow.scrollLeft = scrollLeft - walk;
});
trailerRow.addEventListener("touchstart", e=>{
  startX = e.touches[0].pageX - trailerRow.offsetLeft;
  scrollLeft = trailerRow.scrollLeft;
});
trailerRow.addEventListener("touchmove", e=>{
  const x = e.touches[0].pageX - trailerRow.offsetLeft;
  const walk = (x - startX)*2;
  trailerRow.scrollLeft = scrollLeft - walk;
});

// Scroll buttons
function scrollTrailer(amount){ trailerRow.scrollLeft += amount; }

// Initialize
loadTrailerPreview();




/* ================= TOP RATED ================= */
/*function loadTopRated(){
  const favs = JSON.parse(localStorage.getItem("favorites")||"[]");
  const container = document.getElementById("topRated");
  container.innerHTML = "";

  favs.slice(0,4).forEach(async id=>{
    const res = await fetch(`https://www.omdbapi.com/?apikey=9a5c3803&i=${id}`);
    const m = await res.json();
    container.innerHTML += `
      <div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow hover:scale-105 transition">
        <img src="${m.Poster}" class="rounded mb-2"/>
        <h3 class="font-semibold">${m.Title}</h3>
        <p>⭐ ${m.imdbRating}</p>
      </div>
    `;
  });
}
loadTopRated();*/


/* ================= POPULAR LOCATION ================= */
const localMoviesDiv = document.getElementById("localMovies");
const locationSpan = document.getElementById("userLocation");
const POPULAR_KEYWORDS = ["Top", "Hit", "Blockbuster", "Cinema", "Oscar", "Netflix"]; // dynamic recent/popular movies
const API_KEY = "9a5c3803"; // your OMDB key

// Utility: create movie card
function localMovieCard(movie) {
  const poster = movie.Poster && movie.Poster !== "N/A" 
                 ? movie.Poster 
                 : "https://via.placeholder.com/300x450?text=No+Image";

  return `
    <div class="relative group bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-transform transform hover:-translate-y-2 cursor-pointer">
      <img src="${poster}" alt="${movie.Title}" class="w-full h-60 md:h-64 object-cover transition duration-300 group-hover:scale-105"/>
      <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
        <button onclick="playTrailer('${movie.Title}')"
          class="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-full font-semibold">▶ Watch Trailer</button>
      </div>
      <div class="p-3">
        <h3 class="font-semibold text-lg truncate">${movie.Title}</h3>
        <p class="text-gray-500 dark:text-gray-400 text-sm">${movie.Year}</p>
        <span class="inline-block mt-1 px-2 py-1 bg-indigo-100 dark:bg-indigo-700 text-indigo-800 dark:text-white text-xs rounded-full">Popular</span>
      </div>
    </div>
  `;
}

// Load local movies dynamically
async function loadLocal() {
  // Get user location
  let userLoc = "Nigeria"; // placeholder; can integrate geolocation API later
  locationSpan.textContent = userLoc;

  localMoviesDiv.innerHTML = `<div class="col-span-full text-center text-gray-500 dark:text-gray-400 py-12 animate-pulse">Loading popular movies...</div>`;

  localMoviesDiv.innerHTML = "";
  for (let kw of POPULAR_KEYWORDS) {
    try {
      const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${encodeURIComponent(kw)}`);
      const data = await res.json();
      if (data.Search && data.Search.length > 0) {
        localMoviesDiv.innerHTML += localMovieCard(data.Search[0]);
      }
    } catch (err) {
      console.error("Error loading local movies:", err);
    }
  }
}

loadLocal();
});


const leaderboardDiv = document.getElementById("leaderboard");
const podiumDiv = document.getElementById("podium");

async function loadLeaderboard() {
  leaderboardDiv.innerHTML = "Loading...";
  podiumDiv.innerHTML = "";

  // Use RECENT & varied terms
  const queries = ["2024", "new", "love", "dark", "lost"];
  const query = queries[Math.floor(Math.random() * queries.length)];

  const res = await fetch(
    `https://www.omdbapi.com/?apikey=9a5c3803&s=${query}&type=movie&page=1`
  );
  const data = await res.json();
  if (!data.Search) return;

  const movies = data.Search.slice(0, 8).map(m => ({
    ...m,
    score: Math.floor(Math.random() * 40 + 60) // popularity %
  }));

  renderPodium(movies.slice(0, 3));
  renderList(movies.slice(3));
}

function renderPodium(top3) {
  const colors = ["bg-yellow-400", "bg-gray-300", "bg-orange-400"];

  top3.forEach((m, i) => {
    podiumDiv.innerHTML += `
      <div class="text-center transform hover:-translate-y-2 transition">
        <div class="${colors[i]} rounded-xl p-4 shadow-lg">
          <img src="${m.Poster}" class="h-48 mx-auto rounded-lg mb-3"/>
          <h3 class="font-bold">${m.Title}</h3>
          <p class="text-sm">${m.Year}</p>
        </div>
        <p class="mt-2 font-extrabold text-xl">#${i + 1}</p>
      </div>
    `;
  });
}

function renderList(list) {
  leaderboardDiv.innerHTML = "";

  list.forEach((m, i) => {
    leaderboardDiv.innerHTML += `
      <div class="group bg-white dark:bg-gray-800 rounded-xl p-4 shadow
                  hover:shadow-lg transition cursor-pointer"
           onclick="toggleExpand(this)">

        <div class="flex items-center gap-4">
          <span class="text-xl font-extrabold w-6">#${i + 4}</span>

          <img src="${m.Poster}" class="w-14 h-20 rounded object-cover"/>

          <div class="flex-1">
            <h3 class="font-semibold">${m.Title}</h3>
            <p class="text-sm text-gray-500">${m.Year}</p>

            <!-- POPULARITY BAR -->
            <div class="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div class="h-full bg-indigo-600"
                   style="width:${m.score}%"></div>
            </div>
          </div>

          <span class="text-sm font-bold">${m.score}%</span>
        </div>

        <!-- EXPANDABLE -->
        <div class="hidden mt-4 text-sm text-gray-500 lb-expand">
          <button class="px-3 py-1 bg-indigo-600 text-white rounded-full text-xs">
            ▶ Watch Trailer
          </button>
          <button class="ml-2 px-3 py-1 border rounded-full text-xs">
            + Add to Watchlist
          </button>
        </div>
      </div>
    `;
  });
}

function toggleExpand(card) {
  card.querySelector(".lb-expand").classList.toggle("hidden");
}

loadLeaderboard();




/* ================= SEARCH SUGGESTIONS + KEYBOARD SHORTCUT ================= */
const suggestionsUL = document.createElement("ul");
suggestionsUL.id = "suggestions";
suggestionsUL.className = "absolute mt-2 w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden hidden z-50";
searchInput.parentElement.appendChild(suggestionsUL);

let suggestions = [];
let selectedIndex = -1;

// Fetch suggestions while typing
searchInput.addEventListener("input", async () => {
  const query = searchInput.value.trim();
  if (query.length < 2) {
    hideSuggestions();
    return;
  }

  const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`);
  const data = await res.json();

  if (!data.Search) {
    hideSuggestions();
    return;
  }

  suggestions = data.Search.slice(0, 5);
  selectedIndex = -1;

  renderSuggestions();
});

function renderSuggestions() {
  suggestionsUL.innerHTML = "";
  suggestions.forEach((m, i) => {
    const li = document.createElement("li");
    li.className = `
      px-4 py-3 cursor-pointer flex justify-between
      ${i === selectedIndex ? "bg-indigo-600 text-white" : "hover:bg-gray-100 dark:hover:bg-gray-700"}
    `;
    li.innerHTML = `<span>${m.Title}</span><span class="text-sm opacity-60">${m.Year}</span>`;

    li.onclick = () => window.location.href = `movie.html?id=${m.imdbID}`;

    suggestionsUL.appendChild(li);
  });
  suggestionsUL.classList.remove("hidden");
}

function hideSuggestions() {
  suggestionsUL.classList.add("hidden");
  selectedIndex = -1;
}

// Keyboard navigation
searchInput.addEventListener("keydown", (e) => {
  if (suggestionsUL.classList.contains("hidden")) return;

  if (e.key === "ArrowDown") {
    e.preventDefault();
    selectedIndex = (selectedIndex + 1) % suggestions.length;
    renderSuggestions();
  }

  if (e.key === "ArrowUp") {
    e.preventDefault();
    selectedIndex = (selectedIndex - 1 + suggestions.length) % suggestions.length;
    renderSuggestions();
  }

  if (e.key === "Enter") {
    e.preventDefault();
    if (selectedIndex >= 0) {
      window.location.href = `movie.html?id=${suggestions[selectedIndex].imdbID}`;
    } else {
      document.getElementById("searchBtn").click();
    }
    hideSuggestions();
  }
});

// Hide suggestions on click outside
document.addEventListener("click", (e) => {
  if (!searchInput.parentElement.contains(e.target)) hideSuggestions();
});




/* ================= SEARCH ================= */
async function searchMovies(query) {
  if (!query) return;

  currentQuery = query;
  status.textContent = "Searching movies...";
  moviesDiv.innerHTML = skeleton();

  const res = await fetch(`https://www.omdbapi.com/?apikey=${API_KEY}&s=${query}&page=${page}`);
  const data = await res.json();

  if (!data.Search) {
    status.textContent = "No movies found 🎬";
    moviesDiv.innerHTML = "";
    return;
  }

  status.textContent = `Results for "${query}"`;
  moviesDiv.innerHTML = data.Search.map(m =>
    `<div onclick="location.href='movie.html?id=${m.imdbID}'">${movieCard(m, false)}</div>`
  ).join("");

  document.getElementById("searchSection")
    .scrollIntoView({ behavior: "smooth" });
}





/* ================= Trending ================= */
const cities = ["Lagos","Abuja","London","New York","Toronto"];
const movies = ["Inception","Titanic","Avatar","Interstellar","Joker"];

setInterval(()=>{
  document.getElementById("liveFeed").textContent =
    `🎬 Someone in ${cities[Math.floor(Math.random()*cities.length)]} just viewed ${movies[Math.floor(Math.random()*movies.length)]}`;
},3000);

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


/* ================= GENRES ================= */
/*["Action","Comedy","Drama","Horror","Sci-Fi","Romance"].forEach(g => {
  const btn = document.createElement("button");
  btn.textContent = g;
  btn.className = "px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-indigo-600 hover:text-white transition";
  btn.onclick = () => searchMovies(g);
  document.getElementById("genres").appendChild(btn);
});*/

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

/* ================= EVENTS ================= */
document.getElementById("searchBtn").onclick = () => {
  page = 1;
  searchMovies(searchInput.value.trim());
};

searchInput.addEventListener("keydown", e => {
  if (e.key === "Enter") document.getElementById("searchBtn").click();
});

/* ================= INIT ================= */
loadTrending();
