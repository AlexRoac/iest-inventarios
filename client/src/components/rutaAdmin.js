import { Navigate } from 'react-router-dom';
import useUserType from '../hooks/useUserType.js';

export default function RutaAdmin({ children }) {
  const {userType} = useUserType();

  if (userType == null) return <div>Not logged in</div>;

  return userType === 'admin'
    ? children
    : <Navigate to="/unauthorized" replace />;
}

