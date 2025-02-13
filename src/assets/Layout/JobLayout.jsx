import React from "react"
import { Outlet } from "react-router-dom";
import { Toaster } from "../../components/ui/sonner";


function JobLayout () {
  return (
    <>
        <Outlet/>
     <Toaster expand richColors position="top-center"/> 
    </>
  )
};

export default JobLayout;
