import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Chip,
  CircularProgress,
  Button,
  useTheme,
  alpha
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';
import StorageIcon from '@mui/icons-material/Storage';
import TableChartIcon from '@mui/icons-material/TableChart';
import { getDatabaseInfo } from '../../services/projectService';

const DatabaseInfoDialog = ({ open, onClose, projectId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dbInfo, setDbInfo] = useState(null);
  const theme = useTheme();

  const fetchDatabaseInfo = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getDatabaseInfo(projectId);
      setDbInfo(data);
    } catch (error) {
      console.error('Failed to fetch database info:', error);
      setError(error.toString());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && projectId) {
      fetchDatabaseInfo();
    }
  }, [open, projectId]);

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
            <StorageIcon 
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
              Database Information
            </Typography>
          </Box>
          <Box>
            <IconButton 
              onClick={fetchDatabaseInfo} 
              size="small" 
              sx={{ 
                mr: 1,
                '&:hover': {
                  background: alpha(theme.palette.primary.main, 0.1)
                }
              }}
              title="Refresh"
            >
              <RefreshIcon />
            </IconButton>
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
        </Box>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight={300}>
            <CircularProgress size={40} />
          </Box>
        ) : error ? (
          <Box 
            display="flex" 
            flexDirection="column" 
            alignItems="center" 
            justifyContent="center" 
            minHeight={300}
            gap={2}
          >
            <Typography 
              color="error" 
              variant="h6" 
              sx={{ 
                fontWeight: 500,
                textAlign: 'center',
                maxWidth: 400
              }}
            >
              {error}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={fetchDatabaseInfo}
              startIcon={<RefreshIcon />}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                px: 3
              }}
            >
              Retry Connection
            </Button>
          </Box>
        ) : dbInfo ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box 
              sx={{ 
                display: 'flex', 
                gap: 3,
                p: 3,
                borderRadius: 2,
                bgcolor: alpha(theme.palette.primary.main, 0.05),
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
              }}
            >
              <Box>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Connection Status
                </Typography>
                <Chip
                  label={dbInfo.connection_status ? "Connected" : "Disconnected"}
                  color={dbInfo.connection_status ? "success" : "error"}
                  variant="filled"
                  sx={{ 
                    fontWeight: 500,
                    px: 1
                  }}
                />
              </Box>
              <Box>
                <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                  Database Name
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {dbInfo.database_name || "N/A"}
                </Typography>
              </Box>
            </Box>

            <Box>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <TableChartIcon sx={{ color: theme.palette.primary.main }} />
                <Typography variant="h6" fontWeight={600}>
                  Tables
                </Typography>
              </Box>
              <TableContainer 
                component={Paper} 
                variant="outlined"
                sx={{ 
                  borderRadius: 2,
                  '& .MuiTableCell-root': {
                    borderColor: theme.palette.mode === 'dark' 
                      ? alpha(theme.palette.common.white, 0.1)
                      : alpha(theme.palette.common.black, 0.1)
                  }
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell 
                        sx={{ 
                          fontWeight: 600,
                          bgcolor: theme.palette.mode === 'dark'
                            ? alpha(theme.palette.common.white, 0.05)
                            : alpha(theme.palette.common.black, 0.02)
                        }}
                      >
                        Table Name
                      </TableCell>
                      <TableCell 
                        align="right"
                        sx={{ 
                          fontWeight: 600,
                          bgcolor: theme.palette.mode === 'dark'
                            ? alpha(theme.palette.common.white, 0.05)
                            : alpha(theme.palette.common.black, 0.02)
                        }}
                      >
                        Columns
                      </TableCell>
                      <TableCell 
                        align="right"
                        sx={{ 
                          fontWeight: 600,
                          bgcolor: theme.palette.mode === 'dark'
                            ? alpha(theme.palette.common.white, 0.05)
                            : alpha(theme.palette.common.black, 0.02)
                        }}
                      >
                        Rows
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dbInfo.tables.map((table) => (
                      <TableRow 
                        key={table.name}
                        sx={{
                          '&:hover': {
                            bgcolor: theme.palette.mode === 'dark'
                              ? alpha(theme.palette.common.white, 0.05)
                              : alpha(theme.palette.common.black, 0.02)
                          }
                        }}
                      >
                        <TableCell component="th" scope="row" sx={{ fontWeight: 500 }}>
                          {table.name}
                        </TableCell>
                        <TableCell align="right">{table.column_count}</TableCell>
                        <TableCell align="right">{table.row_count}</TableCell>
                      </TableRow>
                    ))}
                    {dbInfo.tables.length === 0 && (
                      <TableRow>
                        <TableCell 
                          colSpan={3} 
                          align="center"
                          sx={{ py: 8 }}
                        >
                          <Typography color="textSecondary" variant="body1">
                            {dbInfo.connection_status 
                              ? "No tables found in the database" 
                              : "Could not fetch tables - Connection failed"}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          </Box>
        ) : (
          <Box 
            display="flex" 
            justifyContent="center" 
            alignItems="center" 
            minHeight={300}
          >
            <Typography color="error">Failed to load database information</Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default DatabaseInfoDialog; 