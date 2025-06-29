import { API_URL } from '../config';
import authService from './authService';
import { processSQLRequest } from './sqlService';

export const getChatCompletion = async (messages, projectId) => {
    try {
        const lastMessage = messages[messages.length - 1];
        const context = {
            previous_messages: messages.slice(0, -1),
            chat_history: messages
        };

        const sqlResult = await processSQLRequest(projectId, lastMessage.content, context);
        
        if (sqlResult.success) {
            let response = sqlResult.message;
            
            if (sqlResult.suggestions?.follow_up_questions?.length > 0) {
                response += '\n\n**Suggested Follow-up Questions:**\n';
                sqlResult.suggestions.follow_up_questions.forEach(q => {
                    response += `- ${q}\n`;
                });
            }

            return {
                response: response,
                session_id: messages[0]?.session_id,
                metadata: sqlResult.metadata
            };
        }

        // If not a SQL query, proceed with normal chat completion
        const response = await authService.axiosInstance.post('/chat/completion', {
            messages,
            project_id: projectId
        });
        return response.data;
    } catch (error) {
        throw error.response?.data?.detail || 'Failed to get chat completion';
    }
};

export const getChatSessions = async (projectId) => {
    try {
        const response = await authService.axiosInstance.get(`/chat/sessions/${projectId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.detail || 'Failed to fetch chat sessions';
    }
};

export const getChatMessages = async (sessionId) => {
    try {
        const response = await authService.axiosInstance.get(`/chat/messages/${sessionId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data?.detail || 'Failed to fetch chat messages';
    }
}; 