// ----------------------------------------------------------------------------
//                           GLOBAL APP CONTROLLER 
// ----------------------------------------------------------------------------

import Search from './models/Search';

import * as searchView from './views/searchView';

import { DOMelements } from './views/base';

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

      // 4) Search for recipes
      await state.search.getResults();

      // 5) Render results on UI
      //console.log(state.search.result);
      searchView.renderResults(state.search.result);
  }
}

// Event listener for the search form
DOMelements.searchForm.addEventListener('submit', e => {
  e.preventDefault();  // prevent the page reloading when we submit the form
  controlSearch();
});