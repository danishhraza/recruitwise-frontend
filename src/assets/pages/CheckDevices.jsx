import { Button, ConfigProvider, Dropdown, Slider, Space, Typography, Switch } from "antd";
import { DownOutlined } from '@ant-design/icons';
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { CheckCircle, AlertTriangle } from "lucide-react";
import { useRoom } from "../Context/RoomContext";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function CheckDevices({ roomId, socket }) {
    const {
        setStage,
        deviceStates,
        setDeviceStates,
        audioInputDevices,
        setAudioInputDevices,
        videoInputDevices,
        setVideoInputDevices,
        audioOutputDevices,
        setAudioOutputDevices,
        selectedMic,
        setSelectedMic,
        selectedVideo,
        setSelectedVideo,
        testAudio,
        setTestAudio,
        isLoading,
        setIsLoading,
        screenStream,
        setScreenStream,
        cameraStream,
        setCameraStream,
        setMicStream
    } = useRoom();
    
    const [isMultiScreenDetected, setIsMultiScreenDetected] = useState(false);
    // State for bypass toggle
    const [bypassMultiScreenCheck, setBypassMultiScreenCheck] = useState(false);
    // State for join call loading
    const [isJoining, setIsJoining] = useState(false);

    // Audio Visualizer
    const [micLevel, setMicLevel] = useState(0);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const dataArrayRef = useRef(null);
    const sourceRef = useRef(null);
    const videoRef = useRef(null);

    // Screen Detection using window.screen.isExtended
    const detectScreens = () => {
        // Use window.screen.isExtended for more reliable multi-screen detection
        // It returns true if the display spans across multiple screens.
        const isMultiScreen = window.screen.isExtended;

        // Log for debugging
        console.log("Multi-screen detected (isExtended):", isMultiScreen);

        setIsMultiScreenDetected(isMultiScreen);
        return isMultiScreen;
    };

    // Detect screens on component mount and add listener for changes
    useEffect(() => {
        detectScreens(); // Initial check

        const handleScreenChange = () => {
           detectScreens();
        };

        // While there isn't a standard direct 'change' event for isExtended,
        // listening to resize might catch some scenarios where screen setup changes.
        window.addEventListener('resize', handleScreenChange);

        return () => {
            window.removeEventListener('resize', handleScreenChange);
        };
    }, []);

const startCamera = async () => {
  // Ensure a video device is selected
  if (!selectedVideo || !selectedVideo.key) {
    console.log("No video device selected yet.");
    return;
  }

  try {
    console.log(`Starting camera with device ID: ${selectedVideo.key}`);
    
    // Stop any existing streams first
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
    }
    
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: { exact: selectedVideo.key }
      }
    });
    
    // Set the camera stream in context
    setCameraStream(stream);
    
    // Update device state
    setDeviceStates(prev => ({ ...prev, camera: true }));
    
    // Connect to video element if available
    if (videoRef.current) {
      console.log("Setting video source to new camera stream");
      videoRef.current.srcObject = stream;
    } else {
      console.warn("Video element reference not available yet");
    }
  } catch (err) {
    console.error("Error starting camera:", err);
    
    // Try with less strict constraints
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          deviceId: { ideal: selectedVideo.key }
        }
      });
      
      setCameraStream(stream);
      setDeviceStates(prev => ({ ...prev, camera: true }));
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (retryErr) {
      console.error("Failed to access camera:", retryErr);
      setCameraStream(null);
      setDeviceStates(prev => ({ ...prev, camera: false }));
      toast.error("Failed to access camera. Please check permissions or try another camera.");
    }
  }
};

    // Restart camera when selected video device changes
useEffect(() => {
  if (selectedVideo?.key) {
    startCamera();
  }
  
  // Cleanup function
  return () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
      setCameraStream(null);
    }
  };
}, [selectedVideo]);

