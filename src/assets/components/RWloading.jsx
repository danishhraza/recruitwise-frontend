import React from "react"
import RWpt from "./RWpt";

function RWloading () {
  return (
    <div className="h-screen "> 
    <RWpt/>
    <div className="flex justify-center mt-4">
        <span class="loader"></span>
      </div>
    </div>
)
};

export default RWloading;
