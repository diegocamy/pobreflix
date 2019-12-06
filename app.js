//API KEY
const KEY = 'edbbeb2dc6cd0b51d2adc2cda033d3dd';
const LANGUAGE = 'language=es'

//ELEMENTS
const welcomeButton = document.querySelector(".welcome-button");
const searchButton = document.querySelector(".button-buscar");
const divPopulares = document.querySelector("#lista-populares");
const divTopRated = document.querySelector("#lista-top-rated");
const divUpcoming = document.querySelector("#lista-upcoming");
const movieSection = document.querySelector("#peliculas");
const searchResult = document.querySelector(".search-results");
const input = document.querySelector('input');


//SESSION STORAGE TO SHOW WELCOME LOGO WITH ANIMATION ONLY ONCE PER SESSION
if (window.sessionStorage.getItem("message") === null) {
  window.sessionStorage.setItem("message", "not");
  movieSection.classList.add("hide");
} else {
  document.querySelector(".welcome").style.display = "none";
  movieSection.classList = "";
  (evt) => fetchMovies(evt, "popular", divPopulares);
  (evt) => fetchMovies(evt, "top_rated", divTopRated);
  (evt) => fetchMovies(evt, "upcoming", divUpcoming);

}


//FUNCTIONS
const fadeWelcomePage = function () {
  this.parentNode.classList.add('puff-out-center');
  movieSection.classList.remove("hide");
  setTimeout(() => {
    this.parentNode.style.display = "none";
  }, 1000);
}

const hideMovieSection = function () {
  movieSection.classList.add("hide");
}

//FETCHING FUNCTIONS
const fetchMovies = function (evt, categoria, targetDiv) {
  evt.preventDefault();
  fetch(`https://api.themoviedb.org/3/movie/${categoria}?api_key=${KEY}&${LANGUAGE}&page=1`)
    .then(res => res.json())
    .then(filmes => mostrarFilmes(filmes.results, targetDiv))
    .catch(err => console.log(err));
}

const searchMovies = function (evt, targetDiv) {
  searchResult.innerHTML = "";
  searchResult.innerHTML = `<div class="lds-facebook"><div></div><div></div><div></div></div>`;
  document.querySelector("#peliculas").style.display = "none";
  evt.preventDefault();
  const pelicula = input.value;

  if (pelicula.split(" ").join("").length === 0) {
    document.querySelector("#peliculas").style.display = "block";

    document.querySelector(".lds-facebook").parentElement.removeChild(document.querySelector(".lds-facebook"))
  } else {
    fetch(`https://api.themoviedb.org/3/search/movie?api_key=${KEY}&${LANGUAGE}&query=${pelicula}&page=1&include_adult=false`)
      .then(response => response.json())
      .then(filmes => {
        if (filmes.results.length === 0) {
          targetDiv.innerHTML = `</h2>No se encontraron peliculas</h2>`
          return
        }
        mostrarFilmes(filmes.results, targetDiv);
        document.querySelector(".lds-facebook").parentElement.removeChild(document.querySelector(".lds-facebook"))
      })
      .catch(err => console.log(err));
  }
}

const mostrarFilmes = function (filmes, targetDiv) {
  filmes.forEach(film => {
    const div = document.createElement("div");
    const poster = document.createElement("img");
    poster.src = `http://image.tmdb.org/t/p/w185/${film.poster_path}`
    const titulo = document.createElement("p");
    film.title.length > 16 ?
      titulo.textContent = film.title.substring(0, 16) + "..." :
      titulo.textContent = film.title;
    const puntaje = document.createElement("p");
    puntaje.textContent = `Calificación: ${film.vote_average}`;
    div.appendChild(poster);
    div.appendChild(titulo);
    div.appendChild(puntaje);
    div.title = film.overview;
    targetDiv.appendChild(div);
  });
}

//EVENT LISTENERS
welcomeButton.addEventListener('click', fadeWelcomePage)
searchButton.addEventListener('click', (evt) => searchMovies(evt, searchResult));


//ON LOAD EVENT
window.addEventListener('load', (evt) => fetchMovies(evt, "popular", divPopulares));
window.addEventListener('load', (evt) => fetchMovies(evt, "top_rated", divTopRated));
window.addEventListener('load', (evt) => fetchMovies(evt, "upcoming", divUpcoming));