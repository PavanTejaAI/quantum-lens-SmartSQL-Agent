import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Avatar,
  Container,
  useTheme,
  useMediaQuery,
  Tooltip,
  Paper,
  CircularProgress,
  Divider
} from '@mui/material';
import {
  Send as SendIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { marked } from 'marked';
import { getChatCompletion, getChatMessages, getChatSessions } from '../../services/chatService';

const ChatInterface = ({ projectId, isDarkMode, setIsDarkMode }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentSession, setCurrentSession] = useState(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    loadChatHistory();
    scrollToBottom();
  }, [projectId]);

  useEffect(() => {
    const loadLatestSession = async () => {
      try {
        const sessions = await getChatSessions(projectId);
        if (sessions && sessions.length > 0) {
          const latestSession = sessions[0];
          setCurrentSession(latestSession);
          const sessionMessages = await getChatMessages(latestSession.id);
          setMessages(sessionMessages);
        }
      } catch (error) {
        console.error('Failed to load chat session:', error);
      }
    };
    loadLatestSession();
  }, [projectId]);

  const loadChatHistory = () => {
    try {
      const storedMessages = localStorage.getItem(`chat_history_${projectId}`);
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
    } catch (error) {
      console.error('Failed to load chat history:', error);
    }
  };

  const saveChatHistory = (newMessages) => {
    try {
      localStorage.setItem(`chat_history_${projectId}`, JSON.stringify(newMessages));
    } catch (error) {
      console.error('Failed to save chat history:', error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isGenerating) return;

    const userMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    saveChatHistory(updatedMessages);
    setInput('');
    setIsGenerating(true);

    try {
      setMessages(prev => [...prev, { role: 'assistant', content: 'thinking...', timestamp: new Date().toISOString(), isLoading: true }]);
      const response = await getChatCompletion(updatedMessages, projectId);
      
      if (response.session_id) {
        setCurrentSession({ id: response.session_id });
      }

      setMessages(prev => prev.filter(msg => !msg.isLoading));
      const assistantMessage = {
        role: 'assistant',
        content: response.response,
        timestamp: new Date().toISOString(),
      };

      const finalMessages = [...updatedMessages, assistantMessage];
      setMessages(finalMessages);
      saveChatHistory(finalMessages);
    } catch (error) {
      console.error('Failed to get response:', error);
      setMessages(prev => prev.filter(msg => !msg.isLoading));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const renderMarkdown = (content) => {
    return { __html: marked(content) };
  };

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: isDarkMode ? '#343541' : '#FFFFFF',
        position: 'relative',
      }}
    >
      <Box
        ref={chatContainerRef}
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: isDarkMode ? '#565869' : '#D1D5DB',
            borderRadius: '4px',
          },
          pb: 20,
          pt: 10,
          mb: isMobile ? 8 : 12,
          height: 'calc(100vh - 140px)',
          position: 'relative',
        }}
      >
        {messages.map((message, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Box
              sx={{
                width: '100%',
                py: 2,
                px: 2,
              }}
            >
              <Container maxWidth="md">
                <Box
                  sx={{
                    display: 'flex',
                    gap: 3,
                    maxWidth: '48rem',
                    mx: 'auto',
                    flexDirection: message.role === 'user' ? 'row-reverse' : 'row',
                  }}
                >
                  <Avatar
                    sx={{
                      width: 30,
                      height: 30,
                      bgcolor: message.role === 'assistant' ? '#10A37F' : '#7F6AFF',
                    }}
                  >
                    {message.role === 'assistant' ? <BotIcon /> : <PersonIcon />}
                  </Avatar>
                  <Typography
                    component="div"
                    sx={{
                      color: isDarkMode ? '#ECECF1' : '#2D3748',
                      maxWidth: '80%',
                      textAlign: message.role === 'user' ? 'right' : 'left',
                      opacity: message.isLoading ? 0.7 : 1,
                      '& p': {
                        m: 0,
                        mb: 2,
                        '&:last-child': {
                          mb: 0,
                        },
                      },
                      '& pre': {
                        bgcolor: isDarkMode ? '#2A2B32' : '#F7FAFC',
                        p: 2,
                        borderRadius: 1,
                        overflow: 'auto',
                        textAlign: 'left',
                        '& code': {
                          color: isDarkMode ? '#ECECF1' : '#2D3748',
                        },
                      },
                      '& code': {
                        bgcolor: isDarkMode ? '#2A2B32' : '#F7FAFC',
                        p: 0.5,
                        borderRadius: 0.5,
                      },
                    }}
                    dangerouslySetInnerHTML={renderMarkdown(message.content)}
                  />
                </Box>
              </Container>
            </Box>
          </motion.div>
        ))}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 2 }}>
            <Paper
              sx={{
                p: 2,
                backgroundColor: 'background.paper',
                borderRadius: '20px 20px 20px 5px'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                <Typography>Thinking...</Typography>
              </Box>
            </Paper>
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>

      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: isDarkMode ? '#343541' : '#FFFFFF',
          padding: isMobile ? '16px 8px' : '24px 16px',
          zIndex: 1000,
        }}
      >
        <Container maxWidth="md">
          <Box
            sx={{
              maxWidth: '48rem',
              mx: 'auto',
              position: 'relative',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 1.5,
                bgcolor: isDarkMode ? '#40414F' : '#FFFFFF',
                border: '1px solid',
                borderColor: isDarkMode ? '#2A2B32' : '#E5E7EB',
                borderRadius: '24px',
                transition: 'border-color 0.3s ease',
                '&:hover': {
                  borderColor: isDarkMode ? '#565869' : '#D1D5DB',
                },
              }}
            >
              <Tooltip title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
                <IconButton
                  onClick={() => setIsDarkMode(prev => !prev)}
                  sx={{
                    color: isDarkMode ? '#A0AEC0' : '#718096',
                    '&:hover': { color: '#FF6B6B' },
                    bgcolor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.3s ease',
                    mr: 1,
                  }}
                >
                  {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
                </IconButton>
              </Tooltip>
              <TextField
                fullWidth
                multiline
                maxRows={isMobile ? 4 : 8}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Send a message..."
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  sx: {
                    color: isDarkMode ? '#ECECF1' : '#2D3748',
                    fontSize: isMobile ? '0.9rem' : '1rem',
                    lineHeight: '1.5',
                    '& textarea': {
                      padding: '4px 8px',
                      '&::placeholder': {
                        color: isDarkMode ? '#8E8EA0' : '#9CA3AF',
                        opacity: 1,
                      },
                    },
                    '& .MuiInputBase-input': {
                      padding: '4px 8px',
                    },
                  },
                }}
                sx={{
                  '& .MuiInputBase-root': {
                    padding: '0',
                  },
                }}
              />
              <IconButton
                onClick={handleSend}
                disabled={!input.trim() || isGenerating}
                sx={{
                  ml: 1,
                  mr: 0.5,
                  color: input.trim() 
                    ? (isDarkMode ? '#7F6AFF' : '#6366F1')
                    : (isDarkMode ? '#565869' : '#D1D5DB'),
                  '&:hover': {
                    bgcolor: 'transparent',
                    color: input.trim() 
                      ? (isDarkMode ? '#9D8FFF' : '#818CF8')
                      : undefined,
                  },
                  transition: 'color 0.2s ease',
                }}
              >
                <SendIcon />
              </IconButton>
            </Box>
            <Typography
              variant="caption"
              align="center"
              sx={{
                display: 'block',
                mt: 2,
                color: isDarkMode ? '#8E8EA0' : '#9CA3AF',
                fontSize: isMobile ? '0.7rem' : '0.75rem',
              }}
            >
              QuantumLens AI may produce inaccurate information about people, places, or facts.
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default ChatInterface; 