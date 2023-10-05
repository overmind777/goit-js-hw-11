import axios from 'axios';

export class PixabayAPI {
  #BASE_URL = 'https://pixabay.com/api/';
  #KEY = '39812277-da7cb5044774440b30a8e3132';

  constructor(perPage) {
    this.page = 1;
    this.query = null;
    this.perPage = perPage;
  }

  async getImages() {
    const response = await axios.get(`${this.#BASE_URL}?`, {
      params: {
        key: this.#KEY,
        q: this.query,
        page: this.page,
        per_page: this.perPage,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
      },
    });
    return response.data;
  }
}
