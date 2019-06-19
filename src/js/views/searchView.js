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

