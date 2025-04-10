import { Navigate, Outlet, useLocation } from "react-router-dom";
import useGeneral from "../../hooks/useGeneral";
import { toast } from "sonner";

export default function ProtectedAdminRoute() {
    const { user, isLoggedIn } = useGeneral();
    const location = useLocation();
    
    if (!isLoggedIn) {
      // Redirect to login if not logged in, save the intended destination
      return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />;
    }
    
    if (user.role !== 'admin') {
      // Redirect non-recruiters to dashboard
      toast.error("You are not authorized to access this page.");
      return <Navigate to="/" replace />;
    }
    
    // User is a recruiter, allow access
    return <Outlet />;
  }