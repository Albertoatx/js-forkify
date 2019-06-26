export default class Likes {

  constructor() {
      this.likes = [];
  }

  addLike(id, title, author, img) {
      const like = { id, title, author, img };
      this.likes.push(like);

      // good practice to return the newly created obj
      return like;
  }

  deleteLike(id) {
      const index = this.likes.findIndex(el => el.id === id);

      // remove the element correspondent to that id
      this.likes.splice(index, 1);
  }

  isLiked(id) {
      // test if for an id we have a like in our array (true if already liked)
      return this.likes.findIndex(el => el.id === id) !== -1;
  }

  getNumLikes() {
      return this.likes.length;
  }

}