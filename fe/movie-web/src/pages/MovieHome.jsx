import { useState, useEffect } from 'react';
import './MovieHome.css';
import { useNavigate } from 'react-router-dom';
import { movieAPI } from '../services/api'; 

export default function MovieHome() {
  const navigate = useNavigate();

  const [movies, setMovies] = useState([]);
  

  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); 

  const handleLogin = () => {
    navigate('/watchlist');
  };


  useEffect(() => {
    fetchMovies();
  }, [searchQuery, sortOrder]);

  const fetchMovies = async () => {
    try {
    
      const response = await movieAPI.getAllMovies({
        search: searchQuery,
        sort: sortOrder
      });
      setMovies(response.data);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  return (
    <div className="movie-container">
      <header className="movie-header">
        <h1 className="movie-header-title">Chill</h1>
        <button onClick={handleLogin} className='my-list'>WatchList</button>
      </header>

      {/* === UI BARU UNTUK FILTER, SEARCH & SORT === */}
      <div className="filters-container" style={{ margin: '20px 0', display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <input 
          type="text" 
          placeholder="Cari judul film..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ padding: '10px', borderRadius: '4px', border: 'none', width: '250px' }}
        />
        <select 
          value={sortOrder} 
          onChange={(e) => setSortOrder(e.target.value)}
          style={{ padding: '10px', borderRadius: '4px', border: 'none' }}
        >
          <option value="asc">Urutkan: A - Z</option>
          <option value="desc">Urutkan: Z - A</option>
        </select>
      </div>
      {/* ========================================= */}

      <div className="movie-grid">

        {movies.length > 0 ? (
          movies.map((movie) => (
            <div key={movie.id} className="movie-card">
              <div className="movie-poster">
                {movie.poster ? (
                  <img src={movie.poster} alt={movie.title} className="movie-img" />
                ) : (
                  <div className="movie-placeholder">
                    <p className="movie-placeholder-text">Add Poster</p>
                  </div>
                )}
              </div>
              <h3 className="movie-title">{movie.title}</h3>
            </div>
          ))
        ) : (
          <p style={{ color: 'white', textAlign: 'center', width: '100%' }}>
            {searchQuery ? `Film "${searchQuery}" tidak ditemukan.` : 'Belum ada film di database.'}
          </p>
        )}
      </div>
    </div>
  );
}