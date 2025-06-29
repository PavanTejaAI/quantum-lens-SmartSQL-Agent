import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Button,
  MenuItem,
} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';

const pages = [
  { name: 'AI Features', href: '#features' },
  { name: 'API Docs', href: 'http://localhost:5000/docs', external: true },
  { name: 'GitHub', href: 'https://github.com/quantum-lens/quantum-lens-SmartSQL-Agent', external: true },
  { name: 'Quick Start', href: '#quickstart' }
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorElNav, setAnchorElNav] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleNavClick = (page) => {
    handleCloseNavMenu();
    if (page.external) {
      window.open(page.href, '_blank');
    } else if (page.href.startsWith('#')) {
      // Smooth scroll to section
      const element = document.querySelector(page.href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(page.href);
    }
  };

  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0px 4px 15px rgba(0, 0, 0, 0.05)',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            component="svg"
            viewBox="0 0 24 24"
            sx={{
              display: { xs: 'none', md: 'flex' },
              width: 32,
              height: 32,
              fill: '#FF6B6B',
              mr: 1,
              cursor: 'pointer',
            }}
            onClick={() => navigate('/')}
          >
            <path d="M12 0L14.5 9.5H24L16.5 15.5L19 24L12 18L5 24L7.5 15.5L0 9.5H9.5L12 0Z" />
          </Box>
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: '#2D3748',
              textDecoration: 'none',
            }}
          >
            QUANTUM LENS AI
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="menu"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              sx={{ color: '#2D3748' }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem 
                  key={page.name} 
                  onClick={() => handleNavClick(page)}
                  sx={{
                    color: '#2D3748',
                    '&:hover': {
                      background: 'rgba(255, 107, 107, 0.1)',
                    },
                  }}
                >
                  <Typography textAlign="center">{page.name}</Typography>
                </MenuItem>
              ))}
              {!isAuthPage && (
                <>
                  <MenuItem onClick={() => navigate('/login')}>
                    <Typography textAlign="center">Login</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => navigate('/register')}>
                    <Typography textAlign="center">Sign Up</Typography>
                  </MenuItem>
                </>
              )}
            </Menu>
          </Box>

          <Box
            component="svg"
            viewBox="0 0 24 24"
            sx={{
              display: { xs: 'flex', md: 'none' },
              width: 32,
              height: 32,
              fill: '#FF6B6B',
              mr: 1,
              cursor: 'pointer',
            }}
            onClick={() => navigate('/')}
          >
            <path d="M12 0L14.5 9.5H24L16.5 15.5L19 24L12 18L5 24L7.5 15.5L0 9.5H9.5L12 0Z" />
          </Box>
          <Typography
            variant="h5"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: '#2D3748',
              textDecoration: 'none',
            }}
          >
            QL AI
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                onClick={() => handleNavClick(page)}
                sx={{
                  my: 2,
                  mx: 2,
                  color: '#4A5568',
                  display: 'block',
                  fontWeight: 500,
                  '&:hover': {
                    color: '#FF6B6B',
                    backgroundColor: 'rgba(255, 107, 107, 0.05)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          {!isAuthPage && (
            <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' } }}>
              <Button
                component={Link}
                to="/login"
                sx={{
                  color: '#FF6B6B',
                  borderColor: '#FF6B6B',
                  mr: 2,
                  borderRadius: 2,
                  px: 3,
                  fontWeight: 500,
                  '&:hover': {
                    borderColor: '#FF5B5B',
                    backgroundColor: 'rgba(255, 107, 107, 0.05)',
                    transform: 'translateY(-2px)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/register"
                variant="contained"
                sx={{
                  background: 'linear-gradient(90deg, #FF6B6B 0%, #FF8E53 100%)',
                  color: '#fff',
                  borderRadius: 2,
                  px: 3,
                  fontWeight: 600,
                  '&:hover': {
                    background: 'linear-gradient(90deg, #FF5B5B 0%, #FF7E43 100%)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0px 4px 15px rgba(255, 107, 107, 0.3)',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                Start Building
              </Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 