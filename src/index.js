import axios from 'axios';
import Notiflix from 'notiflix';


function fetchImages(searchQuery) {
  const KEY = '38213838-3daddfe3507b21e9b34121ca2';
  const url = `https://pixabay.com/api/?key=${KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true`;

  return axios.get(url)
    .then(response => response.data)
    .catch(error => {
      console.log(error);
    });
}

const imagesSearchForm = document.querySelector('#search-form');
const imagesGalleryContainer = document.querySelector('.gallery');

imagesSearchForm.addEventListener('submit', evt => {
  evt.preventDefault();
  
  const searchQuery = document.querySelector('.search-form input[name="searchQuery"]').value;

  if (searchQuery !== '') {
    fetchImages(searchQuery)
      .then(data => {
        displayImages(data.hits);
      })
      .catch(error => {
        console.error(error);
        Notiflix.Notify.failure('Sorry, there are no images matching your search query. Please try again.');
      });
  }
});



function displayImages(imagesArea) {
  imagesGalleryContainer.innerHTML = '';

  imagesArea.forEach(image => {
    const html = `
      <div class="photo-card">
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
      </div>`;

    imagesGalleryContainer.insertAdjacentHTML('beforeend', html);
  });
}