import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const loadMoreButton = document.querySelector('.load-more');
const imagesSearchForm = document.querySelector('#search-form');
const imagesGalleryContainer = document.querySelector('.gallery');
const perPage = 40;
let currentPage = 1;
let totalHits = 0;

// Приховуємо кнопку "Load more" в початковому стані
loadMoreButton.style.display = 'none';

// Отримуємо зображення з API
function fetchImages(searchQuery) {
  const KEY = '38213838-3daddfe3507b21e9b34121ca2';
  const url = `https://pixabay.com/api/?key=${KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}&per_page=${perPage}`;

  return axios
    .get(url)
    .then(response => {
      totalHits = response.data.totalHits; // Оновлюємо загальну кількість зображень
      return response.data;
    })
    .catch(error => {
      console.log(error);
    });
}

// Відображаємо зображення в галереї
function displayImages(imagesArea) {
  // Очищаємо контейнер галереї
  imagesGalleryContainer.innerHTML = '';

  // Додаємо картки зображень до контейнера
  imagesArea.forEach(image => {
    const html = `
      <a class="card-link" href="${image.largeImageURL}"><div class="photo-card">
        <img src="${image.previewURL}" alt="${image.tags}" loading="lazy" />
        <div class="info">
          <p class="info-item">
            <b>Likes:</b> ${image.likes}
          </p>
          <p class="info-item">
            <b>Views:</b> ${image.views}
          </p>
          <p class="info-item">
            <b>Comments:</b> ${image.comments}
          </p>
          <p class="info-item">
            <b>Downloads:</b> ${image.downloads}
          </p>
        </div>
      </div></a>`;

    imagesGalleryContainer.insertAdjacentHTML('beforeend', html);

     
  });

   const lightbox = new SimpleLightbox('.gallery a');
  lightbox.refresh();

  // Перевіряємо кількість отриманих зображень та загальну кількість зображень
  if (imagesArea.length < perPage || currentPage * perPage >= totalHits) {
    loadMoreButton.style.display = 'none';
    if (currentPage === 1) {
      Notiflix.Notify.info("We're sorry, but there are no images matching your search query.");
    } else {
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    }
  } else {
    loadMoreButton.style.display = 'block';
  }
}

// Додаємо обробник події відправки форми пошуку
imagesSearchForm.addEventListener('submit', evt => {
  evt.preventDefault();

  const searchQueryInput = document.querySelector('.search-form input[name="searchQuery"]');
  const searchQuery = searchQueryInput.value.trim();
  if (searchQuery !== '') {
    // Приховуємо кнопку перед запитом
    loadMoreButton.style.display = 'none';
    currentPage = 1;
    fetchImages(searchQuery)
      .then(data => {
        // Відображаємо зображення після отримання результатів
        displayImages(data.hits);
        loadMoreButton.style.display = 'block';

      })
      .catch(error => {
        console.error(error);
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      });
  }
  
});

// Додаємо обробник події кліку на кнопку "Load more"
loadMoreButton.addEventListener('click', () => {

  const searchQuery = document.querySelector('.search-form input[name="searchQuery"]').value.trim();
  
  if (searchQuery !== '') {
    currentPage++;
    fetchImages(searchQuery)
      .then(data => {
        // Відображаємо додаткові зображення після отримання результатів
        displayImages(data.hits);
      })
      .catch(error => {
        console.error(error);
        Notiflix.Notify.failure('Sorry, there was an error while loading more images.');
      });
  }
});
