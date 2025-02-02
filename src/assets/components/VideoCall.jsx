import React, { useEffect, useRef } from "react"
import Webcam from "react-webcam";
import { useRoom } from "../Context/RoomContext";
import { Button, ConfigProvider, Space} from "antd";
import { MicIcon, MicOff, PhoneCallIcon, PhoneOffIcon, ScreenShareIcon, SettingsIcon, VideoIcon } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../../components/ui/tooltip"
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
        
        if(!deviceStates.screen) {
            toast.error("Please re-share your monitor screen", {id: 'screen', duration: Infinity});
        } else {
            toast.dismiss('screen');
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
                        displaySurface: "monitor", // Forces entire screen selection
                        cursor: "always"
                    },
                    audio: false
                });
    
                const videoTrack = screenPermission.getVideoTracks()[0];
                const settings = videoTrack.getSettings();
    
                if (settings.displaySurface !== "monitor") {
                    screenPermission.getTracks().forEach(track => track.stop());
                    throw new Error("Please select the entire screen");
                }
    
                setScreenStream(screenPermission);
                setDeviceStates(prev => ({ ...prev, screen: true }));
    
                // Handle when user stops screen sharing manually
                videoTrack.addEventListener("ended", () => {
                    setScreenStream(null);
                    setDeviceStates(prev => ({ ...prev, screen: false }));
                    toast.info("Screen sharing stopped by user");
                });
    
                toast.dismiss("screen-share");
            } catch (err) {
                setDeviceStates(prev => ({ ...prev, screen: false }));
                toast.error("Failed to start screen sharing. Please share your entire screen.", { duration: Infinity, id: "screen-share" });
                console.error("Screen sharing error:", err);
            }
        }
    }
    

    return (
        <div className="w-full h-screen flex justify-center items-center">
            <div className="relative flex justify-center">
                <div className="retlative w-[1600px] h-[900px] bg-slate-400 content-center rounded-3xl">
                    <div className="rounded-full place-self-center content-center text-center w-[250px] h-[250px] bg-slate-950">
                        <h2 className="text-white text-[6rem]">AI</h2>
                    </div>
                    {/* <Webcam videoConstraints={videoConstraints} className="rounded-2xl bottom-2 right-2 w-[300px] absolute"/>
                     */}
                        
                        { deviceStates.camera ? <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        className="rounded-2xl bottom-2 right-2 w-[300px] absolute"
                    /> : <div className="rounded-2xl bottom-2 right-2 w-[300px] h-[240px] absolute bg-slate-950">
                        <h2 className="text-white text-[2rem] text-center">Camera Off</h2>
                        </div>}
                </div>
                <div className="absolute bottom-5 bg-slate-900 h-[80px] rounded-xl">
                    <ConfigProvider theme={{
                        token:{
                            controlHeight:'85px'
                        }
                    }}>
                        <TooltipProvider>
                            <Space.Compact>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Button 
                                            onClick={toggleMic} 
                                            icon={deviceStates.microphone ? <MicIcon color="white" size={'40px'}/> : <MicOff color="white" size={'40px'}/>} 
                                            size="large" 
                                            color="none" 
                                            variant="text"
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Toggle Mic
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Button 
                                            onClick={toggleVideo} 
                                            icon={deviceStates.camera ? <VideoIcon color="white" size={'40px'}/> : <VideoIcon color="gray" size={'40px'}/>} 
                                            size="large" 
                                            color="none" 
                                            variant="text"
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Toggle Video
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Button 
                                            onClick={shareScreen}
                                            icon={<ScreenShareIcon color={deviceStates.screen ? "white" : "gray"} size={'40px'}/>} 
                                            size="large" 
                                            color="none" 
                                            variant="text"
                                        />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Toggle Screen Share
                                    </TooltipContent>
                                </Tooltip>
                            </Space.Compact>
                            <Space.Compact>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Button icon={<SettingsIcon color="black" size={'40px'}/>} size="large" color="grey" variant="outlined"/>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        Settings
                                    </TooltipContent>
                                </Tooltip>
                                <Tooltip>
                                    <TooltipTrigger>
                                        <Button icon={<PhoneOffIcon color="white" size={'40px'}/>} size="large" color="danger" variant="solid"/>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        End Call
                                    </TooltipContent>
                                </Tooltip>
                            </Space.Compact>
                        </TooltipProvider>
                    </ConfigProvider>
                </div>
            </div>
        </div>
    )
}

export default VideoCall;