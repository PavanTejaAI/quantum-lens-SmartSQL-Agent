import { API_URL } from '../config';
import authService from './authService';

const encryptData = (data) => {
    try {
        if (!data || typeof data !== 'object') {
            throw new Error('Invalid data for encryption');
        }
        return Buffer.from(JSON.stringify(data)).toString('base64');
    } catch (error) {
        console.error('Encryption error:', error);
        throw new Error('Failed to encrypt project data');
    }
};

const decryptData = (encryptedData) => {
    try {
        if (!encryptedData) {
            throw new Error('No data to decrypt');
        }
        return JSON.parse(Buffer.from(encryptedData, 'base64').toString('utf-8'));
    } catch (error) {
        console.error('Decryption error:', error);
        throw new Error('Failed to decrypt project data');
    }
};

export const createProject = async (projectData) => {
    try {
        if (!projectData.dbConfig) {
            throw new Error('Database configuration is required');
        }

        const encryptedPath = encryptData({
            dbConfig: projectData.dbConfig,
            queries: [],
            performance: {}
        });

        const response = await authService.axiosInstance.post('/projects', {
            name: projectData.name,
            description: projectData.description,
            encrypted_path: encryptedPath
        });

        if (!response.data || !response.data.id) {
            throw new Error('Invalid response from server');
        }

        const localData = {
            id: response.data.id,
            name: projectData.name,
            description: projectData.description,
            dbConfig: projectData.dbConfig,
            queries: [],
            performance: {},
            created_at: response.data.created_at
        };

        try {
            localStorage.setItem(`project_${response.data.id}`, encryptData(localData));

            const projects = JSON.parse(localStorage.getItem('projects') || '[]');
            projects.push(localData);
            localStorage.setItem('projects', JSON.stringify(projects));
        } catch (storageError) {
            console.error('Failed to store project locally:', storageError);
            // Continue even if local storage fails
        }

        return response.data;
    } catch (error) {
        throw error.response?.data?.detail || error.message || 'Failed to create project';
    }
};

export const getProjects = async () => {
    try {
        const response = await authService.axiosInstance.get('/projects');

        return response.data.map(project => {
            try {
                const localData = localStorage.getItem(`project_${project.id}`);
                if (localData) {
                    const decryptedData = decryptData(localData);
                    return {
                        ...project,
                        dbConfig: decryptedData.dbConfig || {},
                        queries: decryptedData.queries || [],
                        performance: decryptedData.performance || {}
                    };
                }
                return project;
            } catch (error) {
                console.error(`Failed to decrypt project ${project.id}:`, error);
                return project;
            }
        });
    } catch (error) {
        throw error.response?.data?.detail || error.message || 'Failed to fetch projects';
    }
};

export const getProject = async (projectId) => {
    try {
        if (!projectId) {
            throw new Error('Project ID is required');
        }

        const response = await authService.axiosInstance.get(`/projects/${projectId}`);
        if (!response.data) {
            throw new Error('Project not found');
        }

        try {
            const localData = localStorage.getItem(`project_${projectId}`);
            if (localData) {
                const decryptedData = decryptData(localData);
                return {
                    ...response.data,
                    dbConfig: decryptedData.dbConfig || {},
                    queries: decryptedData.queries || [],
                    performance: decryptedData.performance || {}
                };
            }
        } catch (storageError) {
            console.error('Failed to get project from local storage:', storageError);
        }

        return response.data;
    } catch (error) {
        throw error.response?.data?.detail || error.message || 'Failed to fetch project';
    }
};

export const updateProject = async (projectId, projectData) => {
    try {
        if (!projectId || !projectData) {
            throw new Error('Project ID and data are required');
        }

        const encryptedPath = encryptData({
            dbConfig: projectData.dbConfig || {},
            queries: projectData.queries || [],
            performance: projectData.performance || {}
        });

        const response = await authService.axiosInstance.put(`/projects/${projectId}`, {
            name: projectData.name,
            description: projectData.description,
            encrypted_path: encryptedPath
        });

        if (!response.data) {
            throw new Error('Invalid response from server');
        }

        try {
            const localData = {
                id: projectId,
                name: projectData.name,
                description: projectData.description,
                dbConfig: projectData.dbConfig || {},
                queries: projectData.queries || [],
                performance: projectData.performance || {},
                updated_at: response.data.updated_at
            };

            localStorage.setItem(`project_${projectId}`, encryptData(localData));

            const projects = JSON.parse(localStorage.getItem('projects') || '[]');
            const updatedProjects = projects.map(p => p.id === projectId ? localData : p);
            localStorage.setItem('projects', JSON.stringify(updatedProjects));
        } catch (storageError) {
            console.error('Failed to update project in local storage:', storageError);
            // Continue even if local storage fails
        }

        return response.data;
    } catch (error) {
        throw error.response?.data?.detail || error.message || 'Failed to update project';
    }
};

export const deleteProject = async (projectId) => {
    try {
        await authService.axiosInstance.delete(`/projects/${projectId}`);

        localStorage.removeItem(`project_${projectId}`);
        localStorage.removeItem(`chat_history_${projectId}`);

        const projects = JSON.parse(localStorage.getItem('projects') || '[]');
        const updatedProjects = projects.filter(p => p.id !== projectId);
        localStorage.setItem('projects', JSON.stringify(updatedProjects));
    } catch (error) {
        throw error.response?.data?.detail || 'Failed to delete project';
    }
};

export const getDatabaseInfo = async (projectId) => {
    try {
        if (!projectId) {
            throw new Error('Project ID is required');
        }

        const response = await authService.axiosInstance.get(`/projects/${projectId}/database-info`);
        if (!response.data) {
            throw new Error('No database information received');
        }
        return response.data;
    } catch (error) {
        throw error.response?.data?.detail || error.message || 'Failed to fetch database information';
    }
}; 