import React, { useEffect, useRef, useState, useCallback } from "react";
import { useRoom } from "../Context/RoomContext"; // Assuming this path is correct
import { 
  Mic, 
  Video, 
  VideoOff,
  PhoneOff, 
  Monitor as MonitorIcon, // Renamed for clarity if original was just Monitor
  AlertCircle,
 Circle, // Adding this for recording buttons
  Square // For stop recording button
} from "lucide-react";
import Spline from '@splinetool/react-spline';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"; // Assuming this path is correct
import { Button } from "@/components/ui/button"; // Assuming this path is correct
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Howl } from 'howler';

const AUDIO_MIME_TYPE = 'audio/webm; codecs=opus'; // Standardize for client recording
const VIDEO_MIME_TYPE = 'video/webm'; // Standardize for client recording

function VideoCall({ roomId, socket }) {
  const {
    selectedMic, // Not directly used in this version, micStream is key
    selectedVideo, // Not directly used, cameraStream is key
    micStream,
    cameraStream,
    deviceStates,
    setDeviceStates,
    setScreenStream,
    screenStream,
    setStage
  } = useRoom();

  const navigate = useNavigate();

  // --- State for Flow Control & Data ---
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [canUserSpeak, setCanUserSpeak] = useState(false);
  const [interviewSessionActive, setInterviewSessionActive] = useState(false); // Server confirmed session
  const [currentAiText, setCurrentAiText] = useState("");
  const [currentUserTranscript, setCurrentUserTranscript] = useState("");
  const [liveTranscript, setLiveTranscript] = useState([]);
  const [endCallConfirm, setEndCallConfirm] = useState(false);

  // --- Audio Buffer Management State ---
  const [audioBufferStatus, setAudioBufferStatus] = useState({ 
    buffering: false, 
    progress: 0,
    totalChunks: 0 
  });

  // --- Media Recorders & Recording State ---
  const [isUserAudioRecording, setIsUserAudioRecording] = useState(false);
  const audioMediaRecorderRef = useRef(null);
  const videoMediaRecorderRef = useRef(null);
  const screenMediaRecorderRef = useRef(null);
  
  // --- Refs ---
  const userVideoRef = useRef(null);
  const audioContextRef = useRef(null);
  const audioBuffersRef = useRef([]);
  const isPlayingAudioRef = useRef(false);
  const bufferingTimerRef = useRef(null);

  // --- Client-side Audio Handling ---
  useEffect(() => {
    if (!socket) return;
    
    // Audio buffer management
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    audioBuffersRef.current = [];
    isPlayingAudioRef.current = false;
    const MIN_BUFFER_DURATION = 500; // ms before starting playback
    
    const playNextChunk = async () => {
      if (!audioBuffersRef.current.length || isPlayingAudioRef.current) return;
      
      isPlayingAudioRef.current = true;
      const bufferData = audioBuffersRef.current.shift();
      
      try {
        // Create audio buffer from the chunk
        const arrayBuffer = await bufferData.arrayBuffer();
        const audioBuffer = await audioContextRef.current.decodeAudioData(arrayBuffer);
        
        // Create source and play
        const source = audioContextRef.current.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContextRef.current.destination);
        
        // When finished, play the next chunk
        source.onended = () => {
          isPlayingAudioRef.current = false;
          playNextChunk();
          
          // Update buffer status
          setAudioBufferStatus(prev => ({
            ...prev,
            progress: Math.max(0, prev.totalChunks - audioBuffersRef.current.length),
            buffering: audioBuffersRef.current.length < 3 && isAiSpeaking
          }));
        };
        
        source.start(0);
      } catch (err) {
        console.error('Error playing audio chunk:', err);
        isPlayingAudioRef.current = false;
        playNextChunk(); // Try the next chunk
      }
    };

    const handleAiResponseChunk = ({ audioChunk, chunkSize, timestamp }) => {
      if (!audioChunk) return;
      
      // Convert to Blob
      const blob = new Blob([audioChunk], { type: 'audio/mpeg' });
      audioBuffersRef.current.push(blob);
      
      // Update buffer status
      setAudioBufferStatus(prev => ({
        buffering: prev.buffering || audioBuffersRef.current.length < 5,
        progress: prev.progress,
        totalChunks: prev.totalChunks + 1
      }));
      
      // Start a buffer timer if not started
      if (!isPlayingAudioRef.current && !bufferingTimerRef.current && audioBuffersRef.current.length < 5) {
        bufferingTimerRef.current = setTimeout(() => {
          bufferingTimerRef.current = null;
          playNextChunk();
        }, MIN_BUFFER_DURATION);
      } else if (!isPlayingAudioRef.current && audioBuffersRef.current.length >= 5) {
        // We have enough buffer, start playing
        playNextChunk();
      }
    };
    
    socket.on('aiResponseChunk', handleAiResponseChunk);
    
    // Cleanup
    return () => {
      socket.off('aiResponseChunk');
      if (bufferingTimerRef.current) clearTimeout(bufferingTimerRef.current);
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, [socket, isAiSpeaking]);

  // --- Socket Event Listeners ---
  useEffect(() => {
    if (!socket) return;

    const handleAiResponseStart = ({ text }) => {
      console.log('SOCKET EVENT: aiResponseStart - AI Text:', text);
      setCurrentAiText(text);
      setLiveTranscript(prev => [...prev, { speaker: "RecruitWise AI", text, align: "left", timestamp: Date.now() }]);
      setIsAiSpeaking(true);
      setCanUserSpeak(false);
      setCurrentUserTranscript(""); // Clear user's last speech
      
      if (audioMediaRecorderRef.current && audioMediaRecorderRef.current.state === "recording") {
        console.log("AI starting to speak, stopping user audio recording.");
        audioMediaRecorderRef.current.stop(); // onstop will set isUserAudioRecording to false
      }
      
      // Reset audio buffers for new response
      audioBuffersRef.current = [];
      setAudioBufferStatus({
        buffering: true,
        progress: 0,
        totalChunks: 0
      });
    };

    // MODIFIED: handleAiResponseEnd to not automatically start recording
    const handleAiResponseEnd = () => {
      console.log('SOCKET EVENT: aiResponseEnd - AI finished speaking.');
      const checkAudioQueueAndSetTurn = () => {
        if (audioBuffersRef.current.length === 0 && !isPlayingAudioRef.current) {
          setIsAiSpeaking(false);
          setCanUserSpeak(true);
          setCurrentAiText(""); 
          // Removed automatic recording start - user will start manually with button
        } else {
          setTimeout(checkAudioQueueAndSetTurn, 200); // Check again shortly
        }
      };
      checkAudioQueueAndSetTurn();
    };
    
    const handleInterviewFlowError = (error) => {
      console.error('SOCKET EVENT: interviewFlowError:', error.message, error.details);
      toast.error(`Interview Error: ${error.message || 'Failed to proceed.'}`, { duration: 10000 });
      setIsAiSpeaking(false);
      setCanUserSpeak(false);
      setInterviewSessionActive(false);
      if (audioMediaRecorderRef.current && audioMediaRecorderRef.current.state === "recording") {
        audioMediaRecorderRef.current.stop();
      }
    };

    const handleTranscriptionUpdate = ({ text, partial, final, note }) => {
      // console.log('SOCKET EVENT: transcriptionUpdate:', text, {partial, final, note});
      if (partial) {
        setCurrentUserTranscript(text + "...");
      }
      if (final) {
        setCurrentUserTranscript(text);
        if (text) { // Only add to live transcript if there's actual text
             setLiveTranscript(prev => {
                // Avoid duplicate final transcripts if partial was already very similar
                const lastEntry = prev[prev.length -1];
                if(lastEntry && lastEntry.speaker === "You" && lastEntry.text.startsWith(text.substring(0, text.length - 5))) {
                    lastEntry.text = text; // Update last entry
                    return [...prev];
                }
                return [...prev, { speaker: "You", text, align: "right", timestamp: Date.now() }];
             });
        }
        if (note) toast.info(note, { duration: 3000 });
      }
    };

    const handleGenericError = (error) => {
      console.error('SOCKET EVENT: error (generic):', error.message, error.details);
      toast.error(`Server Error: ${error.message || 'An unexpected error occurred.'}`);
    };

    const handleDisconnect = (reason) => {
      console.log("Socket disconnected:", reason);
      toast.error(`Connection lost: ${reason}.`, { id: 'socket-disconnect', duration: Infinity });
      setIsAiSpeaking(false); 
      setCanUserSpeak(false); 
      setInterviewSessionActive(false);
    };

    const handleReconnect = () => {
      toast.success("Reconnected to server. Re-initializing interview...", { id: 'socket-reconnect', duration: 3000 });
      // Re-emit startInterview or joinInterview depending on your server logic for re-connections
      setInterviewSessionActive(false); // This will trigger the startInterview useEffect again
    };

    socket.on('aiResponseStart', handleAiResponseStart);
    socket.on('aiResponseEnd', handleAiResponseEnd);
    socket.on('interviewFlowError', handleInterviewFlowError);
    socket.on('transcriptionUpdate', handleTranscriptionUpdate);
    socket.on('error', handleGenericError);
    socket.on('disconnect', handleDisconnect);
    socket.on('reconnect', handleReconnect);

    return () => {
      socket.off('aiResponseStart'); 
      socket.off('aiResponseEnd');
      socket.off('interviewFlowError'); 
      socket.off('transcriptionUpdate'); 
      socket.off('error');
      socket.off('disconnect'); 
      socket.off('reconnect');
    };
  }, [socket, deviceStates.microphone, interviewSessionActive]); 

  // --- Effect to Start Interview on Server ---
  useEffect(() => {
    if (socket && socket.connected && roomId && !interviewSessionActive) {
      console.log("Attempting to start interview on server...");
      toast.info("Initializing interview session...", { id: 'start-interview-toast', duration: Infinity });
      
      socket.emit('startInterview', roomId, (response) => { // roomId is the interviewId
        toast.dismiss('start-interview-toast');
        if (response && response.status === 'started') {
          console.log('Server Acknowledged: Interview session started. Session ID:', response.sessionId);
          toast.success("Interview session active. Waiting for AI to begin.", { duration: 5000 });
          setInterviewSessionActive(true);
          // AI will initiate with 'aiResponseStart' etc.
        } else {
          const errorMsg = response?.message || 'Unknown error from server.';
          console.error('Failed to start interview session:', errorMsg, response);
          toast.error(`Interview Start Failed: ${errorMsg}`, { duration: 10000 });
          setInterviewSessionActive(false);
          // Consider navigating away or offering a retry mechanism
        }
      });
    }
  }, [socket, roomId, interviewSessionActive]);

  // --- Improved User Audio Recording ---
const startUserAudioRecording = useCallback(() => {
  // Add detailed logging to diagnose issues
  console.log("Checking conditions for starting user audio recording:", {
    socketConnected: socket?.connected,
    micStreamExists: !!micStream,
    micEnabled: deviceStates.microphone,
    alreadyRecording: isUserAudioRecording,
    aiCurrentlySpeaking: isAiSpeaking,
    userAllowedToSpeak: canUserSpeak
  });
  
  if (!socket || !socket.connected) {
    console.error("Cannot start recording: Socket not connected");
    toast.error("Connection lost. Cannot start recording.");
    return;
  }
  
  if (!micStream) {
    console.error("Cannot start recording: No microphone stream available");
    toast.error("Microphone access required. Please check permissions.");
    return;
  }
  
  if (!deviceStates.microphone) {
    console.warn("Cannot start recording: Microphone is muted");
    toast.warning("Microphone is muted. Please unmute to speak.");
    return;
  }
  
  if (isUserAudioRecording) {
    console.warn("Already recording audio");
    return;
  }
  
  if (isAiSpeaking) {
    console.warn("Cannot start recording while AI is speaking");
    toast.warning("Please wait for AI to finish speaking.");
    return;
  }
  
  if (!canUserSpeak) {
    console.warn("Cannot start recording: Not user's turn");
    toast.warning("Please wait for your turn to speak.");
    return;
  }
  
  console.log("All conditions met, starting user audio recording...");
  
  try {
    // Ensure microphone stream has active tracks
    if (micStream.getAudioTracks().length === 0 || !micStream.getAudioTracks()[0].enabled) {
      console.error("Microphone stream exists but has no enabled tracks");
      toast.error("Microphone not available. Please check device settings.");
      return;
    }
    
    // Create the MediaRecorder with explicit options
    const options = { mimeType: AUDIO_MIME_TYPE };
    console.log(`Creating MediaRecorder with options:`, options);
    
    // Create an array to store audio chunks
    const audioChunks = [];
    
    const recorder = new MediaRecorder(micStream, options);
    audioMediaRecorderRef.current = recorder;

    // Listen for dataavailable event to collect chunks
    recorder.ondataavailable = (event) => {
      console.log(`Audio data available: ${event.data.size} bytes`);
      
      if (event.data.size > 0) {
        // Store chunks for later sending
        audioChunks.push(event.data);
        console.log(`Processing audio chunk of ${event.data.size} bytes`);
        console.log(`Ready to send audio chunk of ${event.data.size} bytes to server via socket.emit`);
        console.log('Audio chunk emission attempted. Socket state:', 
          socket?.connected ? 'Connected' : 'Disconnected');
      } else if (event.data.size === 0) {
        console.warn("Received empty audio data");
      }
    };
    
    // When recording stops, send the complete audio blob
    recorder.onstop = () => {
      console.log('User audio recording stopped.');
      setIsUserAudioRecording(false);
      
      // Only send data if we have chunks and a connected socket
      if (audioChunks.length > 0 && socket && socket.connected) {
        console.log(`Sending complete audio recording with ${audioChunks.length} chunks`);
        
        // Create a single blob from all chunks
        const audioBlob = new Blob(audioChunks, { type: AUDIO_MIME_TYPE });
        
        try {
          // Emit the complete audio blob to the server
          socket.emit('audioStream', {
            interviewId: roomId,
            audioChunk: audioBlob,
          }, (acknowledgment) => {
            if (acknowledgment && acknowledgment.received) {
              console.log('Server acknowledged audio receipt:', acknowledgment);
            } else {
              console.warn('No acknowledgment from server for audio');
              // Retry once if no acknowledgment
              setTimeout(() => {
                console.log('Retrying audio transmission...');
                socket.emit('audioStream', {
                  interviewId: roomId,
                  audioChunk: audioBlob,
                  isRetry: true
                });
              }, 100);
            }
          });
        } catch (err) {
          console.error("Error sending audio data:", err);
          toast.error("Error sending audio to server.");
        }
      } else if (!socket || !socket.connected) {
        console.warn("Socket disconnected, can't send audio data");
        toast.error("Connection lost. Cannot send audio to server.");
      } else {
        console.warn("No audio chunks collected to send");
      }
    };
    
    recorder.onerror = (event) => {
      console.error('AudioRecorder error:', event.error);
      toast.error("Mic recording error.");
      setIsUserAudioRecording(false);
    };

    // Start recording
    console.log("Starting MediaRecorder with 100ms timeslice for more frequent packets");
    recorder.start(100); // Collecting chunks every 100ms
    
    setIsUserAudioRecording(true);
    setCanUserSpeak(true);
    setCurrentUserTranscript("Listening...");
    toast.success("Recording started! Speak now.", {icon: <Mic size={16}/>, duration: 2000});

  } catch (err) {
    console.error('Error starting user audio recording:', err);
    toast.error(`Mic Error: ${err.message || 'Unknown error'}`);
  }
}, [socket, micStream, deviceStates.microphone, isUserAudioRecording, roomId, isAiSpeaking, canUserSpeak]);

  const stopUserAudioRecording = useCallback(() => {
    if (audioMediaRecorderRef.current && audioMediaRecorderRef.current.state === "recording") {
      console.log("Stopping user audio recording explicitly.");
      audioMediaRecorderRef.current.stop();
      toast.info("Recording stopped", { duration: 2000 });
    }
     // isUserAudioRecording will be set to false in onstop
  }, []);

  // --- Video & Screen Recording for S3 (Upload Only) ---
  useEffect(() => {
    if (!socket || !socket.connected || !interviewSessionActive) {
      // Stop recorders if session becomes inactive
      if (videoMediaRecorderRef.current && videoMediaRecorderRef.current.state === "recording") videoMediaRecorderRef.current.stop();
      if (screenMediaRecorderRef.current && screenMediaRecorderRef.current.state === "recording") screenMediaRecorderRef.current.stop();
      videoMediaRecorderRef.current = null;
      screenMediaRecorderRef.current = null;
      return;
    }

    // Video Stream for S3
    if (cameraStream && deviceStates.camera && !videoMediaRecorderRef.current) {
      console.log("Starting video stream for S3 upload");
      const videoRec = new MediaRecorder(cameraStream, { mimeType: VIDEO_MIME_TYPE });
      videoMediaRecorderRef.current = videoRec;
      videoRec.ondataavailable = (event) => {
        if (event.data.size > 0 && socket && socket.connected) {
          event.data.arrayBuffer().then(ab => socket.emit('videoStream', { interviewId: roomId, videoChunk: ab }));
        }
      };
      videoRec.start(1000); // Send every 1s
    } else if ((!cameraStream || !deviceStates.camera) && videoMediaRecorderRef.current) {
      if(videoMediaRecorderRef.current.state === "recording") videoMediaRecorderRef.current.stop();
      videoMediaRecorderRef.current = null;
    }

    // Screen Stream for S3
    if (screenStream && deviceStates.screen && !screenMediaRecorderRef.current) {
      console.log("Starting screen stream for S3 upload");
      const screenRec = new MediaRecorder(screenStream, { mimeType: VIDEO_MIME_TYPE });
      screenMediaRecorderRef.current = screenRec;
      screenRec.ondataavailable = (event) => {
        if (event.data.size > 0 && socket && socket.connected) {
          event.data.arrayBuffer().then(ab => socket.emit('screenStream', { interviewId: roomId, screenChunk: ab }));
        }
      };
      screenRec.start(1000);
    } else if ((!screenStream || !deviceStates.screen) && screenMediaRecorderRef.current) {
       if(screenMediaRecorderRef.current.state === "recording") screenMediaRecorderRef.current.stop();
      screenMediaRecorderRef.current = null;
    }
  }, [socket, interviewSessionActive, cameraStream, screenStream, deviceStates.camera, deviceStates.screen, roomId]);

  // --- User Video Display ---
  useEffect(() => {
    if (userVideoRef.current) {
      if (deviceStates.camera && cameraStream) {
        userVideoRef.current.srcObject = cameraStream;
      } else {
        userVideoRef.current.srcObject = null;
      }
    }
  }, [deviceStates.camera, cameraStream]);

  // --- Device State Toasts ---
  useEffect(() => {
    if (!deviceStates.microphone) toast.error("Microphone is muted.", {id: 'mic-muted', duration: Infinity});
    else toast.dismiss('mic-muted');
    
    if (!deviceStates.camera) toast.error("Camera is off.", {id: 'cam-off', duration: Infinity});
    else toast.dismiss('cam-off');
  }, [deviceStates]);

  // --- UI Controls Callbacks ---
  const toggleMic = useCallback(() => {
    if (micStream) {
      micStream.getAudioTracks().forEach(track => {
        const newMicState = !deviceStates.microphone;
        track.enabled = newMicState;
        setDeviceStates(prev => ({ ...prev, microphone: newMicState }));
        
        // If turning off mic while recording, stop recording
        if (!newMicState && isUserAudioRecording) {
          stopUserAudioRecording();
        }
      });
    }
  }, [micStream, deviceStates.microphone, setDeviceStates, isUserAudioRecording, stopUserAudioRecording]);

  const toggleVideo = useCallback(() => {
    if (cameraStream) {
      cameraStream.getVideoTracks().forEach(track => {
        track.enabled = !deviceStates.camera;
        setDeviceStates(prev => ({ ...prev, camera: !prev.camera }));
      });
    }
  }, [cameraStream, deviceStates.camera, setDeviceStates]);

  const shareScreenHandler = useCallback(async () => {
    if (screenStream && deviceStates.screen) {
      screenStream.getTracks().forEach(track => track.stop());
      setScreenStream(null);
      setDeviceStates(prev => ({ ...prev, screen: false }));
      toast.success("Screen sharing stopped");
    } else {
      try {
        const newScreenStream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: false });
        setScreenStream(newScreenStream);
        setDeviceStates(prev => ({ ...prev, screen: true }));
        newScreenStream.getVideoTracks()[0].onended = () => {
          setScreenStream(null);
          setDeviceStates(prev => ({ ...prev, screen: false }));
          toast.info("Screen sharing stopped by browser control.");
        };
        toast.success("Screen sharing started");
      } catch (err) {
        console.error("Screen sharing error:", err);
        toast.error("Failed to start screen sharing.");
      }
    }
  }, [screenStream, deviceStates.screen, setDeviceStates, setScreenStream]);

