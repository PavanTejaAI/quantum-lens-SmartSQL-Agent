import React, { useState } from 'react';
import { Box, Paper, Typography, TextField, Button, Alert, Grid, InputAdornment } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createProject } from '../../services/projectService';
import LoadingSpinner from '../common/LoadingSpinner';

const CreateProject = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dbConfig: {
      host: '',
      port: '3306',
      database: '',
      user: '',
      password: ''
    }
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Project name is required');
      return;
    }

    if (!formData.dbConfig.host || !formData.dbConfig.database || !formData.dbConfig.user) {
      setError('Database connection details are required');
      return;
    }

    try {
      setLoading(true);
      const result = await createProject(formData);
      // Store project data in localStorage
      const projectData = {
        id: result.id,
        name: formData.name,
        description: formData.description,
        dbConfig: {
          ...formData.dbConfig,
          password: undefined // Don't store password in localStorage
        },
        created_at: new Date().toISOString()
      };
      localStorage.setItem(`project_${result.id}`, btoa(JSON.stringify(projectData)));
      
      // Update projects list in localStorage
      const existingProjects = JSON.parse(localStorage.getItem('projects') || '[]');
      localStorage.setItem('projects', JSON.stringify([...existingProjects, projectData]));
      
      navigate(`/app/projects/${result.id}`);
    } catch (error) {
      setError(error.toString());
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner message="Creating project..." />;
  }

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', p: 3 }}>
      <Paper 
        elevation={3}
        sx={{ 
          p: 4,
          background: theme => theme.palette.background.paper,
          borderRadius: 2
        }}
      >
        <Typography 
          variant="h4" 
          gutterBottom
          sx={{
            fontWeight: 700,
            mb: 4,
            background: 'linear-gradient(90deg, #FF6B6B 0%, #FF8E53 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Create New Project
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ color: theme => theme.palette.text.primary }}>
                Project Details
              </Typography>
              <TextField
                fullWidth
                label="Project Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Project Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={3}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom sx={{ color: theme => theme.palette.text.primary }}>
                Database Connection
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={8}>
                  <TextField
                    fullWidth
                    label="Host"
                    name="dbConfig.host"
                    value={formData.dbConfig.host}
                    onChange={handleChange}
                    placeholder="localhost"
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Port"
                    name="dbConfig.port"
                    value={formData.dbConfig.port}
                    onChange={handleChange}
                    placeholder="3306"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Database Name"
                    name="dbConfig.database"
                    value={formData.dbConfig.database}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Username"
                    name="dbConfig.user"
                    value={formData.dbConfig.user}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Password"
                    name="dbConfig.password"
                    type="password"
                    value={formData.dbConfig.password}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                sx={{
                  mt: 2,
                  py: 2,
                  background: 'linear-gradient(90deg, #FF6B6B 0%, #FF8E53 100%)',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #FF5B5B 0%, #FF7E43 100%)',
                  }
                }}
              >
                Create Project
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateProject; 