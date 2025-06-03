import { useState, useRef, useEffect} from "react"
import { useParams, useLocation, Link  } from "react-router-dom"
import { Star, ChevronDown, ExternalLink, Play, Volume2, Maximize2 } from "lucide-react"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Avatar, AvatarFallback } from "../../components/ui/avatar"
import { Progress } from "../../components/ui/progress"
import { ProctoringResults } from "../components/RecruiterDashboard/proctor-component"
import ReactPlayer from "react-player"

export default function ApplicantProfilePage({ applicant, jobId, onBack }) {

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    console.log("Selected applicant:", applicant)
  }, [applicant])

  const location = useLocation()
  const [activeTab, setActiveTab] = useState("scores")

  if (!applicant) {
    return (

          <main className="container mx-auto p-4 md:p-6">
            <div className="flex flex-col items-center justify-center space-y-4 py-12">
              <h2 className="text-2xl font-bold">Applicant not found</h2>
              <p className="text-muted-foreground">
                The applicant you're looking for doesn't exist or has been removed.
              </p>
              <Button asChild>
                <Link to={`/dashboard/${jobId}`}>Return to Dashboard</Link>
              </Button>
            </div>
          </main>

    )
  }

  return (
        <main className="container mx-auto p-4 md:p-6">
          <div className="mb-6 flex items-center">
            <Button variant="outline" size="sm" asChild className="mr-4 text-foreground">
              <Link to={`/dashboard/${jobId}`}>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1 h-4 w-4"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
                Back to Job
              </Link>
            </Button>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl text-primary">{applicant.name}</h1>
            {applicant.favorite}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 text-foreground">
            {/* Left column - Applicant details */}
            <div className="lg:col-span-3 space-y-6">
              <ApplicantDetails applicant={applicant} />
              <HiringSignal applicant={applicant} />
              <ContactInfo applicant={applicant} />
            </div>

            {/* Right column - Interview content */}
            <div className="lg:col-span-9 space-y-6">
              <Tabs defaultValue="scores" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="mb-4 md:justify-start w-full bg-primary-foreground">
                  <TabsTrigger value="scores">Scores and Transcript</TabsTrigger>
                  <TabsTrigger value="proctoring">Proctoring Result</TabsTrigger>
                </TabsList>

                <TabsContent value="scores" className="mt-0">
                  <div className="space-y-6">                
                    <InterviewScore applicant={applicant} />
                    <InterviewVideo applicant={applicant} />
                  </div>
                </TabsContent>

                <TabsContent value="proctoring" className="mt-0">
                  {/* Replace with the new ProctoringResults component */}
                  <ProctoringResults proctoringResults={applicant.proctoringResults} videoLink={applicant.videoUrl}/>
                </TabsContent>
              </Tabs>

              <div className="flex justify-between">
                <div className="space-x-2">
                  <Button variant="destructive">
                    Decline
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                  <Button variant="outline">Interview</Button>
                </div>
                <Button className="bg-emerald-600 text-white hover:bg-emerald-700">Hire {applicant.name.split(" ")[0]}</Button>
              </div>
            </div>
          </div>
        </main>
  )
}

function ApplicantDetails({ applicant }) {
  return (
    <div className="space-y-4 bg-primary-foreground p-4 rounded-lg shadow-md">
      <div className="flex items-center">
        <Avatar className="h-12 w-12 mr-4">
          <AvatarFallback className="bg-primary/10 text-primary">
            {applicant.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}

function HiringSignal({ applicant }) {
  return (
    <div className="space-y-3 bg-primary-foreground p-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">AI Remarks</h3>
        <ChevronDown className="h-4 w-4" />
      </div>
      <ul className="space-y-2 list-disc pl-5">
        {applicant.evaluationSummary}
      </ul>
    </div>
  )
}

function ContactInfo({ applicant }) {
  return (
    <div className="space-y-3 bg-primary-foreground p-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Contact info</h3>
        <ChevronDown className="h-4 w-4" />
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Email</span>
          <a href={`mailto:${applicant.email}`} className="text-primary">
            {applicant.email}
          </a>
        </div>
      </div>
    </div>
  )
}

function InterviewVideo({ applicant }) {
  const playerRef = useRef(null)
  const [muted, setMuted] = useState(true)

  const videoUrl = applicant?.screenShareUrl

  if (!videoUrl) {
    return (
      <Card className="bg-primary-foreground p-4">
        <p className="text-sm text-muted-foreground">No interview video available.</p>
      </Card>
    )
  }

  return (
    <Card className="overflow-hidden bg-primary-foreground">
      <div className="aspect-video">
        <ReactPlayer
          ref={playerRef}
          url={videoUrl}
          playing={false}
          controls={true}
          muted={muted}
          width="100%"
          height="100%"
          config={{
            file: {
              attributes: {
                type: "video/webm",
                controlsList: "nodownload",
              },
            },
          }}
        />
      </div>
      <div className="p-4">
        <p className="text-sm text-muted-foreground">Watch {applicant.name?.split(" ")[0]}'s full interview here.</p>
      </div>
    </Card>
  )
}


function InterviewScore({ applicant }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Interview Performance</h3>
        <div className="bg-primary/10 text-primary font-semibold px-4 py-2 rounded-full">
          Overall Score: {applicant.scores?.overallScore}/10
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-4">
          {applicant.scores?.skillScores?.map((skillObj, index) => (
            <SkillRatingChart
              key={skillObj._id || index}
              skill={skillObj.skill}
              score={skillObj.score}
              remarks={skillObj.remarks}
            />
          ))}
      </div>
    </div>
  )
}

function SkillRatingChart({ skill, score, remarks }) {
  // Calculate percentage for the donut chart
  const percentage = (score / 10) * 100;
  
  // Define colors based on score
  let color = "text-red-500";
  if (score >= 8) {
    color = "text-emerald-500";
  } else if (score >= 6) {
    color = "text-amber-500";
  }

  return (
    <Card className="p-4 flex flex-col items-center bg-primary-foreground">
      <h4 className="font-medium mb-3">{skill}</h4>
      <div className="relative w-24 h-24">
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
        {/* Score text in the middle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className={`${color} text-xl font-bold`}>{score}</span>
        </div>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        {remarks || "No remarks available"}
      </p>
    </Card>
  )
}