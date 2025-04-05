import React from "react"
import { Outlet } from "react-router-dom";
import { Toaster } from "../../components/ui/sonner";


function OtherLayout () {
  return (
    <div className="w-full h-screen text-white">
        <Outlet/>
     {/* <Toaster expand richColors position="top-center"/>  */}
    </div>
  )
};

export default OtherLayout;
