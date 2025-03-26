import React, { useState } from 'react';
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mic, Video, MoreVertical, Info, Users, MessageSquare } from "lucide-react";

const VideoChat = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'RecruitWise AI',
      content: 'I saw on your resume that you worked on an object detection model at Tesla. Could you walk me through what part of the model you worked on?',
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
    },
    {
      sender: 'Sophie',
      content: 'Sure, so I focused on the data processing aspects of model training. For example, I built data pipelines in Python for cleaning video data.',
      timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    },
    {
      sender: 'RecruitWise AI',
      content: 'Very cool! Could you walk me through how you built the data pipeline and what Python libraries you used?',
      timestamp: new Date(Date.now() - 1000 * 60 * 1).toISOString(),
    },
  ]);

  return (
    <div className="flex flex-col md:flex-row max-h-96 w-full md:w-[80%] border-[1px] border-white rounded-lg overflow-hidden">
      {/* Video Feed - Full width on mobile, 2/3 on desktop */}
      <div className="w-full md:w-2/3 md:p-4 p-2 bg-gray-900 relative">
        <div className="h-64 md:h-full overflow-hidden relative rounded-lg">
          {/* Main video feed */}
          <div className="h-full relative rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <img 
                src="/images/pov-interview5.jpg" 
                alt="Video of woman with curly hair" 
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Name label */}
            <div className="absolute bottom-4 left-4 bg-black/40 text-white px-3 py-1 rounded-md">
              <span>Sophie</span>
            </div>
            
            {/* Bottom controls */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
              <Button variant="secondary" size="icon" className="rounded-full bg-gray-800 text-white hover:bg-gray-700">
                <Mic className="h-5 w-5" />
              </Button>
              <Button variant="secondary" size="icon" className="rounded-full bg-gray-800 text-white hover:bg-gray-700">
                <Video className="h-5 w-5" />
              </Button>
              <Button variant="secondary" size="icon" className="rounded-full bg-gray-800 text-white hover:bg-gray-700">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
            
            {/* Participant thumbnail */}
            <div className="absolute bottom-4 right-4 w-32 h-24 bg-gray-800 rounded-lg overflow-hidden border-2 border-white">
              <div className="relative h-full">
                <img 
                  src="/images/call-logo.jpg" 
                  alt="Video thumbnail of RecruitWise AI" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute bottom-1 left-1 bg-black/40 text-white px-2 py-0.5 text-xs rounded-md">
                  <span>RecruitWise AI</span>
                </div>
                <div className="absolute top-1 right-1">
                  <div className="w-6 h-6 bg-gray-700 rounded-full flex items-center justify-center">
                    <Mic className="h-3 w-3 text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Transcript - Hidden on mobile, full width on desktop */}
      <div className="hidden md:flex md:w-1/3 p-4 flex-col bg-gray-900">
        <Card className="flex-1 overflow-hidden flex flex-col rounded-lg">
          <div className="p-3 border-b flex items-center justify-between">
            <h3 className="text-lg font-medium">Live Transcript</h3>
          </div>
          
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-6">
              {messages.map((message, index) => (
                <div key={index} className="space-y-1">
                  <div className="font-semibold text-sm">{message.sender}</div>
                  <div className={`text-sm p-3 rounded-lg ${message.sender === 'Sophie' ? 'bg-blue-500 text-white ml-auto max-w-xs' : 'bg-gray-100 text-gray-900 max-w-xs'}`}>
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          
          <div className="p-3 border-t flex justify-between">
            <div className="flex space-x-2">
              <Button variant="ghost" size="icon">
                <Info className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Users className="h-5 w-5" />
              </Button>
            </div>
            <Button variant="ghost" size="icon">
              <MessageSquare className="h-5 w-5" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default VideoChat;