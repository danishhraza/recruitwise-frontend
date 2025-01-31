import React, { createContext, useContext, useState } from 'react';

const RoomContext = createContext();

export function RoomProvider({ children }) {
  const [stage, setStage] = useState('checkDevices');
  const [deviceSettings, setDeviceSettings] = useState({
    microphone: false,
    camera: false,
    screenShare: false
  });
  const [audioInputDevices,setAudioInputDevices] = useState([]);
      const [videoInputDevices,setVideoInputDevices] = useState([]);
      const [audioOutputDevices,setAudioOutputDevices] = useState([]);
          const [selectedMic,setSelectedMic] = useState("Select Microphone")
          const [selectedVideo,setSelectedVideo] = useState("Select Video Source");
      const [testAudio,setTestAudio] = useState(false);
      const [screenStream, setScreenStream] = useState(null);
      const [isLoading,setIsLoading] = useState(false);
      
  const value = {
    stage,
    setStage,
    deviceSettings,
    setDeviceSettings,
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
    setSelectedVideo

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