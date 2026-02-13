import Movie from './movie.js';

const API_URL = 'http://localhost:3000/movies';
//dom-element
const movieSelect = document.getElementById('movie');
const countDisplay = document.getElementById('count');
const totalDisplay = document.getElementById('total');
const seats = document.querySelectorAll('.row .seat:not(.occupied)'); 

//globala variabler
let movies = [];
let currentMovie = null; 

// hämta frå api
 async function fetchMovies() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json(); 

        //skapa movie objekt från api-data
        movies = data.map(item => new Movie(
            item.Title,
            item.Price
        )); 

        //första filmen sätts som aktiv
        currentMovie = movies[0];

        populateMovieSelect();
        addSeatListeners();
        updateCountAndTotal();

    } catch (error) {
        console.log('API hämtningen misslyckades- använder backup data');
        useBackupMovies();
    }
}

// backup datan- ifall api ej fungerar
function useBackupMovies(){
    movies = [
        new Movie('Jujutsu kaisen: Execution',10),
        new Movie('Chainsaw Man-The movie:Reze Arc',5),
        new Movie('Demon Slayer:Kimetsu no Yaiba-The Movie: Infinity Castle',7), 
        new Movie('Barbie in the Nutcracker',4)
    ];
currentMovie = movies[0];
populateMovieSelect();
addSeatListeners();
updateCountAndTotal();
}

//dropdown film-alternativ
function populateMovieSelect(){
    movieSelect.innerHTML = '';

    // varje film är ett alternativ
  movies.forEach((movie, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = `${movie.title} ( $${movie.price})`;
    movieSelect.appendChild(option);
  });
}

function addSeatListeners() {
  seats.forEach(seat => {
    seat.addEventListener('click', toggleSeat);
  });
}

// välj lediga
function toggleSeat(event) {
 
  event.target.classList.toggle('selected');
  

  updateCountAndTotal();
}

function updateCountAndTotal() {

  const selectedSeats = document.querySelectorAll('.row .seat.selected');
  const count = selectedSeats.length;
  

  const total = count * (currentMovie?.price || 0);
  
  // upddatera dom
  countDisplay.textContent = count;
  totalDisplay.textContent = total;
}

movieSelect.addEventListener('change', function() {
  const index = parseInt(this.value);
  currentMovie = movies[index];
  updateCountAndTotal();
});

fetchMovies();