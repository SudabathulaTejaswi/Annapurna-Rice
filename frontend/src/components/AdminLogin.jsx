// src/components/AdminLogin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import baseUrl from '../../config';
import adminImg from '../assets/admin.jpg';
import { BiShow, BiHide } from 'react-icons/bi'; // 👁️ Password toggle icons

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${baseUrl}api/admin/login`, {
        username,
        password,
      });
      localStorage.setItem('adminToken', res.data.token);
      navigate('/admin/dashboard');
    } catch (err) {
      console.error("Login error:", err);
      alert('Invalid admin credentials. Please check your username and password.');
    }
  };

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#f5f5f5',
  };

  const cardStyle = {
    background: '#fff',
    borderRadius: '12px',
    padding: '40px',
    width: '100%',
    maxWidth: '400px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    textAlign: 'center',
  };

  const imageStyle = {
    width: '180px',
    height: '180px',
    borderRadius: '50%',
    objectFit: 'cover',
    marginBottom: '20px',
    border: '2px solid #007bff',
  };

  const titleStyle = {
    fontWeight: '700',
    marginBottom: '20px',
    color: '#333',
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <img src={adminImg} alt="Admin Profile" style={imageStyle} />
        <h2 style={titleStyle}>Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Admin Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-3" style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              className="form-control form-control-lg"
              placeholder="Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                top: '50%',
                right: '15px',
                transform: 'translateY(-50%)',
                cursor: 'pointer',
                fontSize: '1.25rem',
                color: '#555',
              }}
            >
              {showPassword ? <BiHide /> : <BiShow />}
            </span>
          </div>

          <button type="submit" className="btn btn-primary w-100 btn-lg">
            Login as Admin
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
