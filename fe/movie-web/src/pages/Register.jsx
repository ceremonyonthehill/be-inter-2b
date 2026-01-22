import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../services/api';
import './Register.css';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await authAPI.register(formData); // kirim ke backend
      alert('Registration successful! Please login.');
      navigate('/login'); // redirect ke login page
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h1 className="register-title">Create Account</h1>

        <form onSubmit={handleRegister} className="register-form">
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <button type="submit" className="register-button">
            Register
          </button>

          {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        </form>

        <p className="register-link">
          Already have an account? <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
}

