import axios from 'axios';

export async function getImages(query, page, perPage) {
  const BASE_URL = 'https://pixabay.com/api/';
  const KEY = '39812277-da7cb5044774440b30a8e3132';

  const resp = await axios.get(
    `${BASE_URL}?key=${KEY}&q=${query}&page=${page}&per_page=${perPage}&image_type=photo&orientation=horizontal&safesearch=true`
  );
  return resp.data;
}
