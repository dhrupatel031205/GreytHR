import React from 'react';
import { useNavigate } from 'react-router-dom';
import './welcome.css';

export default function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="welcome-container d-flex flex-column align-items-center justify-content-center text-white text-center">
      <h1 className="display-4 mb-3 fw-bold">Welcome to <span className="text-primary">greytLite</span></h1>
      <p className="lead mb-4">Streamlined onboarding and HR automation, built for modern teams.</p>
      <button className="btn btn-light btn-lg px-5 py-2" onClick={() => navigate('/login')}>
        Login to Continue
      </button>
    </div>
  );
}
