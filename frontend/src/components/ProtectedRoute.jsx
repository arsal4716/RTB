import { Navigate } from 'react-router-dom';
import { getToken } from '../utils/authStorage';

const ProtectedRoute = ({ children }) => {
  const token = getToken();
  return token ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
