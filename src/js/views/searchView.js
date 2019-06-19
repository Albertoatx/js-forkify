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
                  <h4 class="results__name">${recipe.title}</h4>
                  <p class="results__author">${recipe.publisher}</p>
              </div>
          </a>
      </li>
  `;

  // render it to the DOM
  DOMelements.searchResList.insertAdjacentHTML('beforeend', markup);
};


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
export const renderResults = (recipes) => {
  recipes.forEach(renderRecipe); // recipes.forEach(el => renderRecipe(el));
};

// Clear the list of recipes from a previous search
// ---------------------------------------------------------------------------
export const clearResults = () => {
  DOMelements.searchResList.innerHTML = '';
};

