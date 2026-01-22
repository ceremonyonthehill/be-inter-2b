import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await authAPI.login({ email, password });
      // simpan token di localStorage
      localStorage.setItem('token', res.data.token);
      navigate('/movies'); // redirect ke movies
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h1 className="login-title">Chill Streaming</h1>

       <form onSubmit={handleLogin} className="login-form">
  <div className="form-group">
    <label className="form-label">Email</label>
    <input
      type="email"
      className="form-input"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
    />
  </div>

  <div className="form-group">
    <label className="form-label">Password</label>
    <input
      type="password"
      className="form-input"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />
  </div>

  <button type="submit" className="login-button">
    Login
  </button>
</form>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <p className="login-link">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}


