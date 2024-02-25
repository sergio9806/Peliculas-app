

import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;
const API_KEY = process.env.REACT_APP_API_KEY;

export const fetchTopRatedMovies = async () => {
  try {
    const { data } = await axios.get(`${API_URL}/movie/top_rated?api_key=${API_KEY}`);
    return data.results;
  } catch (error) {
    console.error('Error fetching top rated movies:', error);
    return [];
  }
};

export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/genre/movie/list?api_key=${API_KEY}`);
    return response.data.genres;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

