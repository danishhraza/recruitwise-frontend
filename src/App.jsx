// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./assets/pages/Home";
import Room from "./assets/pages/Room";
import { RoomProvider } from "./assets/Context/RoomContext";
import ViewJobs from "./assets/pages/ViewJobs";
import PublicLayout from "./assets/Layout/PublicLayout";
import { FiltersProvider } from "./assets/Context/FiltersContext";
import OtherLayout from "./assets/Layout/OtherLayout";
import Authorization from "./assets/pages/Authorization";
import LoginComponent from "./assets/components/LoginComponent";
import RegisterComponent from "./assets/components/RegisterComponent";
import RecruiterDashboardPage from "./assets/pages/RecruiterDashboardPage"
import JobPage from "./assets/pages/JobPage"
import { SidebarProvider } from "./components/ui/sidebar"
import UserDashboardPage from "./assets/pages/UserDashboardPage"
import ApplicationsPage from "./assets/pages/ApplicationsPage"
import SavedJobsPage from "./assets/pages/SavedJobsPage"
import DocumentsPage from "./assets/pages/DocumentsPage"
import ApplicantProfilePage from "./assets/pages/ApplicantProfilePage"

function App() {
  return (
    
    <SidebarProvider>
    <Routes>
      <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="/jobs" element={
              <FiltersProvider>
                <ViewJobs />
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
          <Route path="/auth" element={<Authorization />}>
              <Route index element={<Navigate to="/auth/login" replace />} />
                <Route path="login" element={<LoginComponent />}/>
                <Route path="register" element={<RegisterComponent/>}/>
          </Route>
          
            <Route path="/jobs/:id" element={<JobPage />} />
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