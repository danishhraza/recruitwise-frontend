import React, { createContext, useContext, useState } from 'react';

const RoomContext = createContext();

export function RoomProvider({ children }) {
  const [stage, setStage] = useState('checkDevices');

  const [deviceStates, setDeviceStates] = useState({
    microphone: false,
    camera: false,
    screen: false
  });

  const [audioInputDevices,setAudioInputDevices] = useState([]);
      const [videoInputDevices,setVideoInputDevices] = useState([]);
      const [audioOutputDevices,setAudioOutputDevices] = useState([]);
          const [selectedMic,setSelectedMic] = useState("Select Microphone")
          const [selectedVideo,setSelectedVideo] = useState("Select Video Source");
      const [testAudio,setTestAudio] = useState(false);
      const [screenStream, setScreenStream] = useState(null);
      const [isLoading,setIsLoading] = useState(false);
      const [cameraStream, setCameraStream] = useState(null);
      const [micStream, setMicStream] = useState(null);
      
  const value = {
    stage,
    setStage,
    audioInputDevices,
    setAudioInputDevices,
    videoInputDevices,
    setVideoInputDevices,
    audioOutputDevices,
    setAudioOutputDevices,
    screenStream,
    setScreenStream,
    testAudio,
    setTestAudio,
    isLoading,
    setIsLoading,
    selectedMic,
    setSelectedMic,
    selectedVideo,
    setSelectedVideo,
    cameraStream,
    setCameraStream,
    micStream,
    setMicStream,
    deviceStates,
    setDeviceStates
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