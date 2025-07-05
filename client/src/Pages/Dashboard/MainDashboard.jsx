import React from 'react';

export default function MainDashboard() {
  const user = { name: 'John Doe', role: 'employee' }; // You can replace this with decoded JWT later

  return (
    <div className="container mt-5">
      <div className="p-4 bg-white shadow rounded">
        <h2>👤 Welcome, {user.name}</h2>
        <p>Your role: <strong>{user.role}</strong></p>
        <p>This is your greytLite dashboard. Use the sidebar (coming soon) to manage features.</p>
      </div>
    </div>
  );
}
