import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Index';
import Register from './pages/Register';
import MovieHome from './pages/MovieHome';
import Watchlist from './pages/Watchlist';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/movies" element={<MovieHome />} />
        <Route path="/watchlist" element={<Watchlist/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
