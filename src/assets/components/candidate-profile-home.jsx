import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Play, PauseIcon, Volume2, SquareIcon, Maximize2, ChevronUp } from "lucide-react";

export default function InterviewPlatform() {
  const [activeTab, setActiveTab] = useState("interviews");
  
  // State for collapsible sections
  const [collapsedSections, setCollapsedSections] = useState({
    hiringSignal: false,
    contactInfo: true,
    links: true,
    reviews: true
  });

  // Toggle collapse state for a section
  const toggleSection = (section) => {
    setCollapsedSections({
      hiringSignal: section === 'hiringSignal' ? !collapsedSections.hiringSignal : true,
      contactInfo: section === 'contactInfo' ? !collapsedSections.contactInfo : true,
      links: section === 'links' ? !collapsedSections.links : true,
      reviews: section === 'reviews' ? !collapsedSections.reviews : true
    });
  };

  return (
    
    <div className="flex flex-col text-white z-10 w-[65%] border bg-black rounded-t-[1rem] border-1 border-gray-400 rounded-lg">

      {/* Title bar with dots */}
      <div className="h-6 bg-white flex items-center px-3 rounded-t-[1rem]">
        <div className="flex space-x-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex flex-1">
        {/* Left sidebar */}
        <div className="w-80 border-r border-zinc-800 flex flex-col">
          <div className="p-3 flex items-center">
            <Avatar className="h-9 w-9 mr-3 bg-zinc-700">
              <div className="h-full w-full flex items-center justify-center text-sm font-medium">JH</div>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center">
                <h3 className="font-semibold">Bryan Johnson</h3>
                <div className="ml-2 flex items-center">
                  <span className="text-yellow-500">★</span>
                  <span className="text-zinc-500 ml-1">🔗</span>
                  <span className="text-zinc-500 ml-1">•••</span>
                </div>
              </div>
              <div className="flex text-xs text-zinc-400">
                <span>326 views</span>
                <span className="ml-2 text-amber-500">Expires in 4 days</span>
              </div>
            </div>
          </div>
          
          <div className="border-t border-zinc-800 p-3">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-zinc-400">Role</span>
              <span className="flex items-center">
                <span className="h-3 w-1 bg-green-500 mr-1"></span>
                Senior Full Stack
              </span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-zinc-400">Exp</span>
              <span>8 yrs</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-zinc-400">Rate</span>
              <span>$80/hr</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-zinc-400">Location</span>
              <span>Boca Raton, FL • USA</span>
            </div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-zinc-400">Skills</span>
              <span>React, Node</span>
            </div>
            <div className="flex mt-3 gap-2">
              <Badge className="bg-zinc-800 text-white text-xs border-none">AI Certified</Badge>
              <Badge className="bg-blue-900 text-white text-xs border-none">React</Badge>
            </div>
          </div>
          
          {/* Collapsible Strong Hiring Signal section */}
          <div className="border-t border-zinc-800 p-3 hover:bg-slate-800">
            <div 
              className="flex justify-between items-center mb-2 cursor-pointer" 
              onClick={() => toggleSection('hiringSignal')}
            >
              <span className="font-semibold">Strong Hiring Signal</span>
              <span className="text-zinc-500">
                {collapsedSections.hiringSignal ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
              </span>
            </div>
            {!collapsedSections.hiringSignal && (
              <ul className="text-sm">
                <li className="mb-2 flex">
                  <span className="mr-2">•</span>
                  <span>Over 8 years of experience, 6 years w/ React</span>
                </li>
                <li className="flex">
                  <span className="mr-2">•</span>
                  <span>He spent a significant amount of time as a university professor, which reflects his deep knowledge.</span>
                </li>
              </ul>
            )}
          </div>
          
          {/* Collapsible Contact info section */}
          <div className="border-t border-zinc-800 p-3 hover:bg-slate-800">
            <div 
              className="flex justify-between items-center mb-2 cursor-pointer"
              onClick={() => toggleSection('contactInfo')}
            >
              <span className="font-semibold">Contact info</span>
              <span className="text-zinc-500">
                {collapsedSections.contactInfo ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
              </span>
            </div>
            {!collapsedSections.contactInfo && (
              <div className="text-sm text-zinc-400">
                <p>Email: bryan.johnson@example.com</p>
                <p>Phone: (555) 123-4567</p>
              </div>
            )}
          </div>
          
          {/* Collapsible Links section */}
          <div className="border-t border-zinc-800 p-3 hover:bg-slate-800">
            <div 
              className="flex justify-between items-center mb-2 cursor-pointer"
              onClick={() => toggleSection('links')}
            >
              <span className="font-semibold">Links</span>
              <span className="text-zinc-500">
                {collapsedSections.links ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
              </span>
            </div>
            {!collapsedSections.links && (
              <div className="text-sm text-zinc-400">
                <p className="mb-1">Portfolio: bryanjohnson.dev</p>
                <p className="mb-1">GitHub: github.com/bryanjohnson</p>
                <p>LinkedIn: linkedin.com/in/bryanjohnson</p>
              </div>
            )}
          </div>
          
          {/* Collapsible Reviews section */}
          <div className="border-t border-zinc-800 p-3 hover:bg-slate-800">
            <div 
              className="flex justify-between items-center mb-2 cursor-pointer"
              onClick={() => toggleSection('reviews')}
            >
              <span className="font-semibold">Reviews (4)</span>
              <span className="text-zinc-500">
                {collapsedSections.reviews ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
              </span>
            </div>
            {!collapsedSections.reviews && (
              <div className="text-sm text-zinc-400">
                <div className="mb-2">
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-1">★★★★★</span>
                    <span className="text-sm">Tech Lead at Acme Inc.</span>
                  </div>
                  <p>"Excellent problem solver with deep React knowledge."</p>
                </div>
                <div className="mb-2">
                  <div className="flex items-center">
                    <span className="text-yellow-500 mr-1">★★★★★</span>
                    <span className="text-sm">Senior Dev at TechCorp</span>
                  </div>
                  <p>"Great team player, delivered on time."</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          <Tabs defaultValue="interviews" className="w-full" onValueChange={setActiveTab}>
            <div className="border-b-2 border-blue-800">
              <TabsList className="h-12 rounded-none bg-transparent">
                <TabsTrigger 
                  value="interviews"
                  className={`px-6 rounded-none h-12 text-sm border-b-2 data-[state=active]:border-white border-transparent ${activeTab === "interviews" ? "text-white" : "text-zinc-400"}`}
                >
                  Interviews
                </TabsTrigger>
                <TabsTrigger 
                  value="resume" 
                  className={`px-6 rounded-none h-12 text-sm border-b-2 data-[state=active]:border-white border-transparent ${activeTab === "resume" ? "text-white" : "text-zinc-400"}`}
                >
                  Resume
                </TabsTrigger>
                <TabsTrigger 
                  value="skills"
                  className={`px-6 rounded-none h-12 text-sm border-b-2 data-[state=active]:border-white border-transparent ${activeTab === "skills" ? "text-white" : "text-zinc-400"}`}
                >
                  Skills
                </TabsTrigger>
                <TabsTrigger 
                  value="reviews" 
                  className={`px-6 rounded-none h-12 text-sm border-b-2 data-[state=active]:border-white border-transparent ${activeTab === "reviews" ? "text-white" : "text-zinc-400"}`}
                >
                  Reviews
                </TabsTrigger>
                <TabsTrigger 
                  value="resume2"
                  className={`px-6 rounded-none h-12 text-sm border-b-2 data-[state=active]:border-white border-transparent ${activeTab === "resume2" ? "text-white" : "text-zinc-400"}`}
                >
                  Resume
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="flex flex-1">
              <div className="flex-1 bg-zinc-900 p-4 relative">
                <TabsContent value="interviews" className="h-full m-0 relative">
                  <div className="w-full h-96 bg-zinc-800 rounded-md overflow-hidden relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <img 
                        src="https://placehold.co/500x320/374151/FFFFFF" 
                        alt="Interview video"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0"></div>
                    </div>
                    
                    {/* Video Controls */}
                    <div className="absolute bottom-0 w-full p-2 bg-gradient-to-t from-black/70 to-transparent">
                      <div className="flex items-center">
                        <button className="text-white mr-4">
                          <Play size={16} />
                        </button>
                        <button className="text-white mr-4">
                          <Volume2 size={16} />
                        </button>
                        <div className="flex-1 mx-2">
                          <div className="h-1 bg-zinc-600 rounded-full w-full">
                            <div className="h-1 bg-red-500 rounded-full w-2/3 relative">
                              <div className="absolute -right-1.5 -top-1 w-3 h-3 bg-white rounded-full"></div>
                            </div>
                          </div>
                        </div>
                        <div className="text-white text-xs">
                          00:12 / 02:12
                        </div>
                        <div className="ml-2 flex">
                          <button className="text-white mx-1">
                            <SquareIcon size={14} />
                          </button>
                          <button className="text-white mx-1">
                            <Maximize2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-sm">
                    <p className="mb-4">Can you describe your experience with building cloud-based, streaming microservices at scale? Please provide specific examples, including the technologies and architectures used.</p>
                    
                  </div>
                </TabsContent>
                
                <TabsContent value="resume" className="h-full m-0">
                  <div className="w-full h-full flex items-center justify-center text-zinc-400">
                    Resume content goes here
                  </div>
                </TabsContent>
                
                <TabsContent value="skills" className="h-full m-0">
                  <div className="w-full h-full flex items-center justify-center text-zinc-400">
                    Skills content goes here
                  </div>
                </TabsContent>
                
                <TabsContent value="reviews" className="h-full m-0">
                  <div className="w-full h-full flex items-center justify-center text-zinc-400">
                    Reviews content goes here
                  </div>
                </TabsContent>
                
                <TabsContent value="resume2" className="h-full m-0">
                  <div className="w-full h-full flex items-center justify-center text-zinc-400">
                    Another resume content goes here
                  </div>
                </TabsContent>
              </div>
              
              {/* Right sidebar */}
              <div className="w-64 border-l border-zinc-800">
                <div className="p-3 border-b border-zinc-800">
                  <h4 className="font-medium text-sm">Knockout Questions</h4>
                </div>
                
                <div className="border-b border-zinc-800 p-3 flex hover:bg-slate-800">
                  <div className="w-12 h-12 bg-zinc-800 rounded-md flex items-center justify-center mr-3">
                    <PauseIcon size={16} />
                  </div>
                  <div className="flex flex-col justify-between">
                    <div className="text-xs">Cloud based microservices</div>
                    <div className="text-xs text-zinc-400">02:12 Min</div>
                  </div>
                </div>
                
                <div className="border-b border-zinc-800 p-3 flex hover:bg-slate-800">
                  <div className="w-12 h-12 bg-zinc-800 rounded-md overflow-hidden mr-3">
                    <img src="https://placehold.co/48x48/374151/FFFFFF" alt="Interview thumbnail" />
                  </div>
                  <div className="flex flex-col justify-between">
                    <div className="text-xs">How have you used KafkaStreams or Flink?</div>
                    <div className="text-xs text-zinc-400">03:05 Min</div>
                  </div>
                </div>
                
                <div className="border-b border-zinc-800 p-3 flex hover:bg-slate-800">
                  <div className="w-12 h-12 bg-zinc-800 rounded-md overflow-hidden mr-3">
                    <img src="https://placehold.co/48x48/374151/FFFFFF" alt="Interview thumbnail" />
                  </div>
                  <div className="flex flex-col justify-between">
                    <div className="text-xs">How have you used Flink?</div>
                    <div className="text-xs text-zinc-400">03:08 Min</div>
                  </div>
                </div>
                
                <div className="p-3 border-b border-zinc-800">
                  <h4 className="font-medium text-sm">Why Bryan?</h4>
                </div>
                
                <div className="border-b border-zinc-800 p-3 flex hover:bg-slate-800">
                  <div className="w-12 h-12 bg-zinc-800 rounded-md overflow-hidden mr-3">
                    <img src="https://placehold.co/48x48/374151/FFFFFF" alt="Interview thumbnail" />
                  </div>
                  <div className="flex flex-col justify-between">
                    <div className="text-xs">Why Bryan</div>
                    <div className="text-xs text-zinc-400">02:21 Min</div>
                  </div>
                </div>
                
                <div className="p-3 border-b border-zinc-800">
                  <h4 className="font-medium text-sm">Technical Interviews</h4>
                </div>
                
                <div className="border-b border-zinc-800 p-3 flex hover:bg-slate-800">
                  <div className="w-12 h-12 bg-zinc-800 rounded-md overflow-hidden mr-3">
                    <img src="https://placehold.co/48x48/374151/FFFFFF" alt="Interview thumbnail" />
                  </div>
                  <div className="flex flex-col justify-between">
                    <div className="text-xs">React Interview</div>
                    <div className="text-xs text-zinc-400">37:12 Min</div>
                  </div>
                </div>
              </div>
            </div>
          </Tabs>
        </div>
      </div>
      
      {/* Bottom action bar */}
      <div className="h-16 border-t border-zinc-800 flex items-center px-4 justify-between">
        <div className="flex space-x-2">
          <Button variant="outline" className="bg-zinc-800 border-none text-white flex items-center space-x-1 h-9">
            <span>Decline</span>
            <ChevronDown size={14} />
          </Button>
          <Button variant="outline" className="text-white border-zinc-600 bg-transparent h-9">
            Interview
          </Button>
        </div>
        <Button className="bg-emerald-500 hover:bg-emerald-600 text-white h-9">
          Hire Bryan
        </Button>
      </div>
    </div>
  );
}





