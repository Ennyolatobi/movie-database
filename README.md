# 🎬 Movie Database Application

A **dynamic multi-page Movie Database website** built with **HTML, CSS, and JavaScript**.  
Users can search for movies, view detailed information, and manage a list of favorite movies. This project uses the **OMDb API** to fetch movie data in real-time.

---

## **Project Features**

### Core Features
- **Search Movies:** Users can search for movies by title.  
- **Movie Details Page:** Displays detailed information including plot, genre, actors, ratings, and poster.  
- **Favorites List:** Users can add/remove movies to a favorites list, stored in `localStorage`.  
- **Sorting:** Sort search results by **year** or **IMDb rating**.  
- **Navigation:** Multi-page navigation between Home, Movie Details, and Favorites pages.  
- **Responsive Design:** Fully functional and responsive on **desktop, tablet, and mobile**.  
- **Loading Indicators & Error Handling:** Clear feedback for API calls and invalid queries.

### Optional/Extra Features
- Back button on movie details page  
- Clean UI layout with hover effects on movie cards  
- Ready for enhancements such as light/dark mode and YouTube trailers

---

## **Project Structure**

movie-database/
├── index.html ← Search & movie list page
├── movie.html ← Movie details page
├── favorites.html ← Favorite movies page
├── style.css ← Shared CSS for all pages
├── script.js ← Functions for search, display, and favorites
├── movie.js ← Functions for movie.html page
├── favorites.js ← Functions for favorites.html page
└── README.md ← Project documentation