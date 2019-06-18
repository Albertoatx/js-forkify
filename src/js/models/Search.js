import axios from 'axios';

export default class Search {

  constructor(query){
    this.query = query;
  }

  async getResults() {
    const proxy = 'https://cors-anywhere.herokuapp.com/';
    const key = '572b9a9f6f7e1536e7d91520028d321b';

    try {
        const res = await axios(`${proxy}http://food2fork.com/api/search?key=${key}&q=${this.query}`);
        this.result = res.data.recipes;
        console.log(this.result);        
    } catch (error) {
        alert(error);
    }
  }
}