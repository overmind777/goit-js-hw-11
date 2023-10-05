import { getImages } from './js/imgApi';
import SimpleLightbox from 'simplelightbox';
import Notiflix from 'notiflix';
import 'simplelightbox/dist/simple-lightbox.min.css';

const perPage = 40;
let page = 1;
let simplelightbox;

const refs = {
  formEl: document.querySelector('.search-form'),
  imgsContainer: document.querySelector('.gallery'),
  btnLoadMoreContainer: document.querySelector('.btn-container'),
  btnLoadMore: document.querySelector('.load-more'),
};

refs.formEl.addEventListener('submit', onSubmit);
refs.btnLoadMore.addEventListener('click', onClickLoadMore);

function onSubmit(e) {
  e.preventDefault();
  refs.imgsContainer.innerHTML = '';
  refs.btnLoadMoreContainer.style.display = 'none';

  page = 1;

  const inputValue = e.target.elements.searchQuery.value.trim();
  if (inputValue === '') {
    Notiflix.Notify.failure(
      'The search string cannot be empty. Please specify your search query.'
    );
    return;
  }

  localStorage.setItem('inputValue', inputValue);
  getImageArray(localStorage.getItem('inputValue'), page);
  refs.btnLoadMore.disabled = false;
}

function onClickLoadMore(e) {
  e.preventDefault();

  page += 1;

  getImageArray(localStorage.getItem('inputValue'), page);
}

async function getImageArray(query, page) {
  const data = await getImages(query, page, perPage);

  if (page * perPage >= data.totalHits) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    refs.btnLoadMore.disabled = true;
  } else {
    refs.imgsContainer.insertAdjacentHTML('beforeend', createMurkup(data.hits));
    refs.btnLoadMoreContainer.style.display = 'block';
    refs.formEl.reset();
    simpleLightBox = new SimpleLightbox('.gallery a').refresh();
  }
}

function createMurkup(arr) {
  return arr
    .map(
      ({
        webformatWidth,
        webfirmatHeight,
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
