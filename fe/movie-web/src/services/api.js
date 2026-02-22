import axios from 'axios';

const API_URL = 'http://localhost:3000';


const api = axios.create({
  baseURL: API_URL
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});


export const movieAPI = {
  getAllMovies: () => api.get('/movies'),
  getMovie: (id) => api.get(`/movies/${id}`),
  createMovie: (movieData) => api.post('/movies', movieData),
  updateMovie: (id, movieData) => api.put(`/movies/${id}`, movieData),
  getAllMovies: (params) => axios.get(`${API_URL}/movies`, { params }),
  deleteMovie: (id) => api.delete(`/movies/${id}`)
};


export const authAPI = {
  register: (userData) => axios.post(`${API_URL}/users/register`, userData),
  login: (userData) => axios.post(`${API_URL}/users/login`, userData)
};