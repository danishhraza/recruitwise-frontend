// src/App.jsx
import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import Home from "./assets/pages/Home";
import Room from "./assets/pages/Room";
import { RoomProvider } from "./assets/Context/RoomContext";
import PublicLayout from "./assets/Layout/PublicLayout";
import DarkHomeLayout from "./assets/Layout/DarkHomeLayout";
import { FiltersProvider } from "./assets/Context/FiltersContext";
import OtherLayout from "./assets/Layout/OtherLayout";
import JobPage from "./assets/pages/JobPage"
import { SidebarProvider } from "./components/ui/sidebar"
import ApplicationsPage from "./assets/pages/ApplicationsPage"
import ApplicantProfilePage from "./assets/pages/ApplicantProfilePage"
import axios from "./api/axios";
import useGeneral from "./hooks/useGeneral";
import LoginPage from "./assets/pages/login-page";
import RecruiterLoginPage from "./assets/pages/recruiter-login-page";
import RegisterPage from "./assets/pages/register-page";
import JobDetailPage from "./assets/pages/JobDetailPage";
import JobListingPage from "./assets/pages/ViewJobs";
import AddCompanyPage from "./assets/components/AddCompany";
import DashboardPage from "./assets/components/Dashboard";
import DashboardLayout from "./assets/Layout/DashboardLayout";
import ProtectedUserRoute from "./assets/Routes/ProtectedUserRoute";
import ProtectedRecruiterRoute from "./assets/Routes/ProtectedRecruiterRoute";
import ProtectedAdminRoute from "./assets/Routes/ProtectedAdminRoute";
import ManageRecruiters  from "./assets/components/RecruiterDashboard/manage-recruiters";
import { ThemeProvider } from "@/assets/components/theme-provider";
import AccessibilityFloatButton, { AccessibilityProvider } from "@/assets/components/AccessibilityFloatButton";


function App() {
    const {isLoggedIn,setIsLoggedIn,user,setUser} = useGeneral()
    useEffect(() => {
      console.log("user auth check")
      async function fetchData() {
        try {
          const response = await axios.get('/auth/me',{withCredentials:true});
          setIsLoggedIn(true)
          setUser(response.data)
          console.log("/auth/me returns ", response)
      } catch (error) {
          console.error('Error fetching data:', error);
          setUser(null)
          setIsLoggedIn(false)
      }
      }
    
      fetchData()
    
    }  , []);
  

    const UnauthenticatedRoute = ({ children }) => {
      const { isLoggedIn } = useGeneral();
      const navigate = useNavigate();
      const location = useLocation();
    
      useEffect(() => {
        if (isLoggedIn) {
          const from = location.state?.from || "/";
          navigate(from, { replace: true });
        }
      }, [isLoggedIn, navigate, location]);
    
      if (isLoggedIn) {
        return null; // Prevent rendering while navigating
      }
    
      return children;
    };
  

  return (
    <ThemeProvider defaultTheme="dark">
      <AccessibilityProvider>
        <SidebarProvider>
          <Routes>
              {/* Dark Home Layout - Only for the home page */}
              <Route path="/" element={<DarkHomeLayout />}>
                <Route index element={<Home />} />
              </Route>

              {/* Public Layout - For other public pages */}
              <Route path="/" element={<PublicLayout />}>
                <Route path="/jobs" element={
                  <FiltersProvider>
                    <JobListingPage />
                  </FiltersProvider>
                } />
                <Route path="/jobs/:jobId" element={
                  <FiltersProvider>
                    <JobDetailPage />
                  </FiltersProvider>
                } />
              </Route>

            <Route path="/" element={<OtherLayout />}>
                <Route 
                    path="/interview/:roomid" 
                    element={
                      <RoomProvider>
                        <Room />
                      </RoomProvider>
                    }
                />
                <Route path="/auth" >
                    <Route index element={<Navigate to="/auth/login" replace />} />
                      <Route path="login" element={
                         <UnauthenticatedRoute>
                          <LoginPage />
                         </UnauthenticatedRoute>
                      }/>
                      <Route path="register" element={
                         <UnauthenticatedRoute>
                          <RegisterPage/>
                         </UnauthenticatedRoute>
                      }/>
                        <Route path="recruiter-login" element={
                         <UnauthenticatedRoute>
                          <RecruiterLoginPage/>
                         </UnauthenticatedRoute>
                      }/>
                </Route>

                  <Route path="/dashboard" element={<DashboardLayout />}>
                      <Route index element={<DashboardPage />} />
                      {/* User Routes */}
                      <Route element={<ProtectedUserRoute />}>
                        <Route path="jobs" element={<ApplicationsPage />} />
                      </Route>
                      {/* Recruiter Routes */}
                      <Route element={<ProtectedRecruiterRoute />}>
                        <Route path="/dashboard/:jobId" element={<JobPage />} />
                        <Route path="/dashboard/:jobId/:applicantId" element={<ApplicantProfilePage />} />
                        <Route path="/dashboard/manage-recruiters" element={<ManageRecruiters />} />
                      </Route>
                   </Route>
                   <Route element={<ProtectedAdminRoute />}>
                   <Route path="/add-company" element={<AddCompanyPage />} />
                   </Route>

            </Route>

          </Routes>
          {/* Accessibility Float Button */}
          <AccessibilityFloatButton />
        </SidebarProvider>
      </AccessibilityProvider>
    </ThemeProvider>
  );
}

export default App;