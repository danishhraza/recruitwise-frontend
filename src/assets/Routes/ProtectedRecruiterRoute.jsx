import { useLocation } from "react-router-dom";
import useGeneral from "../../hooks/useGeneral";

export default function ProtectedRecruiterRoute({ element }) {
    const { user, isLoggedIn } = useGeneral();
    const location = useLocation();
    
    if (!isLoggedIn) {
      // Redirect to login if not logged in, save the intended destination
      return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }
    
    if (user.role !== 'recruiter') {
      // Redirect non-recruiters to dashboard
      return <Navigate to="/dashboard" replace />;
    }
    
    // User is a recruiter, allow access
    return element;
  }