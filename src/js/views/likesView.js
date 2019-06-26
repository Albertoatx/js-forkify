import { DOMelements } from './base';
import { limitRecipeTitle } from './searchView';


// ****************************************************************************
//                               EXPORTED functions
// ****************************************************************************

// Toogles the Like button to show different icons
// ----------------------------------------------------------------------------
export const toggleLikeBtn = isLiked => {
  // Set which icon to show
  const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
  
  // Set the 'href' attribute of the element selected with the proper icon
  document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
};

// Toggles the Like Menu 
// ----------------------------------------------------------------------------
export const toggleLikeMenu = numLikes => {
  DOMelements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
};

// Renders a Liked element into the Likes Menu
// ----------------------------------------------------------------------------
export const renderLike = like => {
  const markup = `
      <li>
          <a class="likes__link" href="#${like.id}">
              <figure class="likes__fig">
                  <img src="${like.img}" alt="${like.title}">
              </figure>
              <div class="likes__data">
                  <h4 class="likes__name">${limitRecipeTitle(like.title)}</h4>
                  <p class="likes__author">${like.author}</p>
              </div>
          </a>
      </li>
  `;

  // insert the HTML into the DOM
  DOMelements.likesList.insertAdjacentHTML('beforeend', markup);
};


// Deletes a Like element from the Likes Menu list
// ----------------------------------------------------------------------------
export const deleteLike = id => {
  // use CSS attribute selector (brackets) to select based on 'href'
  const liEl = document.querySelector(`.likes__link[href*="${id}"]`)
                       .parentElement; // <li>

  if (liEl) liEl.parentElement.removeChild(liEl);
}