import { Outlet, useLocation, useNavigate } from "react-router-dom";
import useGeneral from "../../hooks/useGeneral";
import { useEffect, useState } from "react";
import axios from "../../api/axios";
import { DashboardHeader } from "../components/RecruiterDashboard/header"
import { DashboardSidebar } from "../components/RecruiterDashboard/sidebar"
import { UserSidebar } from "../components/UserDashboard/sidebar";
import { UserDashboardHeader } from "../components/UserDashboard/header";
import { Toaster } from "sonner";

// DashboardLayout.js
export default function DashboardLayout() {
    const { user, setUser, isLoggedIn, setIsLoggedIn } = useGeneral();
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);
  
    async function getUserData() {
      try {
        const response = await axios.get('/auth/me', { withCredentials: true });
        setUser(response.data);
        setLoading(false);
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
  
    if (loading) {
      return <div>Loading dashboard...</div>;
    }
  
    return (
      <div className="dashboard-layout selection:bg-[#65b5bf59] selection:text-[#8de0eb]">
      <div className="flex min-h-screen bg-background">
       {user?.role == "candidate" ? <UserSidebar/>: <DashboardSidebar />}
        <div className="flex-1">
          {user?.role == "candidate" ? <UserDashboardHeader/>:<DashboardHeader />}
          <Outlet /> 
          
          </div>
          </div>
          <Toaster richColors position="top-center" />
                 </div>
    );
  }
  