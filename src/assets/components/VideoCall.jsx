import React, { useEffect, useRef } from "react";
import { useRoom } from "../Context/RoomContext";
import { Mic, Video, PhoneOff, MonitorIcon, Settings } from "lucide-react";
import Spline from '@splinetool/react-spline';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

function VideoCall() {
  const {
    selectedMic,
    selectedVideo,
    micStream,
    cameraStream,
    deviceStates,
    setDeviceStates,
    setScreenStream,
    screenStream
  } = useRoom();

  const videoRef = useRef(null);

  // Dummy transcript data
  const transcriptData = [
    {
      speaker: "Alex",
      text: "I've been focusing on various aspects of leadership and collaboration.",
      align: "right"
    },
    {
      speaker: "RecruitWise AI",
      text: "I saw on your resume that you worked on an object detection model at Tesla. Could you walk me through what part of the model you worked on?",
      align: "left"
    },
    {
      speaker: "Alex",
      text: "Sure, so I focused on the data processing aspects of model training. For example, I built data pipelines in Python for cleaning video data.",
      align: "right"
    },
    {
      speaker: "RecruitWise AI",
      text: "Very cool! Could you walk me through how you built the data pipeline and what Python libraries you used?",
      align: "left"
    }
  ];

  // Set up video streams when component mounts or when streams change
  useEffect(() => {
    if (videoRef.current) {
      if (deviceStates.camera && cameraStream) {
        videoRef.current.srcObject = cameraStream;
      } else {
        videoRef.current.srcObject = null; // Clear stream when camera is off
      }
    }
  }, [deviceStates.camera, cameraStream]);
  
  // Device state notifications
  useEffect(() => {
    if(!deviceStates.microphone) {
      toast.error("Please unmute your microphone", {id: 'mic', duration: Infinity});
    } else {
      toast.dismiss('mic');
    }
    
    if(!deviceStates.camera) {
      toast.error("Please turn on your camera", {id: 'camera', duration: Infinity});
    } else {
      toast.dismiss('camera');
    }
  }, [deviceStates]);

  const toggleMic = () => {
    if (micStream) {
      const audioTrack = micStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setDeviceStates(prev => ({
          ...prev,
          microphone: !deviceStates.microphone
        }));
      }
    }
  };

  const toggleVideo = () => {
    if (cameraStream) {
      const videoTrack = cameraStream.getVideoTracks()[0];
  
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
  
        setDeviceStates(prev => {
          const newCameraState = !prev.camera;
  
          // If turning camera back on, ensure the video element gets the stream
          if (newCameraState && videoRef.current) {
            videoRef.current.srcObject = cameraStream;
          }
  
          return {
            ...prev,
            camera: newCameraState
          };
        });
      }
    }
  };
  
  async function shareScreen() {
    if (deviceStates.screen) {
      // Stop screen sharing
      if (screenStream) {
        screenStream.getTracks().forEach(track => track.stop());
      }
      setScreenStream(null);
      setDeviceStates(prev => ({ ...prev, screen: false }));
      toast.success("Screen sharing stopped");
    } else {
      try {
        const screenPermission = await navigator.mediaDevices.getDisplayMedia({
          video: {
            displaySurface: "monitor",
            cursor: "always"
          },
          audio: false
        });
        
        setScreenStream(screenPermission);
        setDeviceStates(prev => ({ ...prev, screen: true }));
        
        const videoTrack = screenPermission.getVideoTracks()[0];
        videoTrack.addEventListener("ended", () => {
          setScreenStream(null);
          setDeviceStates(prev => ({ ...prev, screen: false }));
          toast.info("Screen sharing stopped by user");
        });
        
      } catch (err) {
        console.error("Screen sharing error:", err);
        toast.error("Failed to start screen sharing");
      }
    }
  }
  
  return (
    <div className="flex w-full mx-auto h-screen rounded-lg overflow-hidden border bg-[#0f0f0f] border-gray-200 shadow-md">
      {/* Left side - Video */}
      <div className="relative w-5/6 border-r border-gray-500">
        {/* Main video - Replaced with Spline animation */}
        <div className="w-full h-full relative">
          <Spline scene="https://prod.spline.design/vWvFcD4O3twcVXiF/scene.splinecode" />
          <div className="absolute bottom-4 left-4 bg-black/40 text-white px-3 py-1 rounded-md">
            <span>RecruitWise AI</span>
          </div>
        </div>
        
        {/* Small user video */}
        <div className="absolute bottom-16 right-4 w-64 rounded-lg overflow-hidden border-2 border-white shadow-lg">
          {deviceStates.camera ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover bg-gray-800"
            />
          ) : (
            <div className="w-full h-48 flex items-center justify-center">
              <span className="text-white">Camera Off</span>
            </div>
          )}
          <div className="absolute bottom-0 left-0 bg-black/40 text-white px-3 py-1 rounded-tr-md">
            <span>Alex</span>
          </div>
        </div>
        
        {/* Controls at bottom */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-center p-4 bg-gradient-to-t from-black/50 to-transparent">
          <div className="flex space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="rounded-full w-12 h-12 bg-gray-700 hover:bg-gray-600 border-0"
                    onClick={toggleMic}
                  >
                    <Mic className={`h-6 w-6 ${deviceStates.microphone ? 'text-white' : 'text-gray-400'}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle Microphone</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="rounded-full w-12 h-12 bg-gray-700 hover:bg-gray-600 border-0"
                    onClick={toggleVideo}
                  >
                    <Video className={`h-6 w-6 ${deviceStates.camera ? 'text-white' : 'text-gray-400'}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Toggle Camera</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="rounded-full w-12 h-12 bg-gray-700 hover:bg-gray-600 border-0"
                    onClick={shareScreen}
                  >
                    <MonitorIcon className={`h-6 w-6 ${deviceStates.screen ? 'text-white' : 'text-gray-400'}`} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share Screen</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="rounded-full w-12 h-12"
                  >
                    <PhoneOff className="h-6 w-6" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>End Call</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
      
      {/* Right side - Transcript */}
      <div className="w-1/3 flex flex-col h-full rounded-lg bg-[#131313]">
        <div className="p-4 border-b border-gray-500">
          <h2 className="font-semibold text-white">Live Transcript</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {transcriptData.map((message, index) => (
            <div key={index} className={`flex flex-col ${message.align === 'right' ? 'items-end' : 'items-start'}`}>
              <div className="mb-1">
                {message.align === 'right' && <span className="text-sm text-gray-200 text-right">{message.speaker}</span>}
                {message.align === 'left' && <span className="text-sm text-gray-200">{message.speaker}</span>}
              </div>
              
              <div 
                className={`max-w-xs rounded-lg p-3 ${
                  message.align === 'right' 
                    ? 'bg-blue-500 text-white rounded-br-none' 
                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                }`}
              >
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default VideoCall;