import React from 'react';
import { Box, Container, Typography, Button, Stack, Chip, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import SecurityIcon from '@mui/icons-material/Security';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import BoltIcon from '@mui/icons-material/Bolt';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #2D3748 0%, #1A202C 100%)',
        position: 'relative',
        overflow: 'hidden',
        pt: { xs: 4, md: 6 },
        pb: { xs: 3, md: 4 },
      }}
    >
      {/* Simple background gradient overlay */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle at 50% 50%, rgba(255, 107, 107, 0.15) 0%, rgba(255, 142, 83, 0) 70%)',
          zIndex: 1,
        }}
      />

      <Container sx={{ position: 'relative', zIndex: 3 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} lg={7}>
            <Stack spacing={4}>
              {/* Premium Badge */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Box sx={{ display: 'inline-block' }}>
                  <Chip
                    icon={<AutoAwesomeIcon sx={{ color: '#FF6B6B !important' }} />}
                    label="🚀 Next-Gen AI Database Intelligence"
                    sx={{
                      background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.15) 0%, rgba(255, 142, 83, 0.15) 100%)',
                      color: '#FF8E53',
                      border: '1px solid rgba(255, 107, 107, 0.3)',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      px: 1.5,
                      py: 2,
                      height: 'auto',
                      borderRadius: '50px',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 8px 32px rgba(255, 107, 107, 0.2)',
                      '& .MuiChip-label': {
                        px: 2,
                      },
                    }}
                  />
                </Box>
              </motion.div>

              {/* Hero Title */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <Box
                      component="svg"
                      viewBox="0 0 24 24"
                      sx={{
                        width: { xs: '45px', md: '55px' },
                        height: { xs: '45px', md: '55px' },
                        fill: 'url(#starGradient)',
                        filter: 'drop-shadow(0 8px 16px rgba(255, 107, 107, 0.4))',
                      }}
                    >
                      <defs>
                        <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#FF6B6B" />
                          <stop offset="100%" stopColor="#FF8E53" />
                        </linearGradient>
                      </defs>
                      <path d="M12 0L14.5 9.5H24L16.5 15.5L19 24L12 18L5 24L7.5 15.5L0 9.5H9.5L12 0Z" />
                    </Box>
                    <Typography
                      variant="h1"
                      sx={{
                        fontWeight: 900,
                        fontSize: { xs: '2.2rem', md: '3.2rem' },
                        background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 50%, #FBBF24 100%)',
                        backgroundClip: 'text',
                        textFillColor: 'transparent',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        lineHeight: 1,
                        letterSpacing: '-0.03em',
                        textShadow: '0 0 40px rgba(255, 107, 107, 0.3)',
                      }}
                    >
                      QUANTUM LENS
                    </Typography>
                  </Box>
                  
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 800,
                      fontSize: { xs: '1.8rem', md: '2.5rem' },
                      color: '#F1F5F9',
                      lineHeight: 1.1,
                      mb: 1,
                      textShadow: '0 4px 12px rgba(0, 0, 0, 0.6)',
                    }}
                  >
                    Transform Natural Language
                  </Typography>
                  
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 800,
                      fontSize: { xs: '1.8rem', md: '2.5rem' },
                      background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
                      backgroundClip: 'text',
                      textFillColor: 'transparent',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      lineHeight: 1.1,
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: -8,
                        left: 0,
                        width: '80px',
                        height: '3px',
                        background: 'linear-gradient(90deg, #FF6B6B 0%, #FF8E53 100%)',
                        borderRadius: '2px',
                        boxShadow: '0 4px 12px rgba(255, 107, 107, 0.4)',
                      },
                    }}
                  >
                    into Intelligent SQL
                  </Typography>
                </Box>
              </motion.div>

              {/* Description */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: { xs: '1.1rem', md: '1.25rem' },
                    color: '#CBD5E1',
                    lineHeight: 1.6,
                    fontWeight: 400,
                    maxWidth: '550px',
                    textShadow: '0 2px 4px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  Experience the{' '}
                  <Box component="span" sx={{ 
                    color: '#FF8E53', 
                    fontWeight: 700,
                    textShadow: '0 0 20px rgba(255, 142, 83, 0.5)',
                  }}>
                    future of database interaction
                  </Box>{' '}
                  with cutting-edge AI. Convert plain English into optimized SQL queries, 
                  unlock intelligent insights, and enjoy enterprise-grade security.
                </Typography>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<RocketLaunchIcon />}
                    onClick={() => navigate('/register')}
                    sx={{
                      background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
                      color: '#FFFFFF',
                      px: 5,
                      py: 2.5,
                      borderRadius: '50px',
                      fontSize: '1.1rem',
                      fontWeight: 700,
                      minWidth: '220px',
                      textTransform: 'none',
                      position: 'relative',
                      overflow: 'hidden',
                      boxShadow: '0 12px 40px rgba(255, 107, 107, 0.4)',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                        transition: 'left 0.6s',
                      },
                      '&:hover': {
                        background: 'linear-gradient(135deg, #FF5B5B 0%, #FF7E43 100%)',
                        transform: 'translateY(-4px) scale(1.02)',
                        boxShadow: '0 20px 60px rgba(255, 107, 107, 0.5)',
                        '&::before': {
                          left: '100%',
                        },
                      },
                      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    }}
                  >
                    Start Building Now
                  </Button>
                  
                  <Button
                    variant="outlined"
                    size="large"
                    startIcon={<BoltIcon />}
                    onClick={() => navigate('/login')}
                    sx={{
                      borderColor: '#FF6B6B',
                      color: '#FF6B6B',
                      px: 5,
                      py: 2.5,
                      borderRadius: '50px',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      minWidth: '220px',
                      borderWidth: '2px',
                      textTransform: 'none',
                      background: 'rgba(45, 55, 72, 0.8)',
                      backdropFilter: 'blur(10px)',
                      '&:hover': {
                        borderColor: '#FF8E53',
                        color: '#FF8E53',
                        backgroundColor: 'rgba(255, 107, 107, 0.1)',
                        transform: 'translateY(-4px) scale(1.02)',
                        borderWidth: '2px',
                        boxShadow: '0 12px 40px rgba(255, 107, 107, 0.3)',
                      },
                      transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    }}
                  >
                    Try Live Demo
                  </Button>
                </Stack>
              </motion.div>
            </Stack>
          </Grid>

          {/* Feature Cards Column */}
          <Grid item xs={12} lg={5}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.8 }}
            >
              <Stack spacing={2.5}>
                {/* Feature Card 1 */}
                <Box
                  sx={{
                    p: 3,
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, rgba(72, 187, 120, 0.1) 0%, rgba(72, 187, 120, 0.05) 100%)',
                    border: '1px solid rgba(72, 187, 120, 0.2)',
                    backdropFilter: 'blur(20px)',
                    position: 'relative',
                    overflow: 'hidden',
                    transition: 'all 0.4s ease',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: '0 16px 48px rgba(72, 187, 120, 0.2)',
                      border: '1px solid rgba(72, 187, 120, 0.4)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                    <Box
                      sx={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #48BB78 0%, #38A169 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 6px 20px rgba(72, 187, 120, 0.3)',
                      }}
                    >
                      <AutoAwesomeIcon sx={{ color: '#FFFFFF', fontSize: '22px' }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ color: '#F1F5F9', fontWeight: 700, mb: 0.5, fontSize: '1.1rem' }}>
                        Natural Language → SQL
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#94A3B8', lineHeight: 1.5, fontSize: '0.9rem' }}>
                        Transform plain English questions into optimized, production-ready SQL queries instantly
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Feature Card 2 */}
                <Box
                  sx={{
                    p: 3,
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, rgba(66, 153, 225, 0.1) 0%, rgba(66, 153, 225, 0.05) 100%)',
                    border: '1px solid rgba(66, 153, 225, 0.2)',
                    backdropFilter: 'blur(20px)',
                    transition: 'all 0.4s ease',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: '0 16px 48px rgba(66, 153, 225, 0.2)',
                      border: '1px solid rgba(66, 153, 225, 0.4)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                    <Box
                      sx={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #4299E1 0%, #3182CE 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 6px 20px rgba(66, 153, 225, 0.3)',
                      }}
                    >
                      <TrendingUpIcon sx={{ color: '#FFFFFF', fontSize: '22px' }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ color: '#F1F5F9', fontWeight: 700, mb: 0.5, fontSize: '1.1rem' }}>
                        Multi-Database Intelligence
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#94A3B8', lineHeight: 1.5, fontSize: '0.9rem' }}>
                        Seamlessly connect and query across multiple database systems with unified AI intelligence
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Feature Card 3 */}
                <Box
                  sx={{
                    p: 3,
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, rgba(245, 101, 101, 0.1) 0%, rgba(245, 101, 101, 0.05) 100%)',
                    border: '1px solid rgba(245, 101, 101, 0.2)',
                    backdropFilter: 'blur(20px)',
                    transition: 'all 0.4s ease',
                    '&:hover': {
                      transform: 'translateY(-6px)',
                      boxShadow: '0 16px 48px rgba(245, 101, 101, 0.2)',
                      border: '1px solid rgba(245, 101, 101, 0.4)',
                    },
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
                    <Box
                      sx={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #F56565 0%, #E53E3E 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 6px 20px rgba(245, 101, 101, 0.3)',
                      }}
                    >
                      <SecurityIcon sx={{ color: '#FFFFFF', fontSize: '22px' }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ color: '#F1F5F9', fontWeight: 700, mb: 0.5, fontSize: '1.1rem' }}>
                        Enterprise Security
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#94A3B8', lineHeight: 1.5, fontSize: '0.9rem' }}>
                        Bank-grade security with JWT authentication, encrypted storage, and comprehensive audit trails
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Stack>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Hero; 