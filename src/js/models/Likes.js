export default class Likes {

  constructor() {
      this.likes = [];
  }

  addLike(id, title, author, img) {
      const like = { id, title, author, img };
      this.likes.push(like);

      // Perist data in localStorage
      this.persistData();

      // good practice to return the newly created obj
      return like;
  }

  deleteLike(id) {
      const index = this.likes.findIndex(el => el.id === id);

      // remove the element correspondent to that id
      this.likes.splice(index, 1);

      // Perist data in localStorage
      this.persistData();
  }

  isLiked(id) {
      // test if for an id we have a like in our array (true if already liked)
      return this.likes.findIndex(el => el.id === id) !== -1;
  }

  getNumLikes() {
      return this.likes.length;
  }

  persistData() {
      localStorage.setItem('likes', JSON.stringify(this.likes));
  }

  readStorage() {
    const storage = JSON.parse(localStorage.getItem('likes'));
    
    // Restoring likes from the localStorage
    if (storage) this.likes = storage;
  }

}