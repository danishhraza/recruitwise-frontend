import React, { useState, useRef } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Play, PauseIcon, Volume2, SquareIcon, Maximize2, ChevronUp } from "lucide-react";
import { ProctoringResults } from "../components/RecruiterDashboard/proctor-component-dark"
import { Card } from "../../components/ui/card"
import ReactPlayer from "react-player"

export default function InterviewPlatform() {
  const [activeTab, setActiveTab] = useState("Interview");
  const applicant = {
    name: "Sarah Miller",
    favorite: false,
    role: "Frontend Developer",
    experience: 5,
    rate: 65,
    location: "Austin, TX • USA",
    skills: ["React", "TypeScript", "CSS"],
    certifications: [
      { name: "AWS Certified", primary: false },
      { name: "React", primary: true },
    ],
    hiringSignals: [
      "5 years of experience with modern frontend frameworks",
      "Strong portfolio of responsive and accessible web applications",
    ],
    email: "sarah.miller@example.com",
    phone: "+1 (555) 987-6543",
    links: [
      { type: "Resume", url: "#" },
      { type: "GitHub", url: "https://github.com/sarahmiller" },
      { type: "Portfolio", url: "https://sarahmiller.dev" },
    ],
    interviewScore: 82,
    skillRatings: {
      React: 8,
      TypeScript: 9,
      CSS: 9,
      "Communication Skills": 7
    }
  }

  // State for collapsible sections
  const [collapsedSections, setCollapsedSections] = useState({
    hiringSignal: false,
    contactInfo: true,
    links: true,

  });

  // Toggle collapse state for a section
  const toggleSection = (section) => {
    setCollapsedSections({
      hiringSignal: section === 'hiringSignal' ? !collapsedSections.hiringSignal : true,
      contactInfo: section === 'contactInfo' ? !collapsedSections.contactInfo : true,
      links: section === 'links' ? !collapsedSections.links : true,
    });
  };

  return (
    
    <div className="flex flex-col text-white z-10 md:w-[55%] w-[90%] border bg-[#050505] rounded-t-[1rem] border-1 border-gray-400 rounded-lg">

      {/* Title bar with dots */}
      <div className="h-6 bg-white flex items-center px-3 rounded-t-[1rem]">
        <div className="flex space-x-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex md:flex-row flex-col flex-1">
        {/* Left sidebar */}
        <div className="md:w-80 w-full border-r border-zinc-800 flex flex-col">
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
              <Badge className="bg-zinc-800 text-white text-xs border-none">AWS Certified</Badge>
              <Badge className="bg-blue-900 text-white text-xs border-none">React</Badge>
            </div>
          </div>
          
          {/* Collapsible Strong Hiring Signal section */}
          <div className="border-t hidden md:block border-zinc-800 p-3 hover:bg-slate-800">
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
          <div className="border-t hidden md:block border-zinc-800 p-3 hover:bg-slate-800">
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
          <div className="border-t hidden md:block border-zinc-800 p-3 hover:bg-slate-800">
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
          
        </div>
        
        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          <Tabs defaultValue="Interview" className="w-full" onValueChange={setActiveTab}>
            <div className="border-b-2 border-blue-800">
              <TabsList className="h-12 rounded-none bg-transparent">
                <TabsTrigger 
                  value="Interview"
                  className={`px-3 md:px-6 rounded-none h-12 text-xs md:text-sm border-b-2 data-[state=active]:border-white border-transparent ${activeTab === "Interview" ? "text-white" : "text-zinc-400"}`}
                >
                  Scores and Transcript
                </TabsTrigger>
                <TabsTrigger 
                  value="Proctoring Result" 
                  className={`px-3 md:px-6 rounded-none h-12 text-xs md:text-sm border-b-2 data-[state=active]:border-white border-transparent ${activeTab === "Proctoring Result" ? "text-white" : "text-zinc-400"}`}
                >
                  Proctoring Result
                </TabsTrigger>
              </TabsList>
            </div>
            
            <div className="flex flex-1">
              <div className=" p-4 relative">
                <TabsContent value="Interview" class="lg:max-h-[490px] md:overflow-y-scroll md:p-3 relative">
                <div className="space-y-6">                
                    <InterviewScore applicant={applicant} />
                    <InterviewVideo applicant={applicant} />
                </div>
                </TabsContent>
                
                <TabsContent value="Proctoring Result" class="lg:max-h-[490px] md:overflow-y-scroll md:p-3 relative">
                  <ProctoringResults applicant={applicant} />
                </TabsContent> 
              </div>
            
            </div>
          </Tabs>
        </div>
      </div>
      
      {/* Bottom action bar */}
      <div className="h-16 border-t border-zinc-800 flex items-center px-4 justify-between">
        <div className="flex space-x-2">
          <Button variant="destructive" className="border-none text-white flex items-center space-x-1 h-9">
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

function InterviewScore({ applicant }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Interview Performance</h3>
        <div className="bg-primary/10 text-primary font-semibold px-4 py-2 rounded-full">
          Overall Score: {applicant.interviewScore}/100
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-4">
        {Object.entries(applicant.skillRatings).map(([skill, rating]) => (
          <SkillRatingChart key={skill} skill={skill} rating={rating} />
        ))}
      </div>
    </div>
  )
}

function SkillRatingChart({ skill, rating }) {
  // Calculate percentage for the donut chart
  const percentage = (rating / 10) * 100;
  
  // Define colors based on rating
  let color = "text-red-500";
  if (rating >= 8) {
    color = "text-emerald-500";
  } else if (rating >= 6) {
    color = "text-amber-500";
  }

  return (
    <Card className="p-4 flex flex-col items-center bg-transparent border-white/40 text-white">
      <h4 className="font-medium mb-3">{skill}</h4>
      <div className="relative w-14 h-14">
        {/* Background circle */}
        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            className="text-muted stroke-current"
            strokeWidth="10"
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
          />
          {/* Foreground circle */}
          <circle
            className={`${color} stroke-current`}
            strokeWidth="10"
            strokeLinecap="round"
            cx="50"
            cy="50"
            r="40"
            fill="transparent"
            strokeDasharray={`${percentage * 2.51} 251`}
          />
        </svg>
        {/* Rating text in the middle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`${color} text-xl font-bold`}>{rating}</span>
        </div>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        {rating >= 8 ? "Excellent" : rating >= 6 ? "Good" : "Needs Improvement"}
      </p>
    </Card>
  )
}

function InterviewVideo() {
    const playerRef = useRef(null)
    const [muted, setMuted] = useState(false)
  return (
    <Card className="overflow-hidden bg-[#0D1117]">
        <div className="aspect-video">
          <ReactPlayer
            ref={playerRef}
            url="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
            width="100%"
            height="100%"
            muted={muted}
            controls={true}
            config={{
              file: {
                attributes: {
                  style: { width: '100%', height: '100%' }
                }
              }
            }}
          />
        </div>
      <div className="p-4">
        <p className="text-sm text-white">
          Watch Bryan's full interview here.
        </p>
      </div>
    </Card>
  )
}




