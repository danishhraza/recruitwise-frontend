import { Button, ConfigProvider, Dropdown, Slider, Space, Typography } from "antd";
import { DownOutlined } from '@ant-design/icons';
import React, { useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { CheckCircle } from "lucide-react";
import { useRoom } from "../Context/RoomContext";
import { ThemeProvider } from "../components/theme-provider";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

function CheckDevices () {
    const {setStage,deviceStates,setDeviceStates,audioInputDevices,setAudioInputDevices,videoInputDevices,setVideoInputDevices,audioOutputDevices,setAudioOutputDevices,
      selectedMic,setSelectedMic,selectedVideo,setSelectedVideo,isLoading,setIsLoading,screenStream, setScreenStream,cameraStream,setCameraStream,setMicStream} = useRoom()
    const [testAudio,setTestAudio] = useState(false);
    const [isMultiScreenDetected, setIsMultiScreenDetected] = useState(false);

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
        // console.log("Multi-screen detected (isExtended):", isMultiScreen);

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
        // For more robust detection, Screen Details API (`getScreenDetails`) would be needed,
        // but `isExtended` is a good starting point.
        window.addEventListener('resize', handleScreenChange);

        return () => {
            window.removeEventListener('resize', handleScreenChange);
        };
    }, []);

    const startCamera = async () => {
      try {
          if (cameraStream) {
              cameraStream.getTracks().forEach(track => track.stop());
          }

          // Ensure a video device is selected
          if (!selectedVideo || !selectedVideo.key) {
              console.log("No video device selected yet.");
              // Optionally handle this case, e.g., show a message or wait
              return;
          }

          const stream = await navigator.mediaDevices.getUserMedia({
              video: {
                  deviceId: selectedVideo.key ? { exact: selectedVideo.key } : undefined,
              }
          });

          setCameraStream(stream);
          if (videoRef.current) {
              videoRef.current.srcObject = stream;
          }
          setDeviceStates(prev => ({ ...prev, camera: true }));

      } catch (err) {
          console.error("Error accessing camera:", err);
          setDeviceStates(prev => ({ ...prev, camera: false }));
          toast.error("Failed to access camera. Please check permissions.");
      }
  };

    // Restart camera when selected video device changes
    useEffect(() => {
        startCamera();
        // Cleanup function: Stop camera stream when component unmounts or selectedVideo changes
        return () => {
            if (cameraStream) {
                cameraStream.getTracks().forEach(track => track.stop());
                if (videoRef.current) {
                    videoRef.current.srcObject = null; // Clear the video element source
                }
                setCameraStream(null); // Reset camera stream state
            }
        };
    }, [selectedVideo]); // Rerun effect when selectedVideo changes

 // Device enumeration and initialization
 useEffect(() => {
  const checkDevicePermissions = async () => {
      toast.loading("Checking for microphone and camera permissions", {
          duration: Infinity,
          id: 'permission-check'
      });

      let initialCameraSet = false; // Flag to set camera only once initially
      let initialMicSet = false; // Flag to set mic only once initially

      try {
          // Request permissions first to ensure labels are available (if not already granted)
          // Note: getUserMedia might trigger permission prompts if not already granted
          await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
            .catch(err => {
                console.warn("Initial permission request failed or was denied:", err.name);
                // Don't throw here, enumerateDevices might still work partially
                if (err.name === 'NotAllowedError' || err.name === 'NotFoundError') {
                    toast.error("Device permissions denied or no devices found. Please allow access and ensure devices are connected.", { duration: 5000 });
                     setDeviceStates(prev => ({ ...prev, microphone: false, camera: false }));
                }
            });


          const devices = await navigator.mediaDevices.enumerateDevices();

          // Handle video devices
          const videos = devices
              .filter((device) => device.kind === "videoinput")
              .map((device) => ({ key: device.deviceId, label: device.label || `Camera ${videoInputDevices.length + 1}` })); // Provide default label if empty
          setVideoInputDevices(videos);
          if (videos.length > 0 && !selectedVideo.key) { // Only set if not already selected
              setSelectedVideo(videos[0]);
              initialCameraSet = true;
          } else if (videos.length === 0) {
              setDeviceStates(prev => ({ ...prev, camera: false }));
          }

          // Handle audio input devices
          const microphones = devices
              .filter((device) => device.kind === "audioinput")
              .map((device) => ({ key: device.deviceId, label: device.label || `Microphone ${audioInputDevices.length + 1}` })); // Provide default label
          setAudioInputDevices(microphones);

          if (microphones.length > 0 && !selectedMic.key) { // Only set if not already selected
              // Prefer 'default' device if available, otherwise take the first one
              const defaultMic = microphones.find(device => device.key === "default") || microphones[0];
              setSelectedMic(defaultMic);
              initialMicSet = true;

              // Initialize microphone stream only if setting the mic for the first time here
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

           // Handle audio output devices (less critical for permissions, but good to list)
           const speakers = devices
                .filter((device) => device.kind === "audiooutput")
                .map((device) => ({ key: device.deviceId, label: device.label || `Speaker ${audioOutputDevices.length + 1}` })); // Provide default label
           setAudioOutputDevices(speakers);


          // Start camera only if it was initially set here
          if (initialCameraSet) {
              // The useEffect dependency on selectedVideo will handle starting the camera
              // startCamera(); // Removed this call as the useEffect above handles it
          }


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
      // Ensure streams are stopped on component unmount
       if (cameraStream) {
           cameraStream.getTracks().forEach(track => track.stop());
       }
       // micStream is managed elsewhere or might not need global stop here
       if (screenStream) {
           screenStream.getTracks().forEach(track => track.stop());
       }
       if (audioContextRef.current) {
           audioContextRef.current.close();
       }
  };
}, []); // Run only once on mount


// Setup microphone audio visualizer
useEffect(() => {
    let animationFrameId;
    let currentStream; // To hold the stream for cleanup

    async function setupMicrophone() {
      if (!testAudio || !selectedMic?.key) return; // Ensure mic is selected and test is active

      // Close existing audio context if any
      if (audioContextRef.current) {
        await audioContextRef.current.close();
        audioContextRef.current = null;
        sourceRef.current = null; // Ensure source is cleared
      }

      try {
        currentStream = await navigator.mediaDevices.getUserMedia({
          audio: { deviceId: { exact: selectedMic.key } }
        });

        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256; // Smaller FFT size for less detail but faster processing

        sourceRef.current = audioContextRef.current.createMediaStreamSource(currentStream);
        sourceRef.current.connect(analyserRef.current);
        // Do NOT connect to destination unless you want echo

        dataArrayRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);

        updateMicLevel();
      } catch (error) {
        console.error("Error accessing microphone for visualizer:", error);
        toast.error("Could not access selected microphone for testing.");
        setTestAudio(false); // Turn off test if it failed
      }
    }

    function updateMicLevel() {
      if (!analyserRef.current || !testAudio) {
         setMicLevel(0); // Reset level if test stopped
         return;
      }

      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      // Calculate average volume
      let sum = 0;
      for (let i = 0; i < dataArrayRef.current.length; i++) {
          sum += dataArrayRef.current[i];
      }
      const average = sum / dataArrayRef.current.length;
      // Scale the average to be more responsive (0-100 range approx)
      // Adjust the scaling factor (e.g., 1.5) as needed for sensitivity
      setMicLevel(Math.min(100, average * 1.5));

      animationFrameId = requestAnimationFrame(updateMicLevel); // Continue animation loop
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
            sourceRef.current.disconnect(); // Disconnect the source node
            sourceRef.current = null;
        }
        cancelAnimationFrame(animationFrameId); // Stop animation loop
        setMicLevel(0); // Reset mic level display
    }

    // Cleanup on component unmount or if selectedMic changes while testing
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
  }, [testAudio, selectedMic]); // Rerun effect if testAudio state or selectedMic changes

  async function shareScreen() {
    if (deviceStates.screen) {
      // If already sharing, stop sharing
      screenStream?.getTracks().forEach(track => track.stop());
      setScreenStream(null);
      setDeviceStates(prev => ({ ...prev, screen: false }));
      toast.info("Screen sharing stopped.");
      return;
    }

    // Check for multiple screens *before* prompting user
    const hasMultipleScreens = detectScreens();
    if (hasMultipleScreens) {
        toast.error("Multiple screens detected. Please disconnect extra screens to continue.", {
            id: 'multiple-screens-error', // Use an ID to prevent duplicates
            duration: 5000,
        });
        return; // Prevent sharing if multiple screens are detected
    }


    try {
      setIsLoading(true);
      toast.loading("Requesting screen share access...", { id: 'screen-share-request', duration: Infinity });

      const screenPermission = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: "monitor", // Prefer entire screen
          cursor: 'always'
        },
        audio: false // Usually screen audio is not needed or desired
      });

       toast.dismiss('screen-share-request');

      // Double-check if the user shared the whole screen (though displaySurface: 'monitor' should enforce this)
      const videoTrack = screenPermission.getVideoTracks()[0];
      const settings = videoTrack.getSettings();

      if (settings.displaySurface !== "monitor") {
          // If not the entire monitor, stop the track and inform the user.
          videoTrack.stop();
          toast.error("Please share your entire screen, not just a window or tab.", { duration: 5000, id: 'screen-share-error' });
          throw new Error("User did not select entire screen");
      }

      // Add event listener for when screen sharing ends (e.g., user clicks browser's stop button)
      videoTrack.addEventListener('ended', () => {
        console.log('Screen sharing stopped externally (e.g., browser button).');
        setDeviceStates(prev => ({ ...prev, screen: false }));
        setScreenStream(null);
        toast.info("Screen sharing stopped.");
      }, { once: true }); // Ensure listener is removed after firing once

      // Set screen stream and update states
      setScreenStream(screenPermission);
      setDeviceStates(prev => ({ ...prev, screen: true }));
      toast.success("Screen sharing started successfully!", { duration: 3000 });

    } catch (err) {
       toast.dismiss('screen-share-request');
      console.error("Screen share error:", err);

      // Handle specific errors
      if (err.name === 'NotAllowedError') {
        toast.error("Screen share permission denied.", { duration: 5000, id: 'screen-share-error' });
      } else if (err.message !== "User did not select entire screen") { // Avoid double toast for specific error case
          toast.error("Could not start screen sharing.", { duration: 5000, id: 'screen-share-error' });
      }

      // Ensure state is consistent if sharing failed
      setDeviceStates(prev => ({ ...prev, screen: false }));
      setScreenStream(null);

    } finally {
      setIsLoading(false);
    }
  }

  // Handle Join Call button click
  const handleJoinCall = async () => {
    // Final check for multiple screens before joining
    const hasMultipleScreens = detectScreens();
    if (hasMultipleScreens) {
      toast.error("Multiple screens detected. Please disconnect extra screens before joining.", {
        id: 'multiple-screens-join-error',
        duration: 5000,
      });
      return;
    }

    // Check if screen is shared before proceeding
    if (!deviceStates.screen) {
       toast.error("Please share your screen before joining.", { duration: 4000, id: 'join-call-error' });
      // Optionally, you could trigger shareScreen() here automatically,
      // but it might be better UX to let the user click the share button explicitly.
      // await shareScreen(); // Uncomment if you want to automatically trigger sharing
      return;
    }

     // Check other device states (redundant if button is disabled, but good practice)
     if (!deviceStates.camera || !deviceStates.microphone) {
         toast.error("Please ensure your camera and microphone are working and selected.", { duration: 4000, id: 'join-call-error' });
         return;
     }


    // If all checks pass, proceed to call
    console.log("All checks passed, proceeding to call stage.");
    setStage('call');
  };

  // --- Dropdown Handlers ---
  function handleMicClick(e){
      const selected = audioInputDevices.find(device => device.key === e.key);
      if (selected) {
        console.log("Selected Mic:", selected);
        // Stop existing mic stream if necessary before switching
        if (micStream) {
            micStream.getTracks().forEach(track => track.stop());
            setMicStream(null); // Clear old stream
        }
        setSelectedMic(selected);
        // Note: The useEffect for visualizer will handle getting the new stream if testing
        // If not testing, you might need to get the stream here or ensure it's ready for the call stage
      }
  }

  function handleVideoClick(e){
      const selected = videoInputDevices.find(device => device.key === e.key);
      if (selected) {
        console.log("Selected Video:", selected);
        setSelectedVideo(selected);
        // The useEffect dependency on selectedVideo will handle restarting the camera preview
      }
  }

  // Calculate if ready to join
  // Ready only if mic, camera, and screen are active AND no multiple screens detected
  const areAllDevicesReady = deviceStates.microphone && deviceStates.camera && deviceStates.screen && !isMultiScreenDetected;

  return (
    <ThemeProvider defaultTheme="dark">
    <div className="h-screen md:flex justify-center items-center bg-background hidden p-4">
      {/* Added padding */}
      <div className="w-full max-w-[1000px] p-6 rounded-lg flex flex-col md:flex-row gap-6 bg-[#1f42aa] text-slate-200">
            {/* Video Preview Area */}
             <div className="flex-shrink-0 w-[600px] bg-black rounded-lg flex items-center justify-center overflow-hidden">
                {selectedVideo?.key && deviceStates.camera ? (
                     <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted // Important for local preview to avoid feedback
                        className="w-full h-full object-cover" // Use object-cover
                    />
                ) : (
                    <div className="text-slate-400">Camera off or not selected</div>
                )}
            </div>

            {/* Controls and Checklist Area */}
        <div id="checklist" className="outfit-400 text-sm flex flex-col justify-between gap-4 flex-grow"> {/* Use flex-grow and justify-between */}

            {/* Multi-screen Alert */}
             {isMultiScreenDetected && (
                <Alert variant="destructive" className="mb-2 bg-[#7e0f0f] text-slate-100">
                    <AlertTitle>Multiple Screens Detected</AlertTitle>
                    <AlertDescription className="text-slate-200">
                        Please disconnect other screens before joining the call. Screen sharing and joining are disabled.
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
                    disabled={audioInputDevices.length === 0 || isMultiScreenDetected} // Disable if multi-screen
                >
                    <Typography.Link className={`flex justify-between items-center p-2 rounded ${audioInputDevices.length === 0 || isMultiScreenDetected ? 'text-gray-500 cursor-not-allowed' : 'bg-black bg-opacity-20 hover:bg-opacity-30'}`}>
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
                            disabled={!testAudio || isMultiScreenDetected} // Disable slider if multi-screen
                            className="w-full"
                            tooltip={{ open: false }} // Hide tooltip
                        />
                    </ConfigProvider>
                    <Button
                        className="bg-black border-none text-white text-xs px-3 py-1"
                        onClick={() => setTestAudio(!testAudio)}
                        disabled={!selectedMic?.key || isMultiScreenDetected} // Disable button if no mic or multi-screen
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
                     disabled={videoInputDevices.length === 0 || isMultiScreenDetected} // Disable if multi-screen
                >
                   <Typography.Link className={`flex justify-between items-center p-2 rounded ${videoInputDevices.length === 0 || isMultiScreenDetected ? 'text-gray-500 cursor-not-allowed' : 'bg-black bg-opacity-20 hover:bg-opacity-30'}`}>
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
                    className={`${deviceStates.screen ? 'bg-green-600 text-white hover:bg-green-700 pointer-events-none' : 'bg-black text-white border-none hover:bg-gray-800'} ${isMultiScreenDetected ? 'bg-gray-700 text-gray-500 cursor-not-allowed pointer-events-none' : ''}`} // Disable styling if multi-screen
                    icon={deviceStates.screen && !isMultiScreenDetected ? <CheckCircle size={'15px'} /> : null}
                    loading={isLoading}
                    onClick={shareScreen}
                    disabled={isLoading || deviceStates.screen || isMultiScreenDetected} // Disable if loading, already sharing, or multi-screen detected
                >
                    {deviceStates.screen ? 'Sharing Screen' : 'Share Screen'}
                </Button>
            </div>

            {/* Join Call Button */}
            <div className="flex justify-end mt-4"> {/* Add margin top */}
                <Button
                    disabled={!areAllDevicesReady} // Disables if any device isn't ready OR if multi-screen is detected
                    variant="solid"
                    className="disabled:bg-gray-700 border-none disabled:text-gray-500 bg-green-500 text-white hover:bg-green-600 disabled:cursor-not-allowed font-semibold"
                    size="large"
                    onClick={handleJoinCall}
                 >
                    Join Call
                </Button>
            </div>
        </div>
      </div>
    </div>
    {/* Mobile/Tablet Fallback */}
    <div className="flex justify-center text-center items-center h-screen md:hidden text-foreground p-4"> {/* Added padding */}
        Please use a desktop or laptop computer with a single monitor to join the interview.
    </div>
    </ThemeProvider>
  )
};

export default CheckDevices;


