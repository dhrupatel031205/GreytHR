import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from './contexts/AuthContext';
import { EmployeeProvider } from './contexts/EmployeeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Layout from './components/Layout/Layout';
import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import EmployeeManagement from './pages/Employee/EmployeeManagement';
import AttendanceTracking from './pages/Attendance/AttendanceTracking';
import LeaveManagement from './pages/Leave/LeaveManagement';
import PayrollSystem from './pages/Payroll/PayrollSystem';
import TaskManagement from './pages/Task/TaskManagement';
import Announcements from './pages/Announcements/Announcements';
import Reports from './pages/Reports/Reports';
import Chat from './pages/Chat/Chat';
import Onboarding from './pages/Onboarding/Onboarding';
import Profile from './pages/Profile/Profile';
import ProtectedRoute from './components/Auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <EmployeeProvider>
        <NotificationProvider>
          <Router>
            <div className="App">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  path="/*"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Routes>
                          <Route path="/" element={<Navigate to="/dashboard" replace />} />
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/employees" element={<EmployeeManagement />} />
                          <Route path="/attendance" element={<AttendanceTracking />} />
                          <Route path="/leaves" element={<LeaveManagement />} />
                          <Route path="/payroll" element={<PayrollSystem />} />
                          <Route path="/tasks" element={<TaskManagement />} />
                          <Route path="/announcements" element={<Announcements />} />
                          <Route path="/reports" element={<Reports />} />
                          <Route path="/chat" element={<Chat />} />
                          <Route path="/onboarding" element={<Onboarding />} />
                          <Route path="/profile" element={<Profile />} />
                        </Routes>
                      </Layout>
                    </ProtectedRoute>
                  }
                />
              </Routes>
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
              />
            </div>
          </Router>
        </NotificationProvider>
      </EmployeeProvider>
    </AuthProvider>
  );
}

export default App;