// ----------------------------------------------------------------------------
//                           GLOBAL APP CONTROLLER 
// ----------------------------------------------------------------------------

import Search from './models/Search';

import * as searchView from './views/searchView';

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

      // 4) Search for recipes
      await state.search.getResults();

      // 5) Render results on UI
      //console.log(state.search.result);
      clearSpinner();
      searchView.renderResults(state.search.result);
  }
}

// ----------------------------------------------------------------------------
// EVENT LISTENERS (in the controller is where we have all our event listeners)
// ----------------------------------------------------------------------------

// Event listener for the search form
DOMelements.searchForm.addEventListener('submit', e => {
  e.preventDefault();  // prevent the page reloading when we submit the form
  controlSearch();
});

// Event listener for the click on pagination buttons
DOMelements.searchResPages.addEventListener('click', e => {

  // regardless of where we click on the button, target always .btn-inline markup
  const btn = e.target.closest('.btn-inline'); 

  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10);// read 'data-goto' attribute

    searchView.clearResults();
    searchView.renderResults(state.search.result, goToPage);//paginated list of recipes
  }
});