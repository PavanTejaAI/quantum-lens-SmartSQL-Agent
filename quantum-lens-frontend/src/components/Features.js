import React from 'react';
import { Box, Container, Grid, Typography, Paper } from '@mui/material';
import { motion } from 'framer-motion';
import ChatIcon from '@mui/icons-material/Chat';
import PsychologyIcon from '@mui/icons-material/Psychology';
import SecurityIcon from '@mui/icons-material/Security';
import DeveloperModeIcon from '@mui/icons-material/DeveloperMode';

const FeatureCard = ({ icon, title, description, highlights, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      viewport={{ once: true }}
    >
      <Paper
        elevation={4}
        sx={{
          p: { xs: 3, md: 4 },
          height: '100%',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 250, 251, 0.95) 100%)',
          borderRadius: 3,
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <Box 
          sx={{ 
            mb: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 64,
            height: 64,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
            color: 'white',
          }}
        >
          {React.cloneElement(icon, { sx: { fontSize: 32 } })}
        </Box>
        <Typography 
          variant="h5" 
          component="h3" 
          gutterBottom 
          sx={{ 
            color: '#2D3748',
            fontWeight: 700,
            mb: 2,
            fontSize: { xs: '1.25rem', md: '1.5rem' },
          }}
        >
          {title}
        </Typography>
        <Typography 
          variant="body1" 
          sx={{
            color: '#4A5568',
            lineHeight: 1.7,
            fontSize: { xs: '0.9rem', md: '1rem' },
            mb: 2,
          }}
        >
          {description}
        </Typography>
        <Box>
          {highlights.map((highlight, index) => (
            <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Box
                sx={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: '#FF6B6B',
                  mr: 2,
                  flexShrink: 0,
                }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: '#718096',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                }}
              >
                {highlight}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>
    </motion.div>
  );
};

const Features = () => {
  const features = [
    {
      icon: <ChatIcon />,
      title: 'Conversational Database Interface',
      description: 'Transform your database interactions with natural language processing. Ask questions in plain English and get intelligent SQL queries with real-time execution and performance metrics.',
      highlights: [
        'Natural Language to SQL conversion',
        'Context-aware conversations',
        'Multi-database project support',
        'Real-time query execution'
      ]
    },
    {
      icon: <PsychologyIcon />,
      title: 'AI-Powered Intelligence',
      description: 'Leverage advanced AI algorithms that understand your database schema, optimize queries, and provide intelligent suggestions for improved performance and error recovery.',
      highlights: [
        'Smart schema understanding',
        'Query optimization suggestions',
        'Intelligent error analysis',
        'Adaptive learning system'
      ]
    },
    {
      icon: <SecurityIcon />,
      title: 'Enterprise-Grade Security',
      description: 'Built with enterprise security standards including multi-tenant architecture, JWT authentication, encrypted data storage, and comprehensive audit logging.',
      highlights: [
        'Multi-tenant architecture',
        'JWT token authentication',
        'Encrypted credential storage',
        'Comprehensive audit trails'
      ]
    },
    {
      icon: <DeveloperModeIcon />,
      title: 'Modern Technology Stack',
      description: 'Powered by cutting-edge technologies including FastAPI backend, React frontend, OpenRouter AI integration, and MySQL with advanced connection pooling.',
      highlights: [
        'FastAPI with async/await',
        'React + Material-UI frontend',
        'OpenRouter AI compatibility',
        'Real-time WebSocket support'
      ]
    },
  ];

  return (
    <Box
      component="section"
      sx={{
        py: { xs: 8, md: 12 },
        background: 'linear-gradient(180deg, #f8fafc 0%, #edf2f7 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h2"
            align="center"
            gutterBottom
            sx={{
              fontWeight: 800,
              fontSize: { xs: '2.25rem', md: '3.5rem' },
              color: '#1A202C',
              mb: { xs: 2, md: 3 },
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -16,
                left: '50%',
                transform: 'translateX(-50%)',
                width: 80,
                height: 4,
                borderRadius: 2,
                background: 'linear-gradient(90deg, #FF6B6B 0%, #FF8E53 100%)',
              }
            }}
          >
            Powerful AI Features
          </Typography>
          <Typography
            variant="h6"
            align="center"
            sx={{
              color: '#4A5568',
              maxWidth: '800px',
              mx: 'auto',
              mb: { xs: 6, md: 8 },
              fontSize: { xs: '1rem', md: '1.25rem' },
              lineHeight: 1.8,
            }}
          >
            Experience next-generation database automation with AI-powered natural language processing, 
            intelligent optimization, and enterprise-grade security
          </Typography>
        </motion.div>

        <Grid container spacing={{ xs: 4, md: 6 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={6} key={index}>
              <FeatureCard {...feature} delay={index * 0.2} />
            </Grid>
          ))}
        </Grid>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          viewport={{ once: true }}
        >
          <Box
            sx={{
              mt: { xs: 6, md: 8 },
              p: { xs: 3, md: 4 },
              background: 'linear-gradient(135deg, rgba(255, 107, 107, 0.05) 0%, rgba(255, 142, 83, 0.05) 100%)',
              borderRadius: 3,
              border: '1px solid rgba(255, 107, 107, 0.1)',
              textAlign: 'center',
            }}
          >
            <Typography
              variant="h5"
              sx={{
                color: '#2D3748',
                fontWeight: 700,
                mb: 2,
              }}
            >
              Ready to Transform Your Database Experience?
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: '#4A5568',
                mb: 3,
                maxWidth: '600px',
                mx: 'auto',
                lineHeight: 1.7,
              }}
            >
              Join thousands of developers who are already using AI to automate their database operations. 
              Start building smarter applications with natural language database queries today.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, flexWrap: 'wrap' }}>
              <Typography variant="body2" sx={{ color: '#718096', display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#48BB78' }} />
                Multiple LLM Support
              </Typography>
              <Typography variant="body2" sx={{ color: '#718096', display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#48BB78' }} />
                Real-time Performance
              </Typography>
              <Typography variant="body2" sx={{ color: '#718096', display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box sx={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#48BB78' }} />
                Enterprise Security
              </Typography>
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Features; 