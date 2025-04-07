// src/App.jsx
import React, { useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import Home from "./assets/pages/Home";
import Room from "./assets/pages/Room";
import { RoomProvider } from "./assets/Context/RoomContext";
import ViewJobs from "./assets/pages/ViewJobs";
import PublicLayout from "./assets/Layout/PublicLayout";
import DarkHomeLayout from "./assets/Layout/DarkHomeLayout";
import { FiltersProvider } from "./assets/Context/FiltersContext";
import OtherLayout from "./assets/Layout/OtherLayout";
import RegisterComponent from "./assets/components/RegisterComponent";
import RecruiterDashboardPage from "./assets/pages/RecruiterDashboardPage"
import JobPage from "./assets/pages/JobPage"
import { SidebarProvider } from "./components/ui/sidebar"
import UserDashboardPage from "./assets/pages/UserDashboardPage"
import ApplicationsPage from "./assets/pages/ApplicationsPage"
import SavedJobsPage from "./assets/pages/SavedJobsPage"
import DocumentsPage from "./assets/pages/DocumentsPage"
import ApplicantProfilePage from "./assets/pages/ApplicantProfilePage"
import axios from "./api/axios";
import useGeneral from "./hooks/useGeneral";
import LoginPage from "./assets/pages/login-page";
import RegisterPage from "./assets/pages/register-page";
// import JobListingPage from "./assets/pages/ViewJobs";
import JobDetailPage from "./assets/pages/JobDetailPage";
import JobListing from "./assets/components/JobListingPage";
import JobListingPage from "./assets/pages/ViewJobs";


function App() {
    const {isLoggedIn,setIsLoggedIn,user,setUser} = useGeneral()
    useEffect(() => {
      console.log("user auth check")
      async function fetchData() {
        try {
          const response = await axios.get('/auth/me',{withCredentials:true});
          setIsLoggedIn(true)
          setUser(response.data)
          console.log(response.data)
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
    
    <SidebarProvider>
    <Routes>
        {/* Dark Home Layout - Only for the home page */}
        <Route path="/" element={<DarkHomeLayout />}>
          <Route index element={<Home />} />
        </Route>

        {/* Public Layout - For other public pages */}
        // Routes structure
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
              path="/room/:roomid" 
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
          </Route>
          
            {/* <Route path="/jobs/:id" element={<JobPage />} /> */}
            <Route path="/recruiter-dashboard" element={<RecruiterDashboardPage />} />
            <Route path="/applicants/:id" element={<ApplicantProfilePage />} />

            {/* User Dashboard Routes */}
            <Route path="/user-dashboard" element={<UserDashboardPage />} />
            <Route path="/user-dashboard/applications" element={<ApplicationsPage />} />
            <Route path="/user-dashboard/saved-jobs" element={<SavedJobsPage />} />
            <Route path="/user-dashboard/documents" element={<DocumentsPage />} />
         
      </Route>


    </Routes>
    </SidebarProvider>
    
  );
}

export default App;