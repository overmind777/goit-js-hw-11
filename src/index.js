import { PixabayAPI } from './js/imgApi';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix';
import refs from './js/refs';

const pixabayApi = new PixabayAPI(40);
const perPage = 40;
let page = 1;
const simplelightbox = new SimpleLightbox('.gallery a');

refs.formEl.addEventListener('submit', onSubmit);
refs.btnLoadMore.addEventListener('click', onClickLoadMore);

async function onSubmit(e) {
  e.preventDefault();
  refs.imgsContainer.innerHTML = '';
  refs.btnLoadMoreContainer.style.display = 'none';

  page = 1;

  const inputValue = e.target.elements.searchQuery.value.trim();

  if (!inputValue) {
    return Notify.failure('Your query is empty!=)');
  }

  pixabayApi.query = inputValue;

  try {
    const response = await pixabayApi.getImages();

    if (response.hits.length === 0) {
      Notify.warning(`No results ${searchQuery}`);
      refs.list.innerHTML = '';
      return;
    }

    Notify.success(`We find ${response.total} images`);

    refs.imgsContainer.innerHTML = createMurkup(response.hits);

    if (response.hits.length >= pixabayApi.perPage) {
      refs.btnLoadMoreContainer.style.display = 'block';
    }
  } catch (error) {
    Notify.failure('Oppps, something wrong!');
  }
}

async function onClickLoadMore(e) {
  e.preventDefault();

  pixabayApi.page += 1;

  try {
    const response = await pixabayApi.getImages();

    refs.imgsContainer.insertAdjacentHTML(
      'beforeend',
      createMurkup(response.hits)
    );

    if (pixabayApi.page * pixabayApi.perPage >= response.totalHits) {
      refs.btnLoadMoreContainer.style.display = 'none';
      Notify.info("We're sorry, but you've reached the end of search results.");
    }
  } catch (error) {
    console.log(error);
    Notify.failure('Oppps, something wrong!');
  }
}

function createMurkup(arr) {
  return arr
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        views,
        likes,
        comments,
        downloads,
      }) => {
        return `
        <div class="photo-card">
        <a href="${largeImageURL}">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  </a>
  <div class="info">
    <p class="info-item">
      <b>Likes </b>${likes}
    </p>
    <p class="info-item">
      <b>Views </b>${views}
    </p>
    <p class="info-item">
      <b>Comments </b>${comments}
    </p>
    <p class="info-item">
      <b>Downloads </b>${downloads}
    </p>
  </div>
  
</div>`;
      }
    )
    .join('');
}
