import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import DashboardLayout from './components/layout/DashboardLayout';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import CreateProject from './components/projects/CreateProject';
import ProjectChat from './pages/ProjectChat';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import './App.css';

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);

  const theme = createTheme({
    palette: {
      mode: isDarkMode ? 'dark' : 'light',
      primary: {
        main: '#FF6B6B',
        light: '#FF8E53',
        dark: '#FF5B5B',
      },
      background: {
        default: isDarkMode ? '#1A202C' : '#ffffff',
        paper: isDarkMode ? '#2D3748' : '#f7fafc',
      },
      text: {
        primary: isDarkMode ? '#F7FAFC' : '#2D3748',
        secondary: isDarkMode ? '#A0AEC0' : '#4A5568',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: 8,
          },
        },
      },
    },
  });

  const LandingPage = () => (
    <>
      <Navbar isDarkMode={isDarkMode} />
      <Hero />
      <Features />
    </>
  );

  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Dashboard Routes */}
            <Route 
              path="/app" 
              element={
                <ProtectedRoute>
                  <DashboardLayout isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/app/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard setIsDarkMode={setIsDarkMode} />} />
              <Route path="profile" element={<Profile />} />
              <Route path="projects/create" element={<CreateProject />} />
              <Route path="projects/:projectId" element={<ProjectChat />} />
            </Route>

            {/* Fallback redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
