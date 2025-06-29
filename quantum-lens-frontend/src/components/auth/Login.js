import React, { useState, useMemo } from 'react';
import { Box, Container, TextField, Button, Typography, Paper, InputAdornment, IconButton, Grid, Alert } from '@mui/material';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Visibility, VisibilityOff, Email, Lock } from '@mui/icons-material';
import { login } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../common/LoadingSpinner';

const Login = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setErrors({
        submit: 'Please fill in all fields'
      });
      return;
    }
    
    try {
      setLoading(true);
      const response = await login(formData);
      if (response && response.token) {
        setUser(response);
        navigate('/app/dashboard');
      } else {
        setErrors({ submit: 'Invalid response from server' });
      }
    } catch (error) {
      let errorMessage = 'Login failed';
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error.response?.data) {
        const data = error.response.data;
        if (typeof data === 'string') {
          errorMessage = data;
        } else if (typeof data.detail === 'string') {
          errorMessage = data.detail;
        } else if (data.msg) {
          errorMessage = data.msg;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const pulseVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: [1, 1.2, 1],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 2,
        repeat: Infinity,
      }
    }
  };

  const pathVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 2,
        ease: "easeInOut",
      }
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%)',
        }}
      >
        <LoadingSpinner message="Authenticating..." />
      </Box>
    );
  }

  return (
    <Box
      component="main"
      sx={{
        minHeight: '100vh',
        display: 'flex',
        background: 'linear-gradient(135deg, #f8fafc 0%, #edf2f7 100%)',
      }}
    >
      <Grid container>
        <Grid 
          item 
          xs={12} 
          md={6} 
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #2D3748 0%, #1A202C 100%)',
            position: 'relative',
            overflow: 'hidden',
            p: 4,
          }}
        >
          <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
            <motion.svg
              viewBox="0 0 400 400"
              style={{
                width: '100%',
                height: '100%',
                maxWidth: '500px',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              {/* Neural Network Animation */}
              <motion.path
                d="M200 100 Q 100 100 100 200 Q 100 300 200 300 Q 300 300 300 200 Q 300 100 200 100"
                fill="none"
                stroke="#FF6B6B"
                strokeWidth="4"
                initial="hidden"
                animate="visible"
                variants={pathVariants}
              />
              {[...Array(8)].map((_, i) => {
                const angle = (i * Math.PI * 2) / 8;
                const x = 200 + Math.cos(angle) * 80;
                const y = 200 + Math.sin(angle) * 80;
                return (
                  <motion.circle
                    key={`pulse-${i}`}
                    cx={x}
                    cy={y}
                    r="15"
                    fill="#FF8E53"
                    initial="hidden"
                    animate="visible"
                    variants={pulseVariants}
                    transition={{ delay: i * 0.2 }}
                  />
                );
              })}
              <motion.circle
                cx="200"
                cy="200"
                r="30"
                fill="#FF6B6B"
                initial="hidden"
                animate="visible"
                variants={pulseVariants}
              />
            </motion.svg>
            <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center', mt: 4 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.5 }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    color: '#fff',
                    fontWeight: 700,
                    mb: 2,
                  }}
                >
                  Welcome Back
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    color: '#A0AEC0',
                    maxWidth: '400px',
                    mx: 'auto',
                  }}
                >
                  Access your AI-powered SQL optimization tools and continue enhancing your database performance
                </Typography>
              </motion.div>
            </Box>
          </Box>
        </Grid>

        <Grid 
          item 
          xs={12} 
          md={6} 
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4,
          }}
        >
          <Container maxWidth="sm">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Paper
                elevation={4}
                sx={{
                  p: { xs: 4, md: 5 },
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 250, 251, 0.95) 100%)',
                }}
              >
                <Typography
                  variant="h4"
                  align="center"
                  sx={{
                    mb: 4,
                    fontWeight: 800,
                    background: 'linear-gradient(90deg, #FF6B6B 0%, #FF8E53 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Sign In
                </Typography>

                <form onSubmit={handleSubmit}>
                  {errors.submit && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                      {errors.submit}
                    </Alert>
                  )}
                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    sx={{ 
                      mb: 3,
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(74, 85, 104, 0.3)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 107, 107, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#FF6B6B',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#4A5568',
                        '&.Mui-focused': {
                          color: '#FF6B6B',
                        },
                      },
                      '& .MuiOutlinedInput-input': {
                        color: '#2D3748',
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Email sx={{ color: '#4A5568' }} />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <TextField
                    fullWidth
                    variant="outlined"
                    label="Password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    error={!!errors.password}
                    helperText={errors.password}
                    sx={{ 
                      mb: 4,
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                          borderColor: 'rgba(74, 85, 104, 0.3)',
                        },
                        '&:hover fieldset': {
                          borderColor: 'rgba(255, 107, 107, 0.5)',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#FF6B6B',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: '#4A5568',
                        '&.Mui-focused': {
                          color: '#FF6B6B',
                        },
                      },
                      '& .MuiOutlinedInput-input': {
                        color: '#2D3748',
                      },
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Lock sx={{ color: '#4A5568' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            sx={{ color: '#4A5568' }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      background: 'linear-gradient(90deg, #FF6B6B 0%, #FF8E53 100%)',
                      '&:hover': {
                        background: 'linear-gradient(90deg, #FF5B5B 0%, #FF7E43 100%)',
                      },
                    }}
                  >
                    Sign In
                  </Button>

                  <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Typography variant="body1" color="#4A5568">
                      Don't have an account?{' '}
                      <Link
                        to="/register"
                        style={{
                          color: '#FF6B6B',
                          textDecoration: 'none',
                          fontWeight: 600,
                        }}
                      >
                        Sign Up
                      </Link>
                    </Typography>
                  </Box>
                </form>
              </Paper>
            </motion.div>
          </Container>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login; 