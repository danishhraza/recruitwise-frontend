import React, { createContext, useContext, useState, useCallback } from 'react';

const RoomContext = createContext();

export function RoomProvider({ children }) {
  // UI stages
  const [stage, setStage] = useState('checkDevices');

  // Device states
  const [deviceStates, setDeviceStates] = useState({
    microphone: false,
    camera: false,
    screen: false
  });

  // Device lists
  const [audioInputDevices, setAudioInputDevices] = useState([]);
  const [videoInputDevices, setVideoInputDevices] = useState([]);
  const [audioOutputDevices, setAudioOutputDevices] = useState([]);
  
  // Selected devices
  const [selectedMic, setSelectedMic] = useState("Select Microphone");
  const [selectedVideo, setSelectedVideo] = useState("Select Video Source");
  
  // Audio testing state
  const [testAudio, setTestAudio] = useState(false);
  
  // Media streams
  const [screenStream, setScreenStream] = useState(null);
  const [cameraStream, setCameraStream] = useState(null);
  const [micStream, setMicStream] = useState(null);
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  
  // Recording related states
  const [screenRecorderConfig, setScreenRecorderConfig] = useState(null);
  const [cameraRecorderConfig, setCameraRecorderConfig] = useState(null);
  const [recordingStatus, setRecordingStatus] = useState('inactive'); // inactive, ready, recording, paused, stopped
  
  // Clean up all media streams
  const cleanupMediaStreams = useCallback(() => {
    // Stop microphone stream
    if (micStream) {
      micStream.getTracks().forEach(track => track.stop());
      setMicStream(null);
    }
    
    // Stop camera stream
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    
    // Stop screen stream
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
      setScreenStream(null);
    }
    
    // Reset device states
    setDeviceStates({
      microphone: false,
      camera: false,
      screen: false,
    });
    
    // Reset recording state
    setScreenRecorderConfig(null);
    setCameraRecorderConfig(null);
    setRecordingStatus('inactive');
  }, [micStream, cameraStream, screenStream]);

  // Context value object - all the states and functions to be exposed
  const value = {
    // UI state
    stage,
    setStage,
    
    // Device states
    deviceStates,
    setDeviceStates,
    
    // Device lists
    audioInputDevices,
    setAudioInputDevices,
    videoInputDevices,
    setVideoInputDevices,
    audioOutputDevices,
    setAudioOutputDevices,
    
    // Selected devices
    selectedMic,
    setSelectedMic,
    selectedVideo,
    setSelectedVideo,
    
    // Audio testing
    testAudio,
    setTestAudio,
    
    // Media streams
    screenStream,
    setScreenStream,
    cameraStream,
    setCameraStream,
    micStream,
    setMicStream,
    
    // UI state
    isLoading,
    setIsLoading,
    
    // Recording functionality - separate for screen and camera
    screenRecorderConfig,
    setScreenRecorderConfig,
    cameraRecorderConfig,
    setCameraRecorderConfig,
    recordingStatus,
    setRecordingStatus,
    
    // Utility functions
    cleanupMediaStreams
  };

  return (
    <RoomContext.Provider value={value}>
      {children}
    </RoomContext.Provider>
  );
}

export function useRoom() {
  const context = useContext(RoomContext);
  if (!context) {
    throw new Error('useRoom must be used within a RoomProvider');
  }
  return context;
}