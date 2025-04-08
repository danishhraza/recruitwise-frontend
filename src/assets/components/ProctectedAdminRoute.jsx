// ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedAdminRoute = ({ isLoading, user }) => {
  // If still loading auth state, show loading indicator or nothing
  if (isLoading) {
    return <div>Loading...</div>; // or a proper loading component
  }
  
  // Check if user exists and has admin role
  if (user && user.role === "admin") {
    return <Outlet />; // Renders the child route components
  }
  
  // Not authorized, redirect to home
  return <Navigate to="/" />;
};

export default ProtectedAdminRoute;