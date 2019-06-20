import { DOMelements } from './base';

// ****************************************************************************
//                               INTERNAL functions
// ****************************************************************************

// Renders a single recipe into the DOM
// ----------------------------------------------------------------------------
const renderRecipe = recipe => {

  // create the markup for each recipe
  const markup = `
      <li>
          <a class="results__link" href="#${recipe.recipe_id}">
              <figure class="results__fig">
                  <img src="${recipe.image_url}" alt="${recipe.title}">
              </figure>
              <div class="results__data">
                  <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                  <p class="results__author">${recipe.publisher}</p>
              </div>
          </a>
      </li>
  `;

  // render it to the DOM
  DOMelements.searchResList.insertAdjacentHTML('beforeend', markup);
};


// Reduce title size to occupy only 1 line while also not breaking any word.
// ----------------------------------------------------------------------------
// Example with title 'Pasta with tomato and spinach'. 
// Splits into 5 words, Reduce will carry out 5 iterations:
//   acc: 0  / acc + cur.length = 5  / newTitle = ['Pasta']
//   acc: 5  / acc + cur.length = 9  / newTitle = ['Pasta', 'with']
//   acc: 9  / acc + cur.length = 15 / newTitle = ['Pasta', 'with', 'tomato']
//   acc: 15 / acc + cur.length = 18 / newTitle = ['Pasta', 'with', 'tomato']
//   acc: 18 / acc + cur.length = 24 / newTitle = ['Pasta', 'with', 'tomato']
// ----------------------------------------------------------------------------
export const limitRecipeTitle = (title, limit = 17) => {
  const newTitle = [];

  if (title.length > limit) {
      title.split(' ').reduce((acc, cur) => {
          if (acc + cur.length <= limit) {
              newTitle.push(cur);
          }
          return acc + cur.length;
      }, 0);

      // return the result
      return `${newTitle.join(' ')} ...`;
  }
  return title;
}


// Renders Pagination buttons into the DOM
// ----------------------------------------------------------------------------
const renderPaginationButtons = (page, numResults, resPerPage) => {

  const numPages = Math.ceil(numResults / resPerPage);
  let button;

  // If first page && more than 1 page -> Render only button to next page
  // If last  page && more than 1 page -> Render only button to previous page
  // If we are in any other page       -> Render both buttons (previous, next)
  if (page === 1 && numPages > 1) {
      // next page button
      button = createPaginationButton(page, 'next');

  } else if (page < numPages) {
      // both buttons
      button = `
        ${createPaginationButton(page, 'prev')}
        ${createPaginationButton(page, 'next')}
      `;

  } else if (page === numPages && numPages > 1) {
      // prev page button
      button = createPaginationButton(page, 'prev');
  }

  // render to the DOM
  DOMelements.searchResPages.insertAdjacentHTML('afterbegin', button);
};


// Create a Pagination button markup depending on the type: 'prev' or 'next'
// ----------------------------------------------------------------------------
const createPaginationButton = (page, type) => `
  <button 
    class="btn-inline results__btn--${type}" 
    data-goto=${type === 'prev' ? page - 1 : page + 1}
  >
    <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
    <svg class="search__icon">
      <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}">
      </use>
    </svg>
  </button>
`;


// ****************************************************************************
//                               EXPORTED functions
// ****************************************************************************

// Get the user input from the search field
// ---------------------------------------------------------------------------
export const getSearchInput = () => DOMelements.searchInput.value;// implict return


// Clear the user input from the search field
// ---------------------------------------------------------------------------
export const clearSearchInput = () => {
  DOMelements.searchInput.value = '';
};

// Send the list of recipes to be rendered by the 'renderRecipe' function 
// ----------------------------------------------------------------------------
export const renderResults = (recipes, page = 1, resPerPage = 10) => {
  const start = (page - 1) * resPerPage;
  const end   = page * resPerPage;

  recipes.slice(start, end).forEach(renderRecipe); //.forEach(el => renderRecipe(el));

  // render the pagination buttons
  renderPaginationButtons(page, recipes.length, resPerPage);
};

// Clear the list of recipes from a previous search
// ---------------------------------------------------------------------------
export const clearResults = () => {
  DOMelements.searchResList.innerHTML = '';
  DOMelements.searchResPages.innerHTML = ''; // clear pagination buttons
};


// Select the recipe from the list of recipes that must be highlighted 
// ---------------------------------------------------------------------------
export const highlightSelected = id => {

  // remove the active class from any recipe in the list
  const resultsArr = Array.from(document.querySelectorAll('.results__link'));
  resultsArr.forEach(el => {
      el.classList.remove('results__link--active');
  });

  // select the recipe using its id and add an active class
  document.querySelector(`.results__link[href*="${id}"]`).classList.add('results__link--active');
};


