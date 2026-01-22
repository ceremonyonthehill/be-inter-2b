import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const movieAPI = {
  getAllMovies: () => axios.get(`${API_URL}/movies`),
  getMovie: (id) => axios.get(`${API_URL}/movies/${id}`),
  createMovie: (movieData) => axios.post(`${API_URL}/movies`, movieData),
  updateMovie: (id, movieData) => axios.put(`${API_URL}/movies/${id}`, movieData),
  deleteMovie: (id) => axios.delete(`${API_URL}/movies/${id}`)
};

export const authAPI = {
  register: (userData) => axios.post(`${API_URL}/users/register`, userData),
  login: (userData) => axios.post(`${API_URL}/users/login`, userData)
};
