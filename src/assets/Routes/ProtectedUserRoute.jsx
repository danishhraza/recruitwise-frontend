import { Navigate, useLocation, Outlet } from 'react-router-dom';
import useGeneral from '../../hooks/useGeneral';


export default function ProtectedUserRoute() {
  const { user, isLoggedIn } = useGeneral();
  const location = useLocation();
  
  if (!isLoggedIn) {
    return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />;
  }
  
  if (user.role !== 'candidate') {
    return <Navigate to="/dashboard" replace />;
  }
  
  // Return the Outlet component which will render the matched child route
  return <Outlet />;
}