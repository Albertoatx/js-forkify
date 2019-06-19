// ****************************************************************************
//                       REUSABLE variables and c
// ****************************************************************************

// Central variable where we have all DOM elements that we need in our app
export const DOMelements = {
  searchForm: document.querySelector('.search'),
  searchInput: document.querySelector('.search__field'),
  searchRes: document.querySelector('.results'),
  searchResList: document.querySelector('.results__list'),
  searchResPages: document.querySelector('.results__pages'),
};

// Central place where we have all DOM strings that we need in our app
export const DOMstrings = {
  loader: 'loader'            // CSS class
};


// Render a Spinner into the DOM
// ----------------------------------------------------------------------------
export const renderSpinner = parent => {
  const spinner = `
      <div class="${DOMstrings.loader}">
          <svg>
              <use href="img/icons.svg#icon-cw"></use>
          </svg>
      </div>
  `;

  parent.insertAdjacentHTML('afterbegin', spinner);
};

// Clear the Spinner from the DOM
// ----------------------------------------------------------------------------
export const clearSpinner = () => {
  const spinner = document.querySelector(`.${DOMstrings.loader}`);

  if (spinner) spinner.parentElement.removeChild(spinner);
};