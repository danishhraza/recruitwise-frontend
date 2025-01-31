import { Button, FloatButton } from "antd";
import React, { useCallback, useEffect, useRef, useState } from "react"
import Webcam from "react-webcam";
function WebcamComp () {
  const [mic,setMic] = useState(true);
  const [video,setVideo] = useState(true);
  const [micStats,setMicStats] = useState(null);
  const webcamRef = useRef(null);
  useEffect(()=>{
    console.log(webcamRef.current)
  },[mic])
  const videoConstraints = {
    width: 1000,
    height: 620,
    facingMode: "user"
  };
  const audioConstraints={
    echoCancellation: true,
    noiseCancellation:true
  }

  const toggleVideo = () => {
    if (webcamRef.current) {
      const videoTrack = webcamRef.current.stream
        ?.getVideoTracks()
        .find((track) => track.kind === "video");

      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled; // Toggle video track
        setVideo(videoTrack.enabled); // Update state
      }
    }
  };

  return (
    <>
    <div className="rounded-2xl w-full h-full bg-white p-5">
    <Webcam ref={webcamRef} muted audio={mic} videoConstraints={videoConstraints} audioConstraints={audioConstraints} />
    <Button onClick={()=>setMic(!mic)}>{mic ? "Mic On" : "Mic Off"}</Button>
    <Button onClick={()=>setMic(!mic)}>Share Screen</Button>
    <Button onClick={()=>{toggleVideo()}}>Video</Button>
    </div>
   </>
  )
};

export default WebcamComp;
