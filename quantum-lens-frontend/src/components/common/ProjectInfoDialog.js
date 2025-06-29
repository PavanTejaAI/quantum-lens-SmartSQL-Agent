import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Box,
  Chip,
  useTheme,
  alpha,
  Paper,
  Grid
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FolderIcon from '@mui/icons-material/Folder';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import DescriptionIcon from '@mui/icons-material/Description';
import StorageIcon from '@mui/icons-material/Storage';
import QueryStatsIcon from '@mui/icons-material/QueryStats';

const ProjectInfoDialog = ({ open, onClose, project }) => {
  const theme = useTheme();

  if (!project) return null;

  const stats = {
    totalQueries: project.queries?.length || 0,
    avgExecutionTime: project.performance?.avgExecutionTime || '0ms',
    successRate: project.performance?.successRate || '100%',
    lastAccessed: new Date(project.updated_at || project.created_at).toLocaleString()
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          background: theme.palette.mode === 'dark' 
            ? 'linear-gradient(145deg, #1a1b1e 0%, #2d2f34 100%)' 
            : 'linear-gradient(145deg, #ffffff 0%, #f5f5f5 100%)',
          boxShadow: theme.palette.mode === 'dark'
            ? '0 8px 32px rgba(0, 0, 0, 0.4)'
            : '0 8px 32px rgba(0, 0, 0, 0.1)',
        }
      }}
    >
      <DialogTitle sx={{ p: 3, pb: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box display="flex" alignItems="center" gap={2}>
            <FolderIcon 
              sx={{ 
                fontSize: 32,
                color: theme.palette.primary.main
              }} 
            />
            <Typography 
              variant="h5" 
              sx={{
                fontWeight: 600,
                background: 'linear-gradient(90deg, #FF6B6B 0%, #FF8E53 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Project Information
            </Typography>
          </Box>
          <IconButton 
            onClick={onClose} 
            size="small"
            sx={{
              '&:hover': {
                background: alpha(theme.palette.error.main, 0.1)
              }
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 3,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
            }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <DescriptionIcon sx={{ color: theme.palette.primary.main }} />
                  <Typography variant="h6" fontWeight={600}>
                    {project.name}
                  </Typography>
                </Box>
                <Typography color="textSecondary">
                  {project.description || 'No description provided'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <StorageIcon sx={{ color: theme.palette.primary.main }} />
                  <Typography variant="subtitle2" color="textSecondary">
                    Database Connection
                  </Typography>
                </Box>
                <Box sx={{ pl: 4 }}>
                  <Typography variant="body2" color="textSecondary">Host: {project.dbConfig?.host}</Typography>
                  <Typography variant="body2" color="textSecondary">Database: {project.dbConfig?.database}</Typography>
                  <Typography variant="body2" color="textSecondary">User: {project.dbConfig?.user}</Typography>
                </Box>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" gap={1} mb={1}>
                  <AccessTimeIcon sx={{ color: theme.palette.primary.main }} />
                  <Typography variant="subtitle2" color="textSecondary">
                    Timestamps
                  </Typography>
                </Box>
                <Box sx={{ pl: 4 }}>
                  <Typography variant="body2" color="textSecondary">
                    Created: {new Date(project.created_at).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    Last Accessed: {stats.lastAccessed}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Paper>

          <Box>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <QueryStatsIcon sx={{ color: theme.palette.primary.main }} />
              <Typography variant="h6" fontWeight={600}>
                Performance Metrics
              </Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 2,
                    borderRadius: 2,
                    bgcolor: theme.palette.mode === 'dark' 
                      ? alpha(theme.palette.primary.main, 0.1)
                      : alpha(theme.palette.primary.main, 0.05),
                    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                    height: '100%'
                  }}
                >
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Total Queries
                  </Typography>
                  <Typography variant="h4" fontWeight={600} color="primary">
                    {stats.totalQueries}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 2,
                    borderRadius: 2,
                    bgcolor: theme.palette.mode === 'dark' 
                      ? alpha(theme.palette.success.main, 0.1)
                      : alpha(theme.palette.success.main, 0.05),
                    border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
                    height: '100%'
                  }}
                >
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Success Rate
                  </Typography>
                  <Typography variant="h4" fontWeight={600} color="success">
                    {stats.successRate}
                  </Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Paper 
                  elevation={0}
                  sx={{ 
                    p: 2,
                    borderRadius: 2,
                    bgcolor: theme.palette.mode === 'dark' 
                      ? alpha(theme.palette.info.main, 0.1)
                      : alpha(theme.palette.info.main, 0.05),
                    border: `1px solid ${alpha(theme.palette.info.main, 0.1)}`,
                    height: '100%'
                  }}
                >
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    Avg. Execution Time
                  </Typography>
                  <Typography variant="h4" fontWeight={600} color="info">
                    {stats.avgExecutionTime}
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectInfoDialog; 