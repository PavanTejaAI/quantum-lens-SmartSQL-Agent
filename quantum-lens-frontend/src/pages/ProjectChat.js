import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import ChatInterface from '../components/chat/ChatInterface';

const ProjectChat = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [isDarkMode, setIsDarkMode] = useOutletContext();

  useEffect(() => {
    try {
      const encryptedData = localStorage.getItem(`project_${projectId}`);
      if (encryptedData) {
        try {
          const projectData = JSON.parse(atob(encryptedData));
          setProject(projectData);
        } catch (decodeError) {
          console.error('Failed to decode project data:', decodeError);
          const projects = JSON.parse(localStorage.getItem('projects') || '[]');
          const foundProject = projects.find(p => p.id === parseInt(projectId));
          if (foundProject) {
            setProject(foundProject);
            localStorage.setItem(`project_${projectId}`, btoa(JSON.stringify(foundProject)));
          } else {
            navigate('/app/dashboard');
          }
        }
      } else {
        const projects = JSON.parse(localStorage.getItem('projects') || '[]');
        const foundProject = projects.find(p => p.id === parseInt(projectId));
        if (foundProject) {
          setProject(foundProject);
          localStorage.setItem(`project_${projectId}`, btoa(JSON.stringify(foundProject)));
        } else {
          navigate('/app/dashboard');
        }
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
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        margin: -4,
      }}
    >
      <ChatInterface projectId={projectId} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
    </Box>
  );
};

export default ProjectChat;