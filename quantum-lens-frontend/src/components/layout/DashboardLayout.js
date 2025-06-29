import React from 'react';
import { Box } from '@mui/material';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

const DashboardLayout = ({ isDarkMode, setIsDarkMode }) => {
  const location = useLocation();
  const isProjectChat = location.pathname.includes('/app/projects/');

  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh',
      bgcolor: isDarkMode ? '#1A202C' : '#FFFFFF',
      transition: 'background-color 0.3s ease'
    }}>
      <Sidebar isDarkMode={isDarkMode} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: isProjectChat ? 0 : 4,
          bgcolor: isDarkMode ? '#1A202C' : '#FFFFFF',
          color: isDarkMode ? '#F7FAFC' : '#2D3748',
          transition: 'all 0.3s ease'
        }}
      >
        <Outlet context={[isDarkMode, setIsDarkMode]} />
      </Box>
    </Box>
  );
};

export default DashboardLayout; 