useEffect(() => {
  // This effect runs whenever cameraStream changes or videoRef.current becomes available
  if (cameraStream && videoRef.current) {
    console.log("Connecting camera stream to video element reference");
    videoRef.current.srcObject = cameraStream;
    
    // Sometimes the video doesn't play automatically
    videoRef.current.play().catch(err => {
      console.warn("Error auto-playing video:", err);
    });
  }
}, [cameraStream]);


    // Device enumeration and initialization
    useEffect(() => {
      const checkDevicePermissions = async () => {
          toast.loading("Checking for microphone and camera permissions", {
              duration: Infinity,
              id: 'permission-check'
          });

          try {
              // Request permissions first to ensure labels are available
await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
      .catch(err => {
        console.warn("Initial permission request failed or was denied:", err.name);
        if (err.name === 'NotAllowedError' || err.name === 'NotFoundError') {
          toast.error("Device permissions denied or no devices found. Please allow access and ensure devices are connected.", { duration: 5000 });
          setDeviceStates(prev => ({ ...prev, microphone: false, camera: false }));
        }
      });

    const devices = await navigator.mediaDevices.enumerateDevices();

    // Handle video devices
    const videos = devices
      .filter((device) => device.kind === "videoinput")
      .map((device) => ({ key: device.deviceId, label: device.label || `Camera ${videoInputDevices.length + 1}` }));
          
    setVideoInputDevices(videos);
              
      if (videos.length > 0 && (!selectedVideo || !selectedVideo.key)) {
  setSelectedVideo(videos[0]);
  // Call startCamera directly after a short timeout to ensure DOM is ready
  setTimeout(() => {
    if (videos[0].key) {
      console.log("Initializing default camera after permissions check");
      startCamera();
    }
  }, 100);
} else if (videos.length === 0) {
  setDeviceStates(prev => ({ ...prev, camera: false }));
}

              // Handle audio input devices
              const microphones = devices
                  .filter((device) => device.kind === "audioinput")
                  .map((device) => ({ key: device.deviceId, label: device.label || `Microphone ${audioInputDevices.length + 1}` }));
                  
              setAudioInputDevices(microphones);
              
              if (microphones.length > 0 && (!selectedMic || !selectedMic.key)) {
                  const defaultMic = microphones.find(device => device.key === "default") || microphones[0];
                  setSelectedMic(defaultMic);

                  // Initialize microphone stream
                  try {
                      const micStream = await navigator.mediaDevices.getUserMedia({
                          audio: { deviceId: { exact: defaultMic.key } }
                      });
                      setMicStream(micStream);
                      setDeviceStates(prev => ({ ...prev, microphone: true }));
                  } catch (micErr) {
                      console.error("Error accessing default microphone:", micErr);
                      setDeviceStates(prev => ({ ...prev, microphone: false }));
                      toast.error("Failed to access microphone. Please check permissions.");
                  }
              } else if (microphones.length === 0) {
                  setDeviceStates(prev => ({ ...prev, microphone: false }));
              }

              // Handle audio output devices
              const speakers = devices
                .filter((device) => device.kind === "audiooutput")
                .map((device) => ({ key: device.deviceId, label: device.label || `Speaker ${audioOutputDevices.length + 1}` }));
                    
              setAudioOutputDevices(speakers);

          } catch (err) {
              console.error("Error during device initialization:", err);
              
              if (err.name === 'NotAllowedError') {
                  toast.error("Device permissions denied. Please allow access to proceed.");
                  setDeviceStates(prev => ({ ...prev, microphone: false, camera: false }));
              } else {
                  toast.error("An error occurred while checking devices.");
              }
          } finally {
              toast.dismiss('permission-check');
          }
      };

      checkDevicePermissions();

      // Listen for device changes
      navigator.mediaDevices.addEventListener('devicechange', checkDevicePermissions);
      
      return () => {
          navigator.mediaDevices.removeEventListener('devicechange', checkDevicePermissions);
          
          if (cameraStream) {
              cameraStream.getTracks().forEach(track => track.stop());
          }
           
          if (screenStream) {
              screenStream.getTracks().forEach(track => track.stop());
          }
           
          if (audioContextRef.current) {
              audioContextRef.current.close().catch(err => console.error("Error closing audio context:", err));
          }
      };
    }, []);

    // Setup microphone audio visualizer
    useEffect(() => {
        let animationFrameId;
        let currentStream;

        async function setupMicrophone() {
          if (!testAudio || !selectedMic?.key) return;

          // Close existing audio context if any
          if (audioContextRef.current) {
            await audioContextRef.current.close().catch(err => console.error("Error closing audio context:", err));
            audioContextRef.current = null;
            sourceRef.current = null;
          }

          try {
            currentStream = await navigator.mediaDevices.getUserMedia({
              audio: { deviceId: { exact: selectedMic.key } }
            });

            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            analyserRef.current = audioContextRef.current.createAnalyser();
            analyserRef.current.fftSize = 256;

            sourceRef.current = audioContextRef.current.createMediaStreamSource(currentStream);
            sourceRef.current.connect(analyserRef.current);

            dataArrayRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);

            updateMicLevel();
          } catch (error) {
            console.error("Error accessing microphone for visualizer:", error);
            toast.error("Could not access selected microphone for testing.");
            setTestAudio(false);
          }
        }

        function updateMicLevel() {
          if (!analyserRef.current || !testAudio) {
             setMicLevel(0);
             return;
          }

          analyserRef.current.getByteFrequencyData(dataArrayRef.current);
          
          let sum = 0;
          for (let i = 0; i < dataArrayRef.current.length; i++) {
              sum += dataArrayRef.current[i];
          }
          const average = sum / dataArrayRef.current.length;
          setMicLevel(Math.min(100, average * 1.5));

          animationFrameId = requestAnimationFrame(updateMicLevel);
        }

        if (testAudio) {
            setupMicrophone();
        } else {
            // Cleanup when testAudio becomes false
            if (audioContextRef.current) {
                audioContextRef.current.close().catch(e => console.error("Error closing audio context:", e));
                audioContextRef.current = null;
            }
            if (currentStream) {
                currentStream.getTracks().forEach(track => track.stop());
            }
            if (sourceRef.current) {
                sourceRef.current.disconnect();
                sourceRef.current = null;
            }
            cancelAnimationFrame(animationFrameId);
            setMicLevel(0);
        }

        // Cleanup
        return () => {
          cancelAnimationFrame(animationFrameId);
          if (audioContextRef.current) {
            audioContextRef.current.close().catch(e => console.error("Error closing audio context on unmount:", e));
          }
          if (currentStream) {
              currentStream.getTracks().forEach(track => track.stop());
          }
          if (sourceRef.current) {
              sourceRef.current.disconnect();
          }
        };
      }, [testAudio, selectedMic]);

  // Share screen function
  async function shareScreen() {
    if (deviceStates.screen) {
      // If already sharing, stop sharing
      if (screenStream) {
        screenStream.getTracks().forEach(track => track.stop());
      }
      setScreenStream(null);
      setDeviceStates(prev => ({ ...prev, screen: false }));
      toast.info("Screen sharing stopped.");
      return;
    }

    // Check for multiple screens - skip if bypass is enabled
    const hasMultipleScreens = detectScreens();
    if (hasMultipleScreens && !bypassMultiScreenCheck) {
        toast.error("Multiple screens detected. Please disconnect extra screens to continue or use the bypass toggle.", {
            id: 'multiple-screens-error',
            duration: 5000,
        });
        return;
    }

    try {
      setIsLoading(true);
      toast.loading("Requesting screen share access...", { id: 'screen-share-request', duration: Infinity });

      const screenPermission = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: "monitor",
          cursor: 'always'
        },
        audio: false
      });

      toast.dismiss('screen-share-request');

      // Check if the user shared the whole screen
      const videoTrack = screenPermission.getVideoTracks()[0];
      const settings = videoTrack.getSettings();

      if (settings.displaySurface !== "monitor") {
          videoTrack.stop();
          toast.error("Please share your entire screen, not just a window or tab.", { duration: 5000, id: 'screen-share-error' });
          throw new Error("User did not select entire screen");
      }

      // Handle browser stop button
      videoTrack.addEventListener('ended', () => {
        setDeviceStates(prev => ({ ...prev, screen: false }));
        setScreenStream(null);
        toast.info("Screen sharing stopped.");
      }, { once: true });

      // Set screen stream
      setScreenStream(screenPermission);
      setDeviceStates(prev => ({ ...prev, screen: true }));
      toast.success("Screen sharing started successfully!", { duration: 3000 });

    } catch (err) {
      toast.dismiss('screen-share-request');
      console.error("Screen share error:", err);

      if (err.name === 'NotAllowedError') {
        toast.error("Screen share permission denied.", { duration: 5000, id: 'screen-share-error' });
      } else if (err.message !== "User did not select entire screen") {
          toast.error("Could not start screen sharing.", { duration: 5000, id: 'screen-share-error' });
      }

      setDeviceStates(prev => ({ ...prev, screen: false }));
      setScreenStream(null);

    } finally {
      setIsLoading(false);
    }
  }

  // Join Call button click handler
  const handleJoinCall = () => {
    // Check if socket is available
    if (!socket || !socket.connected) {
      toast.error("Connection not established. Please refresh the page and try again.", { 
        id: 'socket-error', 
        duration: 4000 
      });
      return;
    }

    // Final check for multiple screens - skip if bypass is enabled
    const hasMultipleScreens = detectScreens();
    if (hasMultipleScreens && !bypassMultiScreenCheck) {
      toast.error("Multiple screens detected. Please disconnect extra screens before joining or use the bypass toggle.", {
        id: 'multiple-screens-join-error',
        duration: 5000,
      });
      return;
    }

    // Check if screen is shared
    if (!deviceStates.screen) {
       toast.error("Please share your screen before joining.", { duration: 4000, id: 'join-call-error' });
       return;
    }

    // Check camera and microphone
    if (!deviceStates.camera || !deviceStates.microphone) {
       toast.error("Please ensure your camera and microphone are working and selected.", { duration: 4000, id: 'join-call-error' });
       return;
    }

    // Set joining state
    setIsJoining(true);
    toast.loading("Joining interview...", { id: 'joining-interview', duration: Infinity });

    // Emit joinInterview event
    socket.emit('joinInterview', roomId, (response) => {
      toast.dismiss('joining-interview');
      setIsJoining(false);
      
      if (response && response.status === 'joined') {
        toast.success("Successfully joined the interview!", { duration: 3000 });
        setStage('call');
      } else {
        toast.error(response?.message || "Failed to join interview. Please try again.", {
          id: 'join-error',
          duration: 5000
        });
      }
    });

    // Add timeout for response
    const timeout = setTimeout(() => {
      if (socket) {
        socket.off('joinInterviewResponse');
      }
      setIsJoining(false);
      toast.dismiss('joining-interview');
      toast.error("Connection timed out. Please try again.", { 
        id: 'timeout-error', 
        duration: 5000 
      });
    }, 10000); // 10 second timeout

    // Clean up timeout if response received
    if (socket) {
      socket.once('joinInterviewResponse', () => clearTimeout(timeout));
    }
  };

  // Dropdown Handlers
  function handleMicClick(e){
      const selected = audioInputDevices.find(device => device.key === e.key);
      if (selected) {
        console.log("Selected Mic:", selected);
        if (setMicStream) {
          setMicStream(stream => {
            if (stream) {
              stream.getTracks().forEach(track => track.stop());
            }
            return null;
          });
        }
        setSelectedMic(selected);
      }
  }

