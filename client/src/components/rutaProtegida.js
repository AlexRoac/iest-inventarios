import { Navigate } from 'react-router-dom';
import useUserType from '../hooks/useUserType.js';

export default function RutaProtegida({ children }) {
  const userType = useUserType();

  if (userType == null) return <div>Not logged in</div>;

  if (userType === 'normal') {
    return children;
  }
  else if (userType === 'admin') {
    return children;
  } else {
    return <Navigate to="/unauthorized" replace />;
  }
}
