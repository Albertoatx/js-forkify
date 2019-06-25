// ----------------------------------------------------------------------------
//                           GLOBAL APP CONTROLLER 
// ----------------------------------------------------------------------------

import Search from './models/Search';
import Recipe from './models/Recipe';
import ShoppingList from './models/ShoppingList';

import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';

import { DOMelements, renderSpinner, clearSpinner } from './views/base';

/** GLOBAL STATE of the app ***************************************************
 * - Search object (search query + search result)
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};


/** ***************************************************************************
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
  // 1) Get query from the view
  const query = searchView.getSearchInput();
  console.log(query);
  
  if (query) {
      // 2) New search object and add to state
      state.search = new Search(query);

      // 3) Prepare UI for results
      searchView.clearSearchInput();
      searchView.clearResults();
      renderSpinner(DOMelements.searchRes);

      try {
        // 4) Search for recipes
        await state.search.getResults();
  
        // 5) Render results on UI
        //console.log(state.search.result);
        clearSpinner();
        searchView.renderResults(state.search.result);
      } catch (error) {
        clearSpinner();
        alert('Something wrong with the search...');
      }
  }
}


/** ***************************************************************************
 * RECIPE CONTROLLER
 */
const controlRecipe = async () => {

  // 1) Get ID from url
  const id = window.location.hash.replace('#', '');

  if (id) {
      // 2) Prepare UI for changes
      recipeView.clearRecipe();
      renderSpinner(DOMelements.recipe);

      // Highlight selected search item if there was a search
      if (state.search) searchView.highlightSelected(id);

      // 3) Create new recipe object
      state.recipe = new Recipe(id);

      try {
        // 4) Get recipe data
        await state.recipe.getRecipe();

        // 5) Parse ingredients
        state.recipe.parseIngredients();
  
        // 6) Calculate servings and time
        state.recipe.calcTime();
        state.recipe.calcServings();
  
        // 7) Render recipe
        clearSpinner();
        recipeView.renderRecipe(state.recipe);
        console.log(state.recipe);
        
      } catch (error) {
        clearSpinner();
        alert('Error processing recipe');
      }
  }
};


/** ***************************************************************************
 * SHOPPING LIST CONTROLLER
 */
window.sl = new ShoppingList();


// ****************************************************************************
// EVENT LISTENERS (in the controller is where we have all our event listeners)
// ****************************************************************************

// Event listener for the search form (calls the Search Controller)
// ----------------------------------------------------------------------------
DOMelements.searchForm.addEventListener('submit', e => {
  e.preventDefault();  // prevent the page reloading when we submit the form
  controlSearch();
});


// Event listener for the click on pagination buttons
// ----------------------------------------------------------------------------
DOMelements.searchResPages.addEventListener('click', e => {

  // regardless of where we click on the button, target always .btn-inline markup
  const btn = e.target.closest('.btn-inline'); 

  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);// read 'data-goto' attribute

    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);//paginated list of recipes
  }
});

// Event listeners for the 'hashchange' in the URL and the 'load' of the page
// (both call the Recipe controller)
// ----------------------------------------------------------------------------
//window.addEventListener('hashchange', controlRecipe);
//window.addEventListener('load', controlRecipe);
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));


// Event listener for all the buttons in the recipe detail
// ----------------------------------------------------------------------------
DOMelements.recipe.addEventListener('click', e => {

  // Decrease button is clicked (or any child element of that button)
  if (e.target.matches('.btn-decrease, .btn-decrease *')) {
      if (state.recipe.servings > 1) { // avoid having negative servings
          state.recipe.updateServings('dec');
          recipeView.updateServingsIngredients(state.recipe);
      }
  } 
  // Increase button is clicked (or any child element of that button)
  else if (e.target.matches('.btn-increase, .btn-increase *')) {
      state.recipe.updateServings('inc');
      recipeView.updateServingsIngredients(state.recipe);
  } 

  //console.log(state.recipe);
});