function handleVideoClick(e) {
  const selected = videoInputDevices.find(device => device.key === e.key);
  if (selected) {
    console.log("Selected Video:", selected);
    
    // Stop any existing camera stream first
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
    }
    
    // Update the selected video
    setSelectedVideo(selected);
    
  }
}

// async function initializeCamera(deviceId) {
//   try {
//     console.log(`Initializing camera with device ID: ${deviceId}`);
    
//     const stream = await navigator.mediaDevices.getUserMedia({
//       video: {
//         deviceId: deviceId ? { exact: deviceId } : undefined,
//       }
//     });
    
//     // Verify stream has active video tracks
//     const videoTracks = stream.getVideoTracks();
//     if (videoTracks.length === 0) {
//       throw new Error("No video tracks found in the stream");
//     }
    
//     console.log("Camera initialized successfully with device:", videoTracks[0].label);
    
//     // Update the camera stream in context
//     setCameraStream(stream);
    
//     // Set device state to true
//     setDeviceStates(prev => ({ ...prev, camera: true }));
    
//     // Update video preview
//     if (videoRef.current) {
//       videoRef.current.srcObject = stream;
//     }
    
//   } catch (err) {
//     console.error(`Error initializing camera with device ID ${deviceId}:`, err);
    
//     // Try with less strict constraints
//     try {
//       console.log("Retrying with less strict constraints...");
//       const stream = await navigator.mediaDevices.getUserMedia({
//         video: {
//           deviceId: deviceId ? { ideal: deviceId } : undefined,
//         }
//       });
      
