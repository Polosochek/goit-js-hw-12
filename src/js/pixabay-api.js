import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';

export async function getImagesByQuery(query, page = 1) {
  const params = {
    key: '53595535-e5f82fa4261a3268ac261655e',
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    page,
    per_page: 15,
  };

  try {
    const response = await axios.get('/', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching images:', error);
    return null;
  }
}
