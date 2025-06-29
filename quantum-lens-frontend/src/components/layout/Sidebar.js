import React, { useState, useEffect } from 'react';
import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Box, 
  Divider, 
  Typography,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Avatar,
  ListItemButton
} from '@mui/material';
import { 
  Dashboard as DashboardIcon, 
  Person as PersonIcon,
  Logout as LogoutIcon,
  Storage as StorageIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { logout } from '../../services/authService';
import LoadingSpinner from '../common/LoadingSpinner';
import DatabaseInfoDialog from '../common/DatabaseInfoDialog';
import ProjectInfoDialog from '../common/ProjectInfoDialog';

const drawerWidth = 280;
const closedDrawerWidth = 50;

const Sidebar = ({ isDarkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { projectId } = useParams();
  const { user, setUser } = useAuth();
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [project, setProject] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [isDatabaseInfoOpen, setIsDatabaseInfoOpen] = useState(false);
  const [projectInfoOpen, setProjectInfoOpen] = useState(false);

  useEffect(() => {
    if (projectId) {
      try {
        const encryptedData = localStorage.getItem(`project_${projectId}`);
        if (encryptedData) {
          let projectData;
          try {
            projectData = JSON.parse(Buffer.from(encryptedData, 'base64').toString('utf-8'));
          } catch (e) {
            try {
              projectData = JSON.parse(atob(encryptedData));
            } catch (e2) {
              console.error('Failed to decode project data:', e2);
              return;
            }
          }
          setProject(projectData);
        }
      } catch (error) {
        console.error('Failed to load project:', error);
      }
    } else {
      setProject(null);
    }
  }, [projectId]);

  const handleDrawerToggle = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileClick = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleDatabaseInfoClick = () => {
    setIsDatabaseInfoOpen(true);
  };

  const handleDatabaseInfoClose = () => {
    setIsDatabaseInfoOpen(false);
  };

  if (loading) {
    return (
      <Box
        sx={{
          width: isDrawerOpen ? drawerWidth : closedDrawerWidth,
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: isDarkMode ? '#2D3748' : '#ffffff',
        }}
      >
        <LoadingSpinner message="Signing out..." />
      </Box>
    );
  }

  const showProjectButtons = project && projectId;

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          width: isDrawerOpen ? drawerWidth : closedDrawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: isDrawerOpen ? drawerWidth : closedDrawerWidth,
            boxSizing: 'border-box',
            bgcolor: isDarkMode ? '#202123' : '#f7f7f8',
            color: isDarkMode ? '#F7FAFC' : '#2D3748',
            borderRight: '1px solid',
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
            transition: 'width 0.3s ease',
            overflowX: 'hidden',
          },
        }}
      >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ 
            p: 2,
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: isDrawerOpen ? 'flex-start' : 'center',
            gap: 1,
            cursor: 'pointer',
          }}
          onClick={handleDrawerToggle}
          >
            <Box
              component="svg"
              viewBox="0 0 24 24"
              sx={{
                width: 24,
                height: 24,
                fill: '#FF6B6B',
                transition: 'transform 0.3s ease',
                transform: isDrawerOpen ? 'rotate(0deg)' : 'rotate(180deg)',
              }}
            >
              <path d="M12 0L14.5 9.5H24L16.5 15.5L19 24L12 18L5 24L7.5 15.5L0 9.5H9.5L12 0Z" />
            </Box>
            {isDrawerOpen && (
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(90deg, #FF6B6B 0%, #FF8E53 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                QUANTUM LENS AI
              </Typography>
            )}
          </Box>

          <Divider sx={{ borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }} />

          <List>
            {showProjectButtons ? (
              <>
                <ListItemButton
                  onClick={() => navigate(`/app/projects/${projectId}`)}
                  sx={{
                    borderRadius: 1,
                    mx: 1,
                    minHeight: 48,
                    justifyContent: isDrawerOpen ? 'initial' : 'center',
                  }}
                >
                  <ListItemIcon 
                    sx={{ 
                      color: isDarkMode ? '#A0AEC0' : '#718096',
                      minWidth: isDrawerOpen ? 40 : 'auto',
                      justifyContent: 'center',
                    }}
                  >
                    <DashboardIcon />
                  </ListItemIcon>
                  {isDrawerOpen && (
                    <ListItemText 
                      primary={project.name}
                      secondary={project.description || 'No description provided'}
                      primaryTypographyProps={{
                        sx: {
                          fontWeight: 600,
                          color: isDarkMode ? '#F7FAFC' : '#2D3748',
                        }
                      }}
                      secondaryTypographyProps={{
                        sx: {
                          color: isDarkMode ? '#A0AEC0' : '#718096',
                        }
                      }}
                    />
                  )}
                </ListItemButton>

                <Divider sx={{ borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)', my: 1 }} />

                <ListItemButton
                  onClick={handleDatabaseInfoClick}
                  sx={{
                    borderRadius: 1,
                    mx: 1,
                    minHeight: 48,
                    justifyContent: isDrawerOpen ? 'initial' : 'center',
                    '&:hover': {
                      bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                    }
                  }}
                >
                  <Tooltip title={!isDrawerOpen ? "Database Info" : ""} placement="right">
                    <ListItemIcon 
                      sx={{ 
                        color: isDarkMode ? '#A0AEC0' : '#718096',
                        minWidth: isDrawerOpen ? 40 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      <StorageIcon />
                    </ListItemIcon>
                  </Tooltip>
                  {isDrawerOpen && (
                    <ListItemText 
                      primary="Database Info"
                      primaryTypographyProps={{
                        sx: { color: isDarkMode ? '#F7FAFC' : '#2D3748' }
                      }}
                    />
                  )}
                </ListItemButton>

                <ListItemButton
                  onClick={() => setProjectInfoOpen(true)}
                  sx={{
                    borderRadius: 1,
                    mx: 1,
                    minHeight: 48,
                    justifyContent: isDrawerOpen ? 'initial' : 'center',
                  }}
                >
                  <Tooltip title={!isDrawerOpen ? "Project Info" : ""} placement="right">
                    <ListItemIcon 
                      sx={{ 
                        color: isDarkMode ? '#A0AEC0' : '#718096',
                        minWidth: isDrawerOpen ? 40 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      <InfoIcon />
                    </ListItemIcon>
                  </Tooltip>
                  {isDrawerOpen && <ListItemText primary="Project Info" />}
                </ListItemButton>
              </>
            ) : (
              <ListItemButton
                onClick={() => navigate('/app/dashboard')}
                selected={location.pathname === '/app/dashboard'}
                sx={{
                  borderRadius: 1,
                  mx: 1,
                  minHeight: 48,
                  justifyContent: isDrawerOpen ? 'initial' : 'center',
                  '&.Mui-selected': {
                    bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                  },
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    color: isDarkMode ? '#A0AEC0' : '#718096',
                    minWidth: isDrawerOpen ? 40 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  <DashboardIcon />
                </ListItemIcon>
                {isDrawerOpen && <ListItemText primary="Dashboard" />}
              </ListItemButton>
            )}
          </List>

          <Box sx={{ flexGrow: 1 }} />

          <Divider sx={{ borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)' }} />
          
          <Box sx={{ p: 1, mb: 1 }}>
            <Tooltip title={!isDrawerOpen ? "Account" : ""} placement="right">
              <IconButton 
                onClick={handleProfileClick}
                sx={{ 
                  width: '100%',
                  borderRadius: 1,
                  justifyContent: isDrawerOpen ? 'flex-start' : 'center',
                  gap: 1,
                  '&:hover': {
                    bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                  }
                }}
              >
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32,
                    bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                    color: isDarkMode ? '#F7FAFC' : '#2D3748'
                  }}
                >
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </Avatar>
                {isDrawerOpen && (
                  <Typography 
                    sx={{ 
                      flexGrow: 1,
                      textAlign: 'left',
                      color: isDarkMode ? '#F7FAFC' : '#2D3748',
                      fontSize: '0.9rem'
                    }}
                  >
                    {user?.email || 'User'}
                  </Typography>
                )}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </Drawer>

      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        PaperProps={{
          sx: {
            bgcolor: isDarkMode ? '#2D3748' : '#FFFFFF',
            color: isDarkMode ? '#F7FAFC' : '#2D3748',
            border: '1px solid',
            borderColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          }
        }}
      >
        <MenuItem onClick={() => navigate('/app/profile')}>
          <ListItemIcon>
            <PersonIcon sx={{ color: isDarkMode ? '#A0AEC0' : '#718096' }} />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutIcon sx={{ color: isDarkMode ? '#A0AEC0' : '#718096' }} />
          </ListItemIcon>
          <ListItemText primary="Logout" />
        </MenuItem>
      </Menu>

      <DatabaseInfoDialog
        open={isDatabaseInfoOpen}
        onClose={handleDatabaseInfoClose}
        projectId={projectId}
      />

      <ProjectInfoDialog
        open={projectInfoOpen}
        onClose={() => setProjectInfoOpen(false)}
        project={project}
      />
    </>
  );
};

export default Sidebar; 