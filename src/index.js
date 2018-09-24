// http://www.omdbapi.com/?s=batman&apikey=2cda7206

const favouritesString = localStorage.getItem('favourites');

console.log(favouritesString);
let favourites = !favouritesString ? [] : JSON.parse(favouritesString);
console.log(favourites);

const form = document.querySelector('.form');
const moviesContainer = document.querySelector('.movies');

form.addEventListener('submit', event => {
  event.preventDefault();

  const searchInput = document.querySelector('.form__input');
  const query = searchInput.value;

  search(query);
});

moviesContainer.addEventListener('click', event => {
  if(event.target.matches('.add-to-favourites')){
    const movieId = event.target.dataset.movieId;
    addToFavourites(movieId);
    setButtonToRemove(event.target, movieId);
  }

  if(event.target.matches('.remove-from-favourites')){
    const movieId = event.target.dataset.movieId;
    removeFromFavourites(movieId);
    setButtonToAdd(event.target, movieId);
  }
});

function addToFavourites(movieId){
  favourites.push(movieId);

  persistFavourites(favourites);
}

function removeFromFavourites(movieId){
  favourites = favourites.filter(movieIdInArray => movieId !== movieIdInArray);

  persistFavourites(favourites);
}

function persistFavourites(favourites){
  localStorage.setItem('favourites', JSON.stringify(favourites));
}

function setButtonToRemove(button, movieId){
  button.outerHTML = `<button class="remove-from-favourites" data-movie-id="${movieId}">Remove from favourites</button>`
}

function setButtonToAdd(button, movieId){
  button.outerHTML = `<button class="add-to-favourites" data-movie-id="${movieId}">Add to favourites</button>`
}

function search(query){
  fetch(`http://www.omdbapi.com/?s=${query}&apikey=2cda7206`)
    .then(response => response.json())
    .then( body => displayResults(body));
}

function displayResults(body){
  const moviesList = body.Search.map( movieItem => {
    const isFavourite = favourites.indexOf(movieItem.imdbID) !== -1;

    let button;
    if(isFavourite){
      button = `<button class="remove-from-favourites" data-movie-id="${movieItem.imdbID}">Remove from favourites</button>`;
    } else {
      button = `<button class="add-to-favourites" data-movie-id="${movieItem.imdbID}">Add to favourites</button>`;
    }

    return `
      <div id="${movieItem.imdbID}">
        <h2>${movieItem.Title}</h2>
        <div>
          ${button}
        </div>
        <img src="${movieItem.Poster}" />
      </div>`
  });

  moviesContainer.innerHTML = moviesList.join('');
}
