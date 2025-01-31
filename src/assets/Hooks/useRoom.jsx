import React, { useContext } from "react"
import RoomProvider from "../Context/RoomContext";

function useRoom () {
    const context = useContext(RoomProvider)
    return (
    <div>
      
    </div>
  )
};

export default useRoom;
