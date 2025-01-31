import React from "react"
import CheckDevices from './CheckDevices';
import { useRoom } from "../Context/RoomContext";
import VideoCall from "../components/VideoCall";

function Room () {
    const { stage } = useRoom();
  return (
    <div>
    {stage === 'checkDevices' && <CheckDevices />}
    {stage === 'call' && <VideoCall />}
  </div>
  )
};

export default Room;
