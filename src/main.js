import { getImagesByQuery } from './js/pixabay-api.js';
import { createGallery, clearGallery, showLoader, hideLoader, showLoadMoreButton, hideLoadMoreButton, getBoundingClientRect } from './js/render-functions.js';
// Описаний у документації
import iziToast from "izitoast";
// Додатковий імпорт стилів
import "izitoast/dist/css/iziToast.min.css";

const form = document.querySelector('.form');
const input = document.querySelector('input[name="search-text"]');

let currentQuery = '';
let currentPage = 1;
const PER_PAGE = 15;

function updateLoadMoreVisibility(totalHits) {
  const totalPages = Math.ceil(totalHits / PER_PAGE);
  if (currentPage < totalPages) {
    showLoadMoreButton();
  } else {
    hideLoadMoreButton();
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const query = input.value.trim();
  if (!query) {
    iziToast.warning({
      title: 'Ввдіть пошуковий запит',
      timeout: 3000
    });
    return;
  }

  hideLoadMoreButton();

  currentQuery = query;
  currentPage = 1;
  clearGallery();

  showLoader();
  try {
    const data = await getImagesByQuery(currentQuery, currentPage);

    if (data && data.hits.length > 0) {
      createGallery(data.hits);
      updateLoadMoreVisibility(data.totalHits);

      // If all results fit on a single page, inform the user
      const totalPages = Math.ceil(data.totalHits / PER_PAGE);
      if (totalPages <= 1) {
        hideLoadMoreButton();
        iziToast.info({
          title: "You've reached the end of search results.",
          timeout: 3000
        });
      }
    } else {
      iziToast.error({
        title: `Sorry, there are no images matching your search query. Please try again!`,
        timeout: 4000
      });
    }
  } catch (error) {
    iziToast.error({
      title: 'Не вдалось завантажити зображення',
      message: error.message,
      timeout: 4000
    });
  } finally {
    hideLoader();
  }
});

const loadMoreBtn = document.getElementById('load-more');

loadMoreBtn.addEventListener('click', async () => {
  // Prevent multiple clicks while fetching
  hideLoadMoreButton();

  currentPage += 1;
  showLoader();
  try {
    const data = await getImagesByQuery(currentQuery, currentPage);

    if (data && data.hits.length > 0) {
      createGallery(data.hits);

      // Ensure scroll happens after DOM paint
      getBoundingClientRect();

      updateLoadMoreVisibility(data.totalHits);

      const totalPages = Math.ceil(data.totalHits / PER_PAGE);
      if (currentPage >= totalPages) {
        hideLoadMoreButton();
        iziToast.info({
          title: "We're sorry, but you've reached the end of search results.",
          timeout: 4000
        });
      }
    } else {
      hideLoadMoreButton();
      iziToast.info({
        title: "We're sorry, but you've reached the end of search results.",
        timeout: 4000
      });
    }
  } catch (error) {
    iziToast.error({
      title: 'Не вдалось завантажити зображення',
      message: error.message,
      timeout: 4000
    });
  } finally {
    hideLoader();
  }
});
