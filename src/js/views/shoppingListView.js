import { DOMelements } from './base';

// ****************************************************************************
//                               INTERNAL functions
// ****************************************************************************


// ****************************************************************************
//                               EXPORTED functions
// ****************************************************************************

// Renders an item of the shopping list into the DOM
// ----------------------------------------------------------------------------
export const renderItem = item => {
  const markup = `
      <li class="shopping__item" data-itemid=${item.id}>
          <div class="shopping__count">
              <input type="number" value="${item.count}" step="${item.count}" class="shopping__count-value" min="0">
              <p>${item.unit}</p>
          </div>
          <p class="shopping__description">${item.ingredient}</p>
          <button class="shopping__delete btn-tiny">
              <svg>
                  <use href="img/icons.svg#icon-circle-with-cross"></use>
              </svg>
          </button>
      </li>
  `;

  // render to the DOM (beforeend: add each item after the other)
  DOMelements.shopping.insertAdjacentHTML('beforeend', markup);
};

// Deletes an item from the shopping list
// ----------------------------------------------------------------------------
export const deleteItem = id => {
  // use the CSS attribute selector (brackets) to select based on 'data-itemid'
  const item = document.querySelector(`[data-itemid="${id}"]`);

  if (item) item.parentElement.removeChild(item);
};