import { useState, useRef } from "react"
import { useParams } from "react-router-dom"
import { Star, ChevronDown, ExternalLink, Play, Volume2, Maximize2 } from "lucide-react"
import { DashboardHeader } from "../components/RecruiterDashboard/header"
import { DashboardSidebar } from "../components/RecruiterDashboard/sidebar"
import { Badge } from "../../components/ui/badge"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Avatar, AvatarFallback } from "../../components/ui/avatar"
import { Progress } from "../../components/ui/progress"
import { getApplicantById } from "../../lib/applicant-data"
import { ThemeProvider } from "../components/theme-provider";
import { ProctoringResults } from "../components/RecruiterDashboard/proctor-component"
import ReactPlayer from "react-player"

export default function ApplicantProfilePage() {
  const { id } = useParams()
  const applicant = getApplicantById(id)
  const [activeTab, setActiveTab] = useState("scores")

  if (!applicant) {
    return (
      <ThemeProvider defaultTheme="dark">
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar />
        <div className="flex-1">
          <DashboardHeader />
          <main className="container mx-auto p-4 md:p-6">
            <div className="flex flex-col items-center justify-center space-y-4 py-12">
              <h2 className="text-2xl font-bold">Applicant not found</h2>
              <p className="text-muted-foreground">
                The applicant you're looking for doesn't exist or has been removed.
              </p>
              <Button asChild>
                <a href="/">Return to Dashboard</a>
              </Button>
            </div>
          </main>
        </div>
      </div>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider defaultTheme="dark">
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <div className="flex-1">
        <DashboardHeader />
        <main className="container mx-auto p-4 md:p-6">
          <div className="mb-6 flex items-center">
            <Button variant="outline" size="sm" asChild className="mr-4 text-foreground">
              <a href="/jobs/job-1">
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
              </a>
            </Button>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl text-primary">{applicant.name}</h1>
            {applicant.favorite && <Star className="ml-2 h-5 w-5 fill-yellow-400 text-yellow-400" />}
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 text-foreground">
            {/* Left column - Applicant details */}
            <div className="lg:col-span-3 space-y-6">
              <ApplicantDetails applicant={applicant} />
              <HiringSignal applicant={applicant} />
              <ContactInfo applicant={applicant} />
              <Links applicant={applicant} />
            </div>

            {/* Right column - Interview content */}
            <div className="lg:col-span-9 space-y-6">
              <Tabs defaultValue="scores" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="mb-4 w-full justify-start">
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
                  <ProctoringResults applicant={applicant} />
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
      </div>
    </div>
    </ThemeProvider>
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

      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Role</span>
          <span className="font-medium">{applicant.role}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Exp</span>
          <span className="font-medium">{applicant.experience} yrs</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Rate</span>
          <span className="font-medium">${applicant.rate}/hr</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Location</span>
          <span className="font-medium text-right">{applicant.location}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Skills</span>
          <span className="font-medium text-right">{applicant.skills.join(", ")}</span>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {applicant.certifications.map((cert, index) => (
            <Badge key={index} variant={cert.primary ? "default" : "secondary"}>
              {cert.name}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}

function HiringSignal({ applicant }) {
  return (
    <div className="space-y-3 bg-primary-foreground p-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Strong Hiring Signal</h3>
        <ChevronDown className="h-4 w-4" />
      </div>
      <ul className="space-y-2 list-disc pl-5">
        {applicant.hiringSignals.map((signal, index) => (
          <li key={index} className="text-sm">
            {signal}
          </li>
        ))}
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
        <div className="flex justify-between">
          <span className="text-muted-foreground">Phone</span>
          <a href={`tel:${applicant.phone}`} className="text-primary">
            {applicant.phone}
          </a>
        </div>
      </div>
    </div>
  )
}

function Links({ applicant }) {
  return (
    <div className="space-y-3 bg-primary-foreground p-4 rounded-lg shadow-md">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Links</h3>
        <ChevronDown className="h-4 w-4" />
      </div>
      <div className="space-y-2">
        {applicant.links.map((link, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-muted-foreground">{link.type}</span>
            <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary flex items-center">
              View <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}

function InterviewVideo() {
    const playerRef = useRef(null)
    const [muted, setMuted] = useState(false)
  return (
    <Card className="overflow-hidden bg-primary-foreground">
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
        <p className="text-sm">
          Watch Bryan's full interview here.
        </p>
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