//       console.log("Camera initialized with less strict constraints");
//       setCameraStream(stream);
//       setDeviceStates(prev => ({ ...prev, camera: true }));
      
//       if (videoRef.current) {
//         videoRef.current.srcObject = stream;
//       }
      
//     } catch (retryErr) {
//       console.error("Second attempt failed:", retryErr);
//       setCameraStream(null);
//       setDeviceStates(prev => ({ ...prev, camera: false }));
//       toast.error("Failed to access camera. Please check permissions or try another camera.");
//     }
//   }
// }

  // Handle bypass toggle change
  const handleBypassToggleChange = (checked) => {
    setBypassMultiScreenCheck(checked);
    if (checked && isMultiScreenDetected) {
        toast.warning("Multiple screen restriction bypassed. This may affect call quality.", {
        id: 'bypass-warning',
        duration: 4000,
    });
    }
  };

  // Check if ready to join
  const areAllDevicesReady = deviceStates.microphone && 
    deviceStates.camera && 
    deviceStates.screen && 
    (!isMultiScreenDetected || bypassMultiScreenCheck);

  return (
      <>
    <div className="h-screen md:flex justify-center items-center bg-background hidden p-4">
      <div className="w-full max-w-[1000px] p-6 rounded-lg flex flex-col md:flex-row gap-6 bg-[#1f42aa] text-slate-200">
            {/* Video Preview Area */}
             <div className="flex-shrink-0 w-[600px] bg-black rounded-lg flex items-center justify-center overflow-hidden">
                {selectedVideo?.key && deviceStates.camera ? (
                     <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="text-slate-400">Camera off or not selected</div>
                )}
            </div>

            {/* Controls and Checklist Area */}
            <div id="checklist" className="outfit-400 text-sm flex flex-col justify-between gap-4 flex-grow">

                {/* Multi-screen Alert */}
                {isMultiScreenDetected && !bypassMultiScreenCheck && (
                    <Alert variant="destructive" className="mb-2 bg-[#7e0f0f] text-slate-100">
                        <AlertTitle>Multiple Screens Detected</AlertTitle>
                        <AlertDescription className="text-slate-200">
                            Please disconnect other screens before joining the call or enable the bypass toggle below.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Multi-screen Bypass Warning */}
                {isMultiScreenDetected && bypassMultiScreenCheck && (
                    <Alert className="mb-2 bg-[#f59e0b] text-slate-100">
                        <AlertTitle className="flex items-center gap-2">
                            <AlertTriangle size={16} />
                            Multiple Screens Bypass Enabled
                        </AlertTitle>
                        <AlertDescription className="text-slate-200">
                            You've chosen to bypass the multi-screen restriction. This may affect call quality.
                        </AlertDescription>
                    </Alert>
                )}

                {/* Microphone Selection & Test */}
                <div className="flex flex-col gap-2">
                    <label className="text-base font-semibold">Microphone</label>
                    <Dropdown
                        menu={{
                            items: audioInputDevices.length > 0 ? audioInputDevices : [{ key: 'none', label: 'No microphones found', disabled: true }],
                            selectable: true,
                            selectedKeys: selectedMic?.key ? [selectedMic.key] : [],
                            onClick: handleMicClick,
                        }}
                        disabled={audioInputDevices.length === 0 || (isMultiScreenDetected && !bypassMultiScreenCheck)}
                    >
                        <Typography.Link className={`flex justify-between items-center p-2 rounded ${audioInputDevices.length === 0 || (isMultiScreenDetected && !bypassMultiScreenCheck) ? 'text-gray-500 cursor-not-allowed' : 'bg-black bg-opacity-20 hover:bg-opacity-30'}`}>
                        <Space>
                            {selectedMic?.label || (audioInputDevices.length === 0 ? 'No microphones found' : 'Select Microphone')}
                        </Space>
                        <DownOutlined />
                        </Typography.Link>
                    </Dropdown>
                    <div className="flex items-center gap-2 mt-1">
                        <ConfigProvider theme={{ components: { Slider: { railSize: 8, trackBg: "#1677ff", handleSize: 14 } } }}>
                            <Slider
                                value={micLevel}
                                disabled={!testAudio || (isMultiScreenDetected && !bypassMultiScreenCheck)}
                                className="w-full"
                                tooltip={{ open: false }}
                            />
                        </ConfigProvider>
                        <Button
                            className="bg-black border-none text-white text-xs px-3 py-1"
                            onClick={() => setTestAudio(!testAudio)}
                            disabled={!selectedMic?.key || (isMultiScreenDetected && !bypassMultiScreenCheck)}
                        >
                            {testAudio ? 'Stop' : 'Test Mic'}
                        </Button>
                    </div>
                </div>

                {/* Camera Selection */}
                <div className="flex flex-col gap-2">
                    <label className="text-base font-semibold">Camera</label>
                    <Dropdown
                        menu={{
                            items: videoInputDevices.length > 0 ? videoInputDevices : [{ key: 'none', label: 'No cameras found', disabled: true }],
                            selectable: true,
                            selectedKeys: selectedVideo?.key ? [selectedVideo.key] : [],
                            onClick: handleVideoClick,
                        }}
                        disabled={videoInputDevices.length === 0 || (isMultiScreenDetected && !bypassMultiScreenCheck)}
                    >
                       <Typography.Link className={`flex justify-between items-center p-2 rounded ${videoInputDevices.length === 0 || (isMultiScreenDetected && !bypassMultiScreenCheck) ? 'text-gray-500 cursor-not-allowed' : 'bg-black bg-opacity-20 hover:bg-opacity-30'}`}>
                        <Space>
                            {selectedVideo?.label || (videoInputDevices.length === 0 ? 'No cameras found' : 'Select Camera')}
                        </Space>
                        <DownOutlined />
                        </Typography.Link>
                    </Dropdown>
                </div>

                {/* Screen Share Button */}
                <div className="flex justify-between items-center gap-2">
                    <label className="text-base font-semibold">Screen Share</label>
                    <Button
                        className={`${deviceStates.screen ? 'bg-green-600 text-white hover:bg-green-700 pointer-events-none' : 'bg-black text-white border-none hover:bg-gray-800'} ${(isMultiScreenDetected && !bypassMultiScreenCheck) ? 'bg-gray-700 text-gray-500 cursor-not-allowed pointer-events-none' : ''}`}
                        icon={deviceStates.screen ? <CheckCircle size={'15px'} /> : null}
                        loading={isLoading}
                        onClick={shareScreen}
                        disabled={isLoading || deviceStates.screen || (isMultiScreenDetected && !bypassMultiScreenCheck)}
                    >
                        {deviceStates.screen ? 'Sharing Screen' : 'Share Screen'}
                    </Button>
                </div>

                {/* Multi-screen Bypass Toggle */}
                <div className="flex justify-between items-center gap-2">
                    <div className="flex flex-col">
                        <label className="text-base font-semibold">Multiple Screens Bypass</label>
                        <span className="text-xs text-gray-400">
                            Use with caution - may affect call quality
                        </span>
                    </div>
                    <Switch 
                        checked={bypassMultiScreenCheck}
                        onChange={handleBypassToggleChange}
                    />
                </div>

                {/* Connection Info */}
                <div className="flex flex-col gap-2">
                    <label className="text-base font-semibold">Connection</label>
                    <div className={`p-2 rounded bg-black bg-opacity-20 flex justify-between items-center`}>
                        <span>
                            {socket && socket.connected 
                                ? "Connected to interview server" 
                                : "Waiting for server connection..."}
                        </span>
                        <div className={`w-3 h-3 rounded-full ${socket && socket.connected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                        Camera and screen sharing will be sent to the backend via WebSocket
                    </div>
                </div>

                {/* Join Call Button */}
                <div className="flex justify-end mt-4">
                    <Button
                        disabled={!areAllDevicesReady || isJoining || !socket || !socket.connected}
                        variant="solid"
                        className="disabled:bg-gray-700 border-none disabled:text-gray-500 bg-green-500 text-white hover:bg-green-600 disabled:cursor-not-allowed font-semibold"
                        size="large"
                        onClick={handleJoinCall}
                        loading={isJoining}
                    >
                        {isJoining ? 'Joining...' : 'Join Call'}
                    </Button>
                </div>
            </div>
      </div>
    </div>
    {/* Mobile/Tablet Fallback */}
    <div className="flex justify-center text-center items-center h-screen md:hidden text-foreground p-4">
        Please use a desktop or laptop computer with a single monitor to join the interview.
    </div>
    </>
  );
}

export default CheckDevices;