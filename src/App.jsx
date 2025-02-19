// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./assets/pages/Home";
import Room from "./assets/pages/Room";
import JobLayout from "./assets/Layout/JobLayout";
import { RoomProvider } from "./assets/Context/RoomContext";
import ViewJobs from "./assets/pages/ViewJobs";
import PublicLayout from "./assets/Layout/PublicLayout";
import { FiltersProvider } from "./assets/Context/FiltersContext";
function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        
        <Route path="/jobs" element={
          <FiltersProvider>
            <ViewJobs />
        </FiltersProvider>
            } />
        <Route 
          path="/room/:roomid" 
          element={
            <RoomProvider>
              <Room />
            </RoomProvider>
          }
        />
      </Route>
    </Routes>
  );
}

export default App;