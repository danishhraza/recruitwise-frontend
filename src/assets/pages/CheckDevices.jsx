import { Button, ConfigProvider, Dropdown, Slider, Space, Typography } from "antd";
import { DownOutlined } from '@ant-design/icons';
import React, { useEffect, useRef, useState } from "react"
import Webcam from "react-webcam";
import { toast } from "sonner"
import { CheckCircle } from "lucide-react";
import { useRoom } from "../Context/RoomContext";

function CheckDevices () {
    const {setStage,deviceSettings,setDeviceSettings,audioInputDevices,setAudioInputDevices,videoInputDevices,setVideoInputDevices,audioOutputDevices,setAudioOutputDevices,
      selectedMic,setSelectedMic,selectedVideo,setSelectedVideo,isLoading,setIsLoading,screenStream, setScreenStream} = useRoom()
    const [testAudio,setTestAudio] = useState(false);
    // Audio Visualizer
    const [micLevel, setMicLevel] = useState(0);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const dataArrayRef = useRef(null);
    const sourceRef = useRef(null);
    // -----------------

    const [deviceStates, setDeviceStates] = useState({
      microphone: false,
      camera: false,
      screen: false
    });

    const videoConstraints = {
        width: 600,
        height: 500,
        facingMode: "user",
        deviceId: selectedVideo.key
      };
      
      useEffect(() => {
        const checkDevicePermissions = async () => {
            // Ensure loading toast appears first
            await new Promise(resolve => setTimeout(resolve, 0));
            toast.loading("Checking for microphone and camera permissions", {
                duration: Infinity,
                id: 'permission-check'
            });
    
            try {
                const cameraPermission = await navigator.permissions.query({ name: 'camera' });
                if (cameraPermission.state !== 'granted') {
                    await navigator.mediaDevices.getUserMedia({ video: true });
                }
                
                const videoDevices = await navigator.mediaDevices.enumerateDevices();
                const videos = videoDevices
                    .filter((device) => device.kind === "videoinput")
                    .map((device) => ({ key: device.deviceId, label: device.label }));
                setSelectedVideo(videos[0]);
                setVideoInputDevices(videos);
                setDeviceStates(prev => ({ ...prev, camera: true }));
    
            } catch (err) {
              setDeviceStates(prev => ({ ...prev, camera: false }));

                if (err.name === 'NotAllowedError') {
                    toast.error("Camera permissions denied, allow to proceed.", {
                        duration: Infinity,
                        id: 'Camera-permission-error'
                    });
                }
            }
    
            try {
                const microphonePermission = await navigator.permissions.query({ name: 'microphone' });
                if (microphonePermission.state !== 'granted') {
                    await navigator.mediaDevices.getUserMedia({ audio: true });
                }
    
                const mediaDevices = await navigator.mediaDevices.enumerateDevices();
                const microphones = mediaDevices
                    .filter((device) => device.kind === "audioinput")
                    .map((device) => ({ key: device.deviceId, label: device.label }));
                setSelectedMic(microphones.find((device) => device.key === "default"));
                setDeviceStates(prev => ({ ...prev, microphone: true }));
                const speakers = mediaDevices.filter((device) => device.kind === "audiooutput");
                setAudioOutputDevices(speakers);
                setAudioInputDevices(microphones);
    
            } catch (err) {
                if (err.name === 'NotAllowedError') {
                    toast.error("Microphone permissions denied, allow to proceed.", {
                        duration: Infinity,
                        id: 'Mic-permission-error'
                    });
                }
                setDeviceStates(prev => ({ ...prev, microphone: false }));
            } finally {
                toast.dismiss('permission-check');
            }
        };
    
        checkDevicePermissions();
    }, []);

useEffect(() => {
    async function setupMicrophone() {
      if (!testAudio) return;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          audio: { deviceId: selectedMic.key } 
        });

        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;

        sourceRef.current = audioContextRef.current.createMediaStreamSource(stream);
        sourceRef.current.connect(analyserRef.current);

        dataArrayRef.current = new Uint8Array(analyserRef.current.frequencyBinCount);

        updateMicLevel();
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    }

    function updateMicLevel() {
      if (!analyserRef.current) return;

      analyserRef.current.getByteFrequencyData(dataArrayRef.current);
      const average = dataArrayRef.current.reduce((a, b) => a + b, 0) / dataArrayRef.current.length;
      setMicLevel(average);

      requestAnimationFrame(updateMicLevel);
    }

    setupMicrophone();

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [testAudio]);

