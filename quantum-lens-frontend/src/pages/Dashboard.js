import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  IconButton, 
  Button, 
  Grid, 
  Card,
  CardContent,
  CardActionArea,
  Chip,
  Stack,
  Tooltip,
  useTheme,
  Avatar,
  Divider,
  LinearProgress,
  Paper,
  Container,
  Badge,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { 
  LightMode, 
  DarkMode, 
  Add as AddIcon,
  AccessTime as AccessTimeIcon,
  FolderOutlined as FolderIcon,
  ArrowForward as ArrowForwardIcon,
  Analytics as AnalyticsIcon,
  Storage as StorageIcon,
  Code as CodeIcon,
  Bolt as BoltIcon,
  TrendingUp as TrendingUpIcon,
  Speed as SpeedIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  Person as PersonIcon,
  Search as SearchIcon,
  FilterList as FilterListIcon,
  MoreVert as MoreVertIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { deleteProject, getProjects } from '../services/projectService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import DatabaseInfoDialog from '../components/common/DatabaseInfoDialog';

const Dashboard = ({ setIsDarkMode }) => {
  const { user } = useAuth();
  const [isDarkMode] = useOutletContext();
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [dbInfoDialogOpen, setDbInfoDialogOpen] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await getProjects();
      
      const processedProjects = data.map(project => {
        try {
          const storedData = localStorage.getItem(`project_${project.id}`);
          if (storedData) {
            const localProject = JSON.parse(atob(storedData));
            return {
              ...project,
              ...localProject,
              dbConfig: localProject.dbConfig || {}
            };
          }
          
          const projectData = {
            id: project.id,
            name: project.name,
            description: project.description,
            created_at: project.created_at,
            dbConfig: project.dbConfig || {}
          };
          localStorage.setItem(`project_${project.id}`, btoa(JSON.stringify(projectData)));
          return projectData;
        } catch (error) {
          console.error(`Failed to process project ${project.id}:`, error);
          return project;
        }
      });

      setProjects(processedProjects);
      
      localStorage.setItem('projects', JSON.stringify(processedProjects));
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectClick = (project) => {
    try {
      if (!localStorage.getItem(`project_${project.id}`)) {
        const projectData = {
          id: project.id,
          name: project.name,
          description: project.description,
          created_at: project.created_at,
          dbConfig: project.dbConfig || {}
        };
        localStorage.setItem(`project_${project.id}`, btoa(JSON.stringify(projectData)));
        
        // Update projects list in localStorage
        const existingProjects = JSON.parse(localStorage.getItem('projects') || '[]');
        const projectExists = existingProjects.some(p => p.id === project.id);
        if (!projectExists) {
          localStorage.setItem('projects', JSON.stringify([...existingProjects, projectData]));
        }
      }
      navigate(`/app/projects/${project.id}`);
    } catch (error) {
      console.error('Failed to process project data:', error);
      navigate(`/app/projects/${project.id}`);
    }
  };

  const handleMenuOpen = (event, project) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
    setSelectedProject(project);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedProject(null);
  };

  const handleDeleteProject = async () => {
    try {
      await deleteProject(selectedProject.id);
      setProjects(projects.filter(p => p.id !== selectedProject.id));
      handleMenuClose();
    } catch (error) {
      console.error('Failed to delete project:', error);
    }
  };

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const features = [
    {
      icon: <StorageIcon sx={{ fontSize: 36 }} />,
      title: 'SQL Database',
      description: 'Connect to any SQL database and start analyzing',
      gradient: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
      stats: '99.9% Uptime',
      trend: '+2.3%'
    },
    {
      icon: <BoltIcon sx={{ fontSize: 36 }} />,
      title: 'AI-Powered',
      description: 'Natural language to SQL conversion',
      gradient: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
      stats: '450ms Latency',
      trend: '-15ms'
    },
    {
      icon: <AnalyticsIcon sx={{ fontSize: 36 }} />,
      title: 'Smart Analytics',
      description: 'Get instant insights from your data',
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
      stats: '2.5M Queries',
      trend: '+12.8%'
    },
    {
      icon: <CodeIcon sx={{ fontSize: 36 }} />,
      title: 'Advanced SQL',
      description: 'Write and execute complex queries',
      gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
      stats: '98% Success Rate',
      trend: '+1.2%'
    }
  ];

  const handleDbInfoClick = (event, project) => {
    event.stopPropagation();
    setSelectedProject(project);
    setDbInfoDialogOpen(true);
  };

  return (
    <Container maxWidth={false} disableGutters>
      {/* Top Navigation Bar */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1100,
          backdropFilter: 'blur(20px)',
          bgcolor: isDarkMode ? 'rgba(26, 32, 44, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          borderBottom: '1px solid',
          borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          px: 4,
          py: 2
        }}
      >
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          maxWidth: 1400,
          mx: 'auto'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 700,
                background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              QuantumLens
            </Typography>
            
            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
              borderRadius: 2,
              p: 1,
              width: 300
            }}>
              <SearchIcon sx={{ color: isDarkMode ? '#A0AEC0' : '#718096' }} />
              <input
                placeholder="Search projects..."
                style={{
                  border: 'none',
                  background: 'none',
                  outline: 'none',
                  color: isDarkMode ? '#F7FAFC' : '#2D3748',
                  width: '100%',
                  fontSize: '0.9rem'
                }}
              />
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton 
              sx={{ 
                color: isDarkMode ? '#A0AEC0' : '#718096',
                '&:hover': { color: '#FF6B6B' }
              }}
            >
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>

        <IconButton 
          onClick={toggleTheme}
          sx={{
                color: isDarkMode ? '#A0AEC0' : '#718096',
                '&:hover': { color: '#FF6B6B' }
          }}
        >
          {isDarkMode ? <LightMode /> : <DarkMode />}
        </IconButton>

            <Divider orientation="vertical" flexItem sx={{ borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }} />

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                onClick={handleMenuOpen}
                sx={{
                  cursor: 'pointer',
                  width: 40,
                  height: 40,
                  background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
                  boxShadow: '0 4px 12px rgba(255, 107, 107, 0.2)',
                  '&:hover': { transform: 'scale(1.05)' }
                }}
              >
                {user?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
              </Avatar>
              <Menu
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={handleMenuClose}
                onClick={(e) => e.stopPropagation()}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    overflow: 'visible',
                    mt: 1.5,
                    '& .MuiMenuItem-root': {
                      px: 2,
                      py: 1,
                      borderRadius: 1,
                      '&:hover': {
                        backgroundColor: theme => theme.palette.action.hover
                      }
                    }
                  }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={handleMenuClose}>
                  <ListItemIcon>
                    <PersonIcon fontSize="small" sx={{ color: '#FF6B6B' }} />
                  </ListItemIcon>
                  <ListItemText>Profile</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleMenuClose}>
                  <ListItemIcon>
                    <SettingsIcon fontSize="small" sx={{ color: '#FF6B6B' }} />
                  </ListItemIcon>
                  <ListItemText>Settings</ListItemText>
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleMenuClose}>
                  <ListItemIcon>
                    <HelpIcon fontSize="small" sx={{ color: '#FF6B6B' }} />
                  </ListItemIcon>
                  <ListItemText>Help & Support</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleDeleteProject}>
                  <ListItemIcon>
                    <DeleteIcon fontSize="small" sx={{ color: '#FF6B6B' }} />
                  </ListItemIcon>
                  <ListItemText primary="Delete Project" />
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Box 
        sx={{ 
          maxWidth: 1400, 
          mx: 'auto',
          px: 4,
          py: 6
        }}
      >
        {/* Welcome Section */}
      <Box 
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{
          mb: 6,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-start', md: 'center' },
          justifyContent: 'space-between',
          gap: 3
        }}
      >
            <Box>
              <Typography 
                variant="h3" 
                sx={{
                  fontWeight: 700,
                  color: isDarkMode ? '#F7FAFC' : '#2D3748',
                  fontSize: { xs: '2rem', md: '2.5rem' },
                mb: 2,
                lineHeight: 1.2
                }}
              >
              {getTimeOfDay()}, {user?.name?.split(' ')[0] || 'User'} 👋
              </Typography>
              <Typography 
              variant="body1"
                sx={{
                color: isDarkMode ? '#A0AEC0' : '#718096',
                fontSize: '1.1rem',
                maxWidth: 600,
                lineHeight: 1.6
              }}
            >
              Welcome to your AI-powered SQL workspace. Let's analyze your data and uncover valuable insights together.
              </Typography>
        </Box>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              sx={{
                color: isDarkMode ? '#A0AEC0' : '#718096',
                borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  borderColor: '#FF6B6B',
                  color: '#FF6B6B',
                  bgcolor: 'transparent'
                }
              }}
            >
              Filters
            </Button>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/app/projects/create')}
          sx={{
            background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
            color: '#fff',
            px: 4,
            '&:hover': {
              background: 'linear-gradient(135deg, #FF5B5B 0%, #FF7E43 100%)',
            }
          }}
        >
              New Project
        </Button>
      </Box>
        </Box>

        {/* Stats Overview */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {[
            { 
              title: 'Active Projects',
              value: projects.length,
              trend: '+12.5%',
              icon: <FolderIcon sx={{ fontSize: 24 }} />,
              color: '#3B82F6'
            },
            {
              title: 'Queries Today',
              value: '2,847',
              trend: '+8.2%',
              icon: <BoltIcon sx={{ fontSize: 24 }} />,
              color: '#10B981'
            },
            {
              title: 'Data Processed',
              value: '1.2 TB',
              trend: '+15.3%',
              icon: <StorageIcon sx={{ fontSize: 24 }} />,
              color: '#8B5CF6'
            },
            {
              title: 'Response Time',
              value: '124ms',
              trend: '-5.1%',
              icon: <SpeedIcon sx={{ fontSize: 24 }} />,
              color: '#F59E0B'
            }
          ].map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: '100%',
                  bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.03)' : '#FFFFFF',
                  border: '1px solid',
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                    borderColor: stat.color
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: stat.color,
                      bgcolor: `${stat.color}15`
                    }}
                  >
                    {stat.icon}
                  </Box>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{
                        color: isDarkMode ? '#A0AEC0' : '#718096',
                        fontWeight: 500,
                        mb: 0.5
                      }}
                    >
                      {stat.title}
                    </Typography>
                    <Typography
                      variant="h4"
                      sx={{
                        fontWeight: 700,
                        color: isDarkMode ? '#F7FAFC' : '#2D3748'
                      }}
                    >
                      {stat.value}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUpIcon 
                    sx={{ 
                      fontSize: 16,
                      color: stat.trend.startsWith('+') ? '#10B981' : '#EF4444'
                    }} 
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      color: stat.trend.startsWith('+') ? '#10B981' : '#EF4444',
                      fontWeight: 600
                    }}
                  >
                    {stat.trend}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: isDarkMode ? '#A0AEC0' : '#718096',
                      ml: 1
                    }}
                  >
                    vs last week
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Features Section */}
        <Box sx={{ mb: 8 }}>
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: 700,
              color: isDarkMode ? '#F7FAFC' : '#2D3748',
              mb: 4
            }}
          >
            AI Features
          </Typography>
          <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
                <Paper
              component={motion.div}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
                  elevation={0}
              sx={{
                height: '100%',
                    bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.03)' : '#FFFFFF',
                borderRadius: 3,
                p: 3,
                border: '1px solid',
                borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: isDarkMode ? '0 12px 40px rgba(0, 0, 0, 0.5)' : '0 12px 40px rgba(0, 0, 0, 0.1)',
                      '& .feature-icon': {
                        transform: 'scale(1.1) rotate(5deg)',
                      }
                    }
                  }}
                >
                  <Box 
                    className="feature-icon"
                    sx={{ 
                      background: feature.gradient,
                      mb: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 56,
                height: 56,
                borderRadius: 2,
                      color: 'white',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                {feature.icon}
              </Box>
              <Typography 
                variant="h6" 
                sx={{ 
                      fontWeight: 700,
                  mb: 1,
                  color: isDarkMode ? '#F7FAFC' : '#2D3748'
                }}
              >
                {feature.title}
              </Typography>
              <Typography 
                variant="body2"
                sx={{ 
                      color: isDarkMode ? '#A0AEC0' : '#718096',
                      mb: 2,
                  lineHeight: 1.6
                }}
              >
                {feature.description}
              </Typography>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between'
                  }}>
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: isDarkMode ? '#A0AEC0' : '#718096',
                        fontWeight: 500
                      }}
                    >
                      {feature.stats}
                    </Typography>
                    <Chip
                      size="small"
                      label={feature.trend}
                      sx={{
                        bgcolor: feature.trend.startsWith('-') ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: feature.trend.startsWith('-') ? '#10B981' : '#EF4444',
                        fontWeight: 600
                      }}
                    />
                  </Box>
                </Paper>
          </Grid>
        ))}
      </Grid>
        </Box>

        {/* Projects Section */}
        <Box>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          mb: 4
        }}>
          <Typography 
              variant="h5" 
            sx={{ 
              fontWeight: 700,
                color: isDarkMode ? '#F7FAFC' : '#2D3748'
            }}
          >
            Your Projects
          </Typography>
          
          <Button
              variant="text"
              endIcon={<ArrowForwardIcon />}
            sx={{
              color: '#FF6B6B',
              '&:hover': {
                  bgcolor: 'transparent',
                  color: '#FF5B5B',
                  '& .MuiSvgIcon-root': {
                    transform: 'translateX(4px)'
                  }
                },
                '& .MuiSvgIcon-root': {
                  transition: 'transform 0.2s ease'
                }
              }}
            >
              View All Projects
          </Button>
        </Box>

        <Grid container spacing={3}>
          {projects.length === 0 ? (
            <Grid item xs={12}>
                <Paper
                  elevation={0}
                sx={{
                    bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)',
                  borderRadius: 3,
                  border: '2px dashed',
                  borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                    p: 8,
                  textAlign: 'center'
                }}
              >
                <Box
                  sx={{
                      width: 96,
                      height: 96,
                    borderRadius: '50%',
                    bgcolor: isDarkMode ? 'rgba(255, 107, 107, 0.1)' : 'rgba(255, 107, 107, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto',
                      mb: 4
                  }}
                >
                    <FolderIcon sx={{ fontSize: 48, color: '#FF6B6B' }} />
                </Box>
                <Typography
                    variant="h4"
                  sx={{
                    color: isDarkMode ? '#F7FAFC' : '#2D3748',
                    mb: 2,
                      fontWeight: 700
                  }}
                >
                  No projects yet
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: isDarkMode ? '#A0AEC0' : '#718096',
                    mb: 4,
                      maxWidth: 500,
                      mx: 'auto',
                      fontSize: '1.1rem',
                      lineHeight: 1.6
                  }}
                >
                  Create your first project to start analyzing your SQL data with AI-powered insights
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => navigate('/app/projects/create')}
                  sx={{
                    background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
                    color: '#fff',
                      py: 2,
                      px: 6,
                    borderRadius: 2,
                    textTransform: 'none',
                      fontSize: '1.1rem',
                    fontWeight: 600,
                      boxShadow: '0 8px 16px rgba(255, 107, 107, 0.25)',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #FF5B5B 0%, #FF7E43 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 20px rgba(255, 107, 107, 0.3)',
                    }
                  }}
                >
                  Create Your First Project
                </Button>
                </Paper>
            </Grid>
          ) : (
            projects.map((project) => (
              <Grid item xs={12} sm={6} md={4} key={project.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 2,
                      border: '1px solid',
                      borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                      background: isDarkMode ? '#1A202C' : '#FFFFFF',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
                        borderColor: 'transparent'
                      }
                    }}
                  >
                    <CardActionArea onClick={() => handleProjectClick(project)} sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                        <Avatar
                          sx={{
                            bgcolor: 'primary.main',
                            width: 48,
                            height: 48,
                            fontSize: '1.5rem',
                            fontWeight: 600,
                            background: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)'
                          }}
                        >
                          {project.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <IconButton
                          onClick={(e) => handleMenuOpen(e, project)}
                          sx={{
                            color: isDarkMode ? '#A0AEC0' : '#718096',
                            '&:hover': {
                              color: '#FF6B6B'
                            }
                          }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{
                          fontWeight: 600,
                          mb: 1,
                          color: isDarkMode ? '#FFFFFF' : '#2D3748'
                        }}
                      >
                        {project.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        sx={{
                          color: isDarkMode ? '#A0AEC0' : '#718096',
                          mb: 2,
                          height: 40,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical'
                        }}
                      >
                        {project.description || 'No description provided'}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', color: isDarkMode ? '#A0AEC0' : '#718096' }}>
                        <AccessTimeIcon sx={{ fontSize: '0.9rem', mr: 0.5 }} />
                        <Typography variant="caption">
                          {new Date(project.created_at).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </CardActionArea>
                  </Card>
                </motion.div>
              </Grid>
            ))
          )}
        </Grid>
      </Box>
    </Box>

    {selectedProject && (
      <DatabaseInfoDialog
        open={dbInfoDialogOpen}
        onClose={() => {
          setDbInfoDialogOpen(false);
          setSelectedProject(null);
        }}
        projectId={selectedProject.id}
      />
    )}
    </Container>
  );
};

export default Dashboard; 