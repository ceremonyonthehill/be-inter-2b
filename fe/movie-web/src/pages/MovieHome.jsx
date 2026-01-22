import { useState } from 'react';
import './MovieHome.css';
import Poster1 from '../assets/acc.jpg'
import Poster2 from '../assets/ave-1.jpg'
import Poster3 from '../assets/avengers.jpg'
import Poster4 from '../assets/batman.jpg'
import Poster5 from '../assets/ing.jpg'
import Poster6 from '../assets/pulp-1.jpg'
import Poster7 from '../assets/rubysparks.jpg'
import Poster8 from '../assets/youuuu.jpeg'
import { useNavigate } from 'react-router-dom';

export default function MovieHome() {
  const navigate = useNavigate()
  const handleLogin = () =>{
    navigate('/watchlist')
  }


  const [movies] = useState([
    { id: 1, title: 'Spider-Man: Accross The Spider-Verse', poster: Poster1 },
    { id: 2, title: 'Avengers: Infinity War', poster: Poster2 },
    { id: 3, title: 'Avengers: Endgame', poster: Poster3 },
    { id: 4, title: 'The Batman', poster: Poster4 },
    { id: 5, title: 'Inglorious Basterds', poster: Poster5 },
    { id: 6, title: 'Pulp-Fiction', poster: Poster6 },
    { id: 7, title: 'Ruby Sparks', poster: Poster7 },
    { id: 8, title: 'You Are the Apple of My Eye', poster: Poster8 },
  ]);

  return (
    <div className="movie-container">
      <header className="movie-header">
        <h1 className="movie-header-title">Chill</h1>
        <button onClick={handleLogin} className='my-list'>WatchList</button>
      </header>

      <div className="movie-grid">
        {movies.map((movie) => (
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
        ))}
      </div>
    </div>
  );
}
