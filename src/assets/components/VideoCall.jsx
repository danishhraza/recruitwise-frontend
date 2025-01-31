import React from "react"
import Webcam from "react-webcam";
import { useRoom } from "../Context/RoomContext";
import { Button, ConfigProvider, Space} from "antd";
import { MicIcon, PhoneCallIcon, PhoneOffIcon, ScreenShareIcon, SettingsIcon, VideoIcon } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
  } from "../../components/ui/tooltip"
  
function VideoCall () {
    const {selectedMic,selectedVideo}=useRoom()
    console.log("video call comp: ",selectedVideo)
  const videoConstraints = {
    height:1600,
    width:2000,
    facingMode: "user",
    deviceId:selectedVideo.key
  }
    return (
    <div className="w-full h-screen flex justify-center items-center">
        <div className="relative flex justify-center">

      <Webcam videoConstraints={videoConstraints} className="rounded-3xl"/>
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
            <Button icon={<MicIcon color="white" size={'40px'}/>} size="large" color="none" variant="text"/>
                </TooltipTrigger>
                <TooltipContent>
                    Toggle Mic
                </TooltipContent>
                </Tooltip>
                <Tooltip>
                <TooltipTrigger>
            <Button icon={<VideoIcon color="white" size={'40px'}/>} size="large" color="none" variant="text"/>
                </TooltipTrigger>
                <TooltipContent>
                    Toggle Video
                </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger>
            <Button icon={<ScreenShareIcon color="white" size={'40px'}/>} size="large" color="none" variant="text"/>
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
};

export default VideoCall;
