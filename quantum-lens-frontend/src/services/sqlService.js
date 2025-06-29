import authService from './authService';

export const executeSqlQuery = async (projectId, query) => {
    try {
        const response = await authService.axiosInstance.post('/sql/execute', {
            project_id: projectId,
            query
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.detail || 'Failed to execute SQL query';
    }
};

export const getQuerySuggestions = async (projectId, userInput) => {
    try {
        const response = await authService.axiosInstance.post('/sql/suggest', {
            project_id: projectId,
            user_input: userInput
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.detail || 'Failed to get query suggestions';
    }
};

export const explainSqlQuery = async (projectId, query) => {
    try {
        const response = await authService.axiosInstance.post('/sql/explain', {
            project_id: projectId,
            query
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.detail || 'Failed to explain SQL query';
    }
};

export const processSQLRequest = async (projectId, message, context = null) => {
    try {
        if (!projectId) {
            throw new Error('Project ID is required');
        }
        
        const parsedProjectId = parseInt(projectId);
        if (isNaN(parsedProjectId) || parsedProjectId <= 0) {
            throw new Error('Valid project ID is required');
        }
        
        if (!message || typeof message !== 'string' || !message.trim()) {
            throw new Error('Valid message is required');
        }

        console.log('Sending SQL request:', {
            project_id: parsedProjectId,
            message: message.trim(),
            context
        });

        const response = await authService.axiosInstance.post('/sql/process', {
            project_id: parsedProjectId,
            message: message.trim(),
            context
        });
        
        if (!response.data) {
            throw new Error('No response data received');
        }

        const result = response.data;
        
        if (!result.success) {
            console.error('SQL processing failed:', result);
            throw new Error(result.content?.error || 'Request failed');
        }

        if (result.type === 'text') {
            return {
                success: true,
                type: 'text',
                message: result.content
            };
        }

        return {
            success: true,
            type: result.type,
            message: result.content.analysis,
            analysis: {
                query: result.content.query,
                result: result.content.result,
                explanation: result.content.analysis
            },
            suggestions: {
                improvements: result.content.optimization ? [result.content.optimization] : []
            },
            metadata: {
                execution_time: result.content.result.execution_time,
                row_count: result.content.result.total_rows,
                affected_rows: result.content.result.affected_rows
            }
        };
    } catch (error) {
        console.error('SQL request error:', error);
        
        // Enhanced error handling with more specific messages
        if (error.response?.status === 404) {
            throw new Error('Project not found or you do not have access to it');
        } else if (error.response?.status === 400) {
            const detail = error.response.data?.detail;
            if (detail?.includes('Invalid project configuration')) {
                throw new Error('Project configuration is invalid. Please check your database settings.');
            } else if (detail?.includes('Database connection failed')) {
                throw new Error('Cannot connect to your database. Please verify your connection settings.');
            } else if (detail?.includes('Message cannot be empty')) {
                throw new Error('Please enter a valid question or SQL query.');
            } else {
                throw new Error(detail || 'Invalid request data');
            }
        } else if (error.response?.status === 401) {
            throw new Error('Authentication required. Please log in again.');
        } else if (error.response?.status === 500) {
            throw new Error('Server error occurred while processing your request');
        }
        
        throw new Error(error.response?.data?.detail || error.message || 'Failed to process SQL request');
    }
};

export default {
    executeSqlQuery,
    getQuerySuggestions,
    explainSqlQuery,
    processSQLRequest
}; 