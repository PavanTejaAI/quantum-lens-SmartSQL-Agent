import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;

  return isAuthenticated ? children : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default ProtectedRoute; 