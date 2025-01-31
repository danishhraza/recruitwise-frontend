// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./assets/pages/Home";
import Room from "./assets/pages/Room";
import Layout from "./assets/Layout/Layout";
import { RoomProvider } from "./assets/Context/RoomContext";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route path="/" element={<Home />} />
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