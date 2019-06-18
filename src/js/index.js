// ----------------------------------------------------------------------------
//                           GLOBAL APP CONTROLLER 
// ----------------------------------------------------------------------------

import Search from './models/Search';

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
  const query = 'pizza';  // TODO

  if (query) {
      // 2) New search object and add to state
      state.search = new Search(query);

      // 3) Prepare UI for results

      // 4) Search for recipes
      await state.search.getResults();

      // 5) Render results on UI
      console.log(state.search.result);
  }
}

// Event listener for the search form
document.querySelector('.search').addEventListener('submit', e => {
  e.preventDefault();  // prevent the page reloading when we submit the form
  controlSearch();
});

// const search = new Search('pizza');
// search.getResults();