// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Welcome from './Pages/Welcome';
import Login from './Pages/Login';
import MainDashboard from './Pages/Dashboard/MainDashboard';
import OnboardingWizard from './Pages/Onboarding/OnboardingWizard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<MainDashboard />} />
        <Route path="/onboarding" element={<OnboardingWizard />} />
        {/* No public signup route */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
