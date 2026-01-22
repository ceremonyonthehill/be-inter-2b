import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { movieAPI } from '../services/api';
import './MovieHome.css';

export default function MovieHome() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState([]);
  const [formData, setFormData] = useState({ title: '', poster: '' });
  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // fetch movies on mount ---
  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await movieAPI.getAllMovies();
      setMovies(response.data);
    } catch (error) {
      console.error('Error fetching movies:', error);
      setError('Failed to load movies. Make sure the server is running.');
    } finally {
      setLoading(false);
    }
  };

  // CREATE
  const handleAdd = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      const response = await movieAPI.createMovie({
        title: formData.title,
        poster: formData.poster || null
      });
      setMovies([...movies, response.data]);
      setFormData({ title: '', poster: '' });
      setShowForm(false);
      setError('');
    } catch (error) {
      console.error('Error adding movie:', error);
      setError('Failed to add movie');
    }
  };

  // UPDATE
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      const response = await movieAPI.updateMovie(editId, {
        title: formData.title,
        poster: formData.poster
      });
      setMovies(movies.map(movie =>
        movie.id === editId ? response.data : movie
      ));
      setFormData({ title: '', poster: '' });
      setEditId(null);
      setShowForm(false);
      setError('');
    } catch (error) {
      console.error('Error updating movie:', error);
      setError('Failed to update movie');
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this movie?')) {
      try {
        await movieAPI.deleteMovie(id);
        setMovies(movies.filter(movie => movie.id !== id));
        setError('');
      } catch (error) {
        console.error('Error deleting movie:', error);
        setError('Failed to delete movie');
      }
    }
  };

  const handleEdit = (movie) => {
    setEditId(movie.id);
    setFormData({ title: movie.title, poster: movie.poster || '' });
    setShowForm(true);
  };

  const handleCancel = () => {
    setFormData({ title: '', poster: '' });
    setEditId(null);
    setShowForm(false);
  };

  if (loading) {
    return <div className="loading">Loading movies...</div>;
  }

  return (
    <div className="movie-container2">
      <header className="movie-header">
        <button onClick={() => navigate('/movies')} className="movie-header-title">
          Chill
        </button>
        <button className="add-movie-btn" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Movie'}
        </button>
      </header>

      {error && <div className="error-message">{error}</div>}

      {showForm && (
        <div className="movie-form-container">
          <form onSubmit={editId ? handleUpdate : handleAdd} className="movie-form">
            <h2 className="form-title">{editId ? 'Edit Movie' : 'Add New Movie'}</h2>
            <div className="form-group">
              <label htmlFor="title">Movie Title</label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter movie title"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="poster">Poster URL</label>
              <input
                type="text"
                id="poster"
                value={formData.poster}
                onChange={(e) => setFormData({ ...formData, poster: e.target.value })}
                placeholder="Enter poster URL (optional)"
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="submit-btn">
                {editId ? 'Update' : 'Add'} Movie
              </button>
              <button type="button" className="cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="movie-grid">
        {movies.length === 0 && !loading ? (
          <p className="no-movies">No movies yet. Add your first movie!</p>
        ) : (
          movies.map((movie) => (
            <div key={movie.id} className="movie-card">
              <div className="movie-poster">
                {movie.poster ? (
                  <img src={movie.poster} alt={movie.title} className="movie-img" />
                ) : (
                  <div className="movie-placeholder">
                    <p className="movie-placeholder-text">No Poster</p>
                  </div>
                )}
              </div>
              <h3 className="movie-title">{movie.title}</h3>
              <div className="movie-actions">
                <button className="edit-btn" onClick={() => handleEdit(movie)}>
                  Edit
                </button>
                <button className="delete-btn" onClick={() => handleDelete(movie.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