const handleEndCall = useCallback(() => {
  console.log("handleEndCall triggered, endCallConfirm:", endCallConfirm);
  
  if (endCallConfirm) {
    toast.info("Ending interview...", { duration: 3000 });
    
    try {
      // Stop local tracks with error handling
      if (micStream) {
        console.log("Stopping mic tracks");
        micStream.getTracks().forEach(track => track.stop());
      }
      
      if (cameraStream) {
        console.log("Stopping camera tracks");
        cameraStream.getTracks().forEach(track => track.stop());
      }
      
      if (screenStream) {
        console.log("Stopping screen tracks");
        screenStream.getTracks().forEach(track => track.stop());
      }

      // Stop recorders with error handling
      if (typeof stopUserAudioRecording === 'function') {
        console.log("Stopping audio recording");
        stopUserAudioRecording();
      } else {
        console.warn("stopUserAudioRecording is not a function");
      }
      
      if (videoMediaRecorderRef.current?.state === "recording") {
        console.log("Stopping video recording");
        videoMediaRecorderRef.current.stop();
      }
      
      if (screenMediaRecorderRef.current?.state === "recording") {
        console.log("Stopping screen recording");
        screenMediaRecorderRef.current.stop();
      }
      
      // Socket communication with error handling
      if (socket) {
        if (socket.connected) {
          console.log("Emitting endInterview event for room:", roomId);
          socket.emit('endInterview', { interviewId: roomId });
        } else {
          console.warn("Socket is not connected");
          // Fallback behavior if socket isn't connected
          setStage('ended');
        }
      } else {
        console.warn("Socket is not initialized");
        // Fallback behavior if socket isn't initialized
        setStage('ended');
      }
      
      // Always set stage to ended as fallback
      console.log("Setting stage to ended");
      setStage('ended');
      
    } catch (error) {
      console.error("Error in handleEndCall:", error);
      toast.error("Error ending call. Please try again.");
      // Still attempt to end the call despite errors
      setStage('ended');
    }
  } else {
    console.log("Setting endCallConfirm to true");
    setEndCallConfirm(true);
    toast.info("Click again to confirm ending the call", { duration: 3000 });
    
    setTimeout(() => {
      console.log("Resetting endCallConfirm to false");
      setEndCallConfirm(false);
    }, 3000);
  }
}, [
  endCallConfirm, 
  micStream, 
  cameraStream, 
  screenStream, 
  socket, 
  roomId, 
  stopUserAudioRecording, 
  setStage,
  videoMediaRecorderRef,
  screenMediaRecorderRef
]);

  return (
    <div className="flex w-full mx-auto h-screen rounded-lg overflow-hidden border bg-[#0f0f0f] border-gray-700 shadow-md">
      {/* Left side - Video & Controls */}
      <div className="relative w-3/4 md:w-5/6 border-r border-gray-600 flex flex-col">
        {/* Main video - AI Interviewer (Spline animation) */}
        <div className="w-full flex-grow relative">
          <Spline scene="https://prod.spline.design/vWvFcD4O3twcVXiF/scene.splinecode" />
          <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-1.5 rounded-md text-sm">
            <span>RecruitWise AI {isAiSpeaking && "(Responding...)"}</span>
          </div>
          
          {/* Audio Buffer Status Indicator */}
          {audioBufferStatus.buffering && isAiSpeaking && (
            <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1.5 rounded-md text-xs flex items-center gap-2">
              <div className="animate-pulse">Buffering audio...</div>
              <div className="w-16 bg-gray-700 rounded-full h-1.5">
                <div 
                  className="bg-blue-500 h-1.5 rounded-full"
                  style={{ width: `${Math.min(100, (audioBufferStatus.progress / Math.max(1, audioBufferStatus.totalChunks)) * 100)}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* NEW: Added Start Recording Button - Shown when it's user's turn to speak and not already recording */}
          {canUserSpeak && !isUserAudioRecording && !isAiSpeaking && interviewSessionActive && deviceStates.microphone && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Button 
                variant="default" 
                size="lg" 
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 animate-pulse"
                onClick={startUserAudioRecording}
              >
                <Circle className="h-5 w-5" />
                <span>Start Recording</span>
              </Button>
            </div>
          )}
          
          {/* NEW: Added Stop Recording Button - Shown when user is recording */}
          {isUserAudioRecording && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Button 
                variant="destructive" 
                size="lg" 
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2"
                onClick={stopUserAudioRecording}
              >
                <Square className="h-5 w-5" />
                <span>Stop Recording</span>
              </Button>
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/70 px-3 py-1 rounded-full text-xs text-white">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span>Recording...</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* User video (small picture-in-picture) */}
        <div className="absolute bottom-20 right-5 w-48 h-36 md:w-64 md:h-48 rounded-lg overflow-hidden border-2 border-gray-400 shadow-lg bg-black">
          {deviceStates.camera && cameraStream ? (
            <video
              ref={userVideoRef}
              autoPlay
              playsInline
              muted // Mute local playback of own video
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <VideoOff className="w-10 h-10 text-gray-500" />
              <span className="absolute bottom-2 left-2 text-xs text-white bg-black/40 px-1 rounded">Camera Off</span>
            </div>
          )}
          {deviceStates.camera && cameraStream && (
            <div className="absolute bottom-0 left-0 bg-black/50 text-white px-2 py-0.5 rounded-tr-md text-xs">
              <span>You</span>
            </div>
          )}
        </div>
        
        {/* Controls at bottom */}
        <div className="flex-shrink-0 flex justify-center p-3 bg-black/30 backdrop-blur-sm">
          <div className="flex space-x-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" size="icon" 
                    className={`rounded-full w-12 h-12 border-0 text-white
                              ${deviceStates.microphone ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-500'}`}
                    onClick={toggleMic}
                    disabled={!micStream}
                  >
                    <Mic className="h-6 w-6" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>{deviceStates.microphone ? 'Mute' : 'Unmute'}</p></TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" size="icon" 
                    className={`rounded-full w-12 h-12 border-0 text-white
                              ${deviceStates.camera ? 'bg-gray-700 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-500'}`}
                    onClick={toggleVideo}
                    disabled={!cameraStream}
                  >
                    {deviceStates.camera ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>{deviceStates.camera ? 'Turn Off Camera' : 'Turn On Camera'}</p></TooltipContent>
              </Tooltip>
              
              {/* NEW: Start Recording Button - Adding to controls bar as well */}
              {canUserSpeak && !isUserAudioRecording && !isAiSpeaking && deviceStates.microphone && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="default" 
                      className="rounded-full h-12 border-0 text-white bg-green-600 hover:bg-green-700 px-4 flex items-center gap-2"
                      onClick={startUserAudioRecording}
                      disabled={!micStream || !deviceStates.microphone}
                    >
                      <Circle className="h-5 w-5" />
                      <span>Start Recording</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Begin speaking and send audio</p></TooltipContent>
                </Tooltip>
              )}
              
              {/* NEW: Stop Recording Button - Adding to controls bar as well */}
              {isUserAudioRecording && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      variant="destructive" 
                      className="rounded-full h-12 border-0 text-white bg-red-600 hover:bg-red-700 px-4 flex items-center gap-2"
                      onClick={stopUserAudioRecording}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <Square className="h-5 w-5" />
                        <span>Stop Recording</span>
                      </div>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent><p>Stop recording and sending audio</p></TooltipContent>
                </Tooltip>
              )}
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" 
                          className={`rounded-full w-12 h-12 border-0 text-white
                                    ${deviceStates.screen ? 'bg-blue-600 hover:bg-blue-500' : 'bg-gray-700 hover:bg-gray-600'}`}
                          onClick={shareScreenHandler}>
                    <MonitorIcon className="h-6 w-6" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent><p>{deviceStates.screen ? 'Stop Sharing' : 'Share Screen'}</p></TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={endCallConfirm ? "destructive" : "default"} 
                    size="icon" 
                    className={`rounded-full w-12 h-12 border-0 text-white
                              ${endCallConfirm ? 'bg-red-700 hover:bg-red-800' : 'bg-red-600 hover:bg-red-500'}`}
                    onClick={handleEndCall}
                    disabled={false} // Make sure it's not disabled
                  >
                    <PhoneOff className="h-6 w-6" />
                    {endCallConfirm && <span className="sr-only">Confirm End Call</span>}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{endCallConfirm ? 'Confirm End Call' : 'End Call'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Connection Status Indicator */}
        <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-md text-xs text-white flex items-center gap-1.5 shadow
                        ${!socket || !socket.connected ? 'bg-red-600' : (interviewSessionActive ? 'bg-green-600' : 'bg-yellow-500')}`}>
          <AlertCircle className="h-3.5 w-3.5" />
          <span>
            {!socket || !socket.connected ? "Disconnected" : 
             (interviewSessionActive ? (isAiSpeaking ? "AI Speaking" : (isUserAudioRecording ? "Listening" : "Connected")) : "Connecting...")}
          </span>
        </div>
      </div>
      
      {/* Right side - Transcript */}
      <div className="w-1/4 md:w-1/3 flex flex-col h-full bg-[#1a1a1a] border-l border-gray-600">
        <div className="p-4 border-b border-gray-600">
          <h2 className="font-semibold text-lg text-white">Live Transcript</h2>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-700">
          {liveTranscript.map((message, index) => (
            <div key={index} className={`flex flex-col ${message.align === 'right' ? 'items-end' : 'items-start'}`}>
              <div className="mb-0.5">
                <span className={`text-xs font-medium ${message.align === 'right' ? 'text-blue-300' : 'text-green-300'}`}>
                  {message.speaker}
                </span>
              </div>
              <div className={`max-w-xs md:max-w-sm rounded-lg p-2.5 text-sm shadow ${
                  message.align === 'right' 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-gray-600 text-gray-50 rounded-bl-none'
                }`}
              >
                <p>{message.text}</p>
              </div>
              <div className="mt-0.5">
                <span className="text-xs text-gray-400">
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          ))}
          {/* Display current user partial/listening transcript */}
          {currentUserTranscript && !isAiSpeaking && (
             <div className="flex flex-col items-end">
                <div className="mb-0.5"><span className="text-xs font-medium text-blue-300">You</span></div>
                <div className="max-w-xs md:max-w-sm rounded-lg p-2.5 text-sm shadow bg-blue-600 text-white rounded-br-none">
                    <p className="italic">{currentUserTranscript}</p>
                </div>
             </div>
          )}
           {/* Visual cue for AI thinking or user's turn */}
           {!isAiSpeaking && canUserSpeak && interviewSessionActive && (
             <div className="text-center py-2">
                <p className="text-sm text-yellow-400 animate-pulse">Your turn to speak...</p>
             </div>
           )}
        </div>
        
        {/* Buffer Status bar (if needed) */}
        {audioBufferStatus.buffering && isAiSpeaking && (
          <div className="p-2 bg-gray-800 border-t border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-300">Buffering Audio</span>
              <span className="text-xs text-gray-400">{audioBufferStatus.progress}/{audioBufferStatus.totalChunks}</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1.5 mt-1">
              <div 
                className="bg-green-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (audioBufferStatus.progress / Math.max(1, audioBufferStatus.totalChunks)) * 100)}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoCall;