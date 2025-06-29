import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, IconButton, Button } from '@mui/material';
import { ArrowBack, Storage } from '@mui/icons-material';
import { useParams, useNavigate } from 'react-router-dom';
import DatabaseInfoDialog from '../components/common/DatabaseInfoDialog';

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [isDbInfoOpen, setIsDbInfoOpen] = useState(false);

  useEffect(() => {
    try {
      const encryptedData = localStorage.getItem(`project_${projectId}`);
      if (encryptedData) {
        const projectData = JSON.parse(atob(encryptedData));
        setProject(projectData);
      } else {
        navigate('/app/dashboard');
      }
    } catch (error) {
      console.error('Failed to load project:', error);
      navigate('/app/dashboard');
    }
  }, [projectId, navigate]);

  if (!project) {
    return null;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
        <IconButton 
          onClick={() => navigate('/app/dashboard')}
          sx={{ mr: 2 }}
        >
          <ArrowBack />
        </IconButton>
        <Typography 
          variant="h4" 
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(90deg, #FF6B6B 0%, #FF8E53 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {project.name}
        </Typography>
      </Box>

      <Paper 
        elevation={3}
        sx={{ 
          p: 4,
          background: theme => theme.palette.background.paper,
          borderRadius: 2
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">Project Information</Typography>
          <Button
            variant="outlined"
            startIcon={<Storage />}
            onClick={() => setIsDbInfoOpen(true)}
          >
            View Database Info
          </Button>
        </Box>

        <Typography variant="body1" sx={{ mb: 3 }}>
          {project.description || 'No description provided'}
        </Typography>

        <Typography variant="body2" color="textSecondary">
          Created on: {new Date(project.created_at).toLocaleDateString()}
        </Typography>
      </Paper>

      <DatabaseInfoDialog
        open={isDbInfoOpen}
        onClose={() => setIsDbInfoOpen(false)}
        projectId={projectId}
      />
    </Box>
  );
};

export default ProjectDetails; 