async function shareScreen(){
  try {
    setIsLoading(true)
    const screenPermission = await navigator.mediaDevices.getDisplayMedia({ 
      video: {
        displaySurface: "monitor" // Forces entire screen selection
    },
        audio: false 
    });
    
    const videoTrack = screenPermission.getVideoTracks()[0];
    const settings = videoTrack.getSettings();
    if (settings.displaySurface !== "monitor") {
        stream.getTracks().forEach(track => track.stop());
        throw new Error("Please select entire screen");
    }

    if (screenPermission) {
        setScreenStream(screenPermission);
        setDeviceStates(prev => ({ ...prev, screen: true }));
    }
    console.log(screenPermission)
    toast.dismiss('screen-share')
  } catch (err) {
    setDeviceStates(prev => ({ ...prev, screen: false }));
    toast.error("Please share your entire screen", {duration: Infinity,id:'screen-share'});
  }finally{
    setIsLoading(false)
  }
}

let selected =""
function handleMicClick(e){
    selected = audioInputDevices.find(device => device.key == e.key)
    console.log(selected)
    setSelectedMic(selected)
}
function handleVideoClick(e){
    selected = videoInputDevices.find(device => device.key == e.key)
    console.log(selected)
    setSelectedVideo(selected)
}
const areAllDevicesReady = deviceStates.microphone && deviceStates.camera && deviceStates.screen;
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-[1000px] p-4 h-[400px] rounded-xl flex gap-6 bg-slate-200">
            <Webcam className="rounded-xl" audio={testAudio} videoConstraints={videoConstraints} audioConstraints={{deviceId:selectedMic.key}}/>
        <div id="checklist" className="gabarito-400 text-2xl flex flex-col justify-evenly gap-3">
        <div>
        <label>Select Microphone</label>
        <Dropdown
        menu={{
            items:audioInputDevices,
            selectable: true,
            defaultSelectedKeys: ['default'],
            onClick: (key)=>{handleMicClick(key)}
        }}
        >
    <Typography.Link>
      <Space>
        {selectedMic.label}
        <DownOutlined />
      </Space>
    </Typography.Link>
  </Dropdown>
  <div className="flex gap-4">
  <ConfigProvider theme={{
    components:{
        Slider:{
            railSize:10,
            trackBg: "#1677ff"
        }
    }
  }}>
    <Slider value={micLevel} disabled={!testAudio} className="w-full"/>
  </ConfigProvider>
  <Button onClick={()=>{setTestAudio(!testAudio)}}>{testAudio?'Stop':'Test'}</Button>
  </div>
      </div>
      <div className="flex flex-col">
        <label>
            Select Video Camera
        </label>
        <Dropdown
        menu={{
            items:videoInputDevices,
            selectable: true,
            defaultSelectedKeys:[selectedVideo.key],
            selectedKeys:[selectedVideo.key],
            onClick: (key)=>{handleVideoClick(key)}
        }}
        >
    <Typography.Link>
      <Space>
        {selectedVideo.label}
        <DownOutlined />
      </Space>
    </Typography.Link>
  </Dropdown>
      </div>
      <div className="flex justify-between items-center">
        <label>
            Share your screen
        </label>
        <Button className={screenStream != null && 'pointer-events-none'} color={screenStream!=null && 'green'} icon={screenStream != null && <CheckCircle size={'15px'} color="green"/>} variant="filled" loading={isLoading} onClick={()=>shareScreen()}>{screenStream == null ? 'Share':'Sharing Screen'}</Button>
      </div>
      <div className="flex justify-end">
      <Button disabled={!areAllDevicesReady} variant="solid" color="purple" size="large" onClick={()=>setStage('call')}>Join Call</Button>
      </div>
        </div>
      </div>
    </div>
  )
};

export default CheckDevices;
