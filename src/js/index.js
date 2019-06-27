// ----------------------------------------------------------------------------
//                           GLOBAL APP CONTROLLER 
// ----------------------------------------------------------------------------

import Search from './models/Search';
import Recipe from './models/Recipe';
import ShoppingList from './models/ShoppingList';
import Likes  from './models/Likes';

import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as shopListView from './views/shoppingListView';
import * as likesView  from './views/likesView';

import { DOMelements, renderSpinner, clearSpinner } from './views/base';

/** GLOBAL STATE of the app ***************************************************
 * - Search object (search query + search result)
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */
const state = {};
//window.state = state;  // only for testing purposes


/** ***************************************************************************
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
  // 1) Get query from the view
  const query = searchView.getSearchInput();
  //console.log(query);
  
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
        recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
        //console.log(state.recipe);
        
      } catch (error) {
        clearSpinner();
        alert('Error processing recipe');
      }
  }
};


/** ***************************************************************************
 * SHOPPING LIST CONTROLLER
 */
const controlShoppingList = () => {
  // Create a new list in our state object only IF there is none yet
  if (!state.shopList) state.shopList = new ShoppingList();

  // Add each ingredient of a recipe to the shopping list and UI
  state.recipe.ingredients.forEach(el => {
      const item = state.shopList.addItem(el.count, el.unit, el.ingredient);
      shopListView.renderItem(item);
  });
}


/** ***************************************************************************
 * LIKES CONTROLLER
 */
//state.likes = new Likes();// ONLY FOR TESTING while persistence not implemented
//likesView.toggleLikeMenu(state.likes.getNumLikes()); // ONLY for TESTING

const controlLike = () => {

  // Create a like list in our state object only IF there is none yet
  if (!state.likes) state.likes = new Likes();

  const currentID = state.recipe.id;

  // User has NOT yet liked current recipe
  if (!state.likes.isLiked(currentID)) {

      // Add like to the state
      const newLike = state.likes.addLike(
          currentID,
          state.recipe.title,
          state.recipe.author,
          state.recipe.img
      );

      // Toggle the like button
      likesView.toggleLikeBtn(true);

      // Add like to UI list
      likesView.renderLike(newLike);
      //console.log(state.likes);

  // User HAS liked current recipe
  } else {

      // Remove like from the state
      state.likes.deleteLike(currentID);

      // Toggle the like button
      likesView.toggleLikeBtn(false);
      
      // Remove like from UI list
      likesView.deleteLike(currentID);
      //console.log(state.likes);
  }

  // ensure that the heart menu is only displayed when there is actually a like
  likesView.toggleLikeMenu(state.likes.getNumLikes());
};


// ****************************************************************************
// EVENT LISTENERS (in the controller is where we have all our event listeners)
// ****************************************************************************


// Event listener to restore the 'liked' recipes on page load
// ----------------------------------------------------------------------------
window.addEventListener('load', () => {
  // each time the page loads create a new likes object
  state.likes = new Likes();
  
  // Restore likes
  state.likes.readStorage();

  // Toggle like menu button
  likesView.toggleLikeMenu(state.likes.getNumLikes());

  // Render the existing likes
  state.likes.likes.forEach(like => likesView.renderLike(like));
});


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
  // Add recipe to shoppinglist button (or any child element of that button)
  else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
      controlShoppingList();
  } 
  // Like button is clicked (or any child element of that button)
  else if (e.target.matches('.recipe__love, .recipe__love *')) {
      controlLike();
  }

  //console.log(state.recipe);
});


// Event listener to handle delete and update items from the shopping list
// ----------------------------------------------------------------------------
DOMelements.shopping.addEventListener('click', e => {
  // retrieve the id from the element that we click on (wherever we click)
  const id = e.target.closest('.shopping__item').dataset.itemid;

  // Handle the delete button
  if (e.target.matches('.shopping__delete, .shopping__delete *')) {
      // Delete from state
      state.shopList.deleteItem(id);

      // Delete from UI
      shopListView.deleteItem(id);
  } 
  // Handle the count update button
  else if (e.target.matches('.shopping__count-value')) {
      // retrieve the new count value from the UI
      const value = parseFloat(e.target.value, 10);

      // Update it in the state
      state.shopList.updateCount(id, value);
  }
});