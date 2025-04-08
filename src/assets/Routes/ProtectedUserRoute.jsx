import { useLocation } from "react-router-dom";
import useGeneral from "../../hooks/useGeneral";

export default function ProtectedUserRoute({ element }) {
    const { user, isLoggedIn } = useGeneral();
    const location = useLocation();
    
    if (!isLoggedIn) {
      return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }
    
    if (user.role !== 'user') {
      return <Navigate to="/dashboard" replace />;
    }
    
    return element;
  }