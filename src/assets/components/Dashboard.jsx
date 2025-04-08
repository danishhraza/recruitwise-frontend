import { useLocation, useNavigate } from "react-router-dom";
import useGeneral from "../../hooks/useGeneral";
import UserDashboardPage from "../pages/UserDashboardPage";
import RecruiterDashboardPage from "../pages/RecruiterDashboardPage";
import { useEffect } from "react";
import axios from "../../api/axios";
import { useState } from "react";
export default function DashboardPage() {
    const { user, setUser, isLoggedIn, setIsLoggedIn } = useGeneral();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);  // Add loading state
    const location = useLocation();

    async function getUserData() {
      try {
        const response = await axios.get('/auth/me', { withCredentials: true });
        setUser(response.data);
        setLoading(false);  // Set loading to false when data is fetched
      } catch (error) {
        console.error('Error fetching data:', error);
        setUser(null);
        setIsLoggedIn(false);
          navigate('/auth/login', { 
          replace: true,
          state: { from: location.pathname } 
        });
      }
    }
    
    useEffect(() => {
        getUserData();
    }, [isLoggedIn]);

    // Show loading indicator while data is being fetched
    if (loading) {
        return <div>Loading...</div>;
    }

    // Once data is loaded, render the appropriate dashboard
    if (user?.role === 'recruiter') {
        return <RecruiterDashboardPage />;
    } else {
        return <UserDashboardPage />;
    }
}