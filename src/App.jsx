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
function App() {
  return (
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
        </Route>
    </Routes>
  );
}

export default App;