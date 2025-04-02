import { useState } from "react"
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

export default function ApplicantProfilePage() {
  const { id } = useParams()
  const applicant = getApplicantById(id)
  const [activeTab, setActiveTab] = useState("scores")

  if (!applicant) {
    return (
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
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <div className="flex-1">
        <DashboardHeader />
        <main className="container mx-auto p-4 md:p-6">
          <div className="mb-6 flex items-center">
            <Button variant="outline" size="sm" asChild className="mr-4">
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
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{applicant.name}</h1>
            {applicant.favorite && <Star className="ml-2 h-5 w-5 fill-yellow-400 text-yellow-400" />}
            <div className="ml-auto">
              <span className="text-sm text-muted-foreground mr-2">{applicant.views} views</span>
              <span className="text-sm text-amber-500">Expires in {applicant.expiresIn}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Left column - Applicant details */}
            <div className="lg:col-span-3 space-y-6">
              <ApplicantDetails applicant={applicant} />
              <HiringSignal applicant={applicant} />
              <ContactInfo applicant={applicant} />
              <Links applicant={applicant} />
              <Reviews applicant={applicant} />
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
                    <InterviewVideo applicant={applicant} />
                    <InterviewQuestions applicant={applicant} />
                  </div>
                </TabsContent>

                <TabsContent value="proctoring" className="mt-0">
                  <Card className="p-6">
                    <h3 className="text-lg font-medium mb-4">Proctoring Results</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span>Identity Verification</span>
                          <Badge variant="outline" className="bg-green-500/10 text-green-500">
                            Passed
                          </Badge>
                        </div>
                        <Progress value={100} className="h-2 bg-muted" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span>Environment Check</span>
                          <Badge variant="outline" className="bg-green-500/10 text-green-500">
                            Passed
                          </Badge>
                        </div>
                        <Progress value={100} className="h-2 bg-muted" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span>Browser Focus</span>
                          <Badge variant="outline" className="bg-amber-500/10 text-amber-500">
                            Warning
                          </Badge>
                        </div>
                        <Progress value={85} className="h-2 bg-muted" />
                        <p className="text-sm text-muted-foreground mt-1">Browser focus lost for 15 seconds at 12:45</p>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span>Audio Quality</span>
                          <Badge variant="outline" className="bg-green-500/10 text-green-500">
                            Good
                          </Badge>
                        </div>
                        <Progress value={95} className="h-2 bg-muted" />
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span>Video Quality</span>
                          <Badge variant="outline" className="bg-green-500/10 text-green-500">
                            Good
                          </Badge>
                        </div>
                        <Progress value={90} className="h-2 bg-muted" />
                      </div>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>

              <div className="flex justify-between">
                <div className="space-x-2">
                  <Button variant="outline">
                    Decline
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </Button>
                  <Button variant="outline">Interview</Button>
                </div>
                <Button className="bg-emerald-600 hover:bg-emerald-700">Hire {applicant.name.split(" ")[0]}</Button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function ApplicantDetails({ applicant }) {
  return (
    <div className="space-y-4">
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
    <div className="space-y-3">
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
    <div className="space-y-3">
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
    <div className="space-y-3">
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

function Reviews({ applicant }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Reviews ({applicant.reviews.length})</h3>
        <ChevronDown className="h-4 w-4" />
      </div>
      <div className="space-y-3">
        {applicant.reviews.slice(0, 1).map((review, index) => (
          <div key={index} className="space-y-1">
            <div className="flex items-center">
              <span className="font-medium">{review.reviewer}</span>
              <span className="text-muted-foreground text-sm ml-2">• {review.date}</span>
            </div>
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-muted"}`}
                />
              ))}
            </div>
            <p className="text-sm">{review.comment}</p>
          </div>
        ))}
        {applicant.reviews.length > 1 && (
          <Button variant="ghost" size="sm" className="w-full text-primary">
            View all {applicant.reviews.length} reviews
          </Button>
        )}
      </div>
    </div>
  )
}

function InterviewVideo({ applicant }) {
  return (
    <Card className="overflow-hidden">
      <div className="relative">
        <div className="aspect-video bg-black">
          <img
            src={applicant.interviewImage || "/placeholder.svg?height=480&width=854"}
            alt="Interview recording"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <Button size="icon" className="rounded-full bg-primary/90 hover:bg-primary h-12 w-12">
              <Play className="h-6 w-6 ml-1" />
            </Button>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button size="icon" variant="ghost" className="text-white h-8 w-8">
              <Play className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="text-white h-8 w-8">
              <Volume2 className="h-4 w-4" />
            </Button>
            <div className="flex-1 mx-2">
              <div className="h-1 bg-white/30 rounded-full">
                <div className="h-1 bg-primary rounded-full" style={{ width: "40%" }}></div>
              </div>
            </div>
            <span className="text-xs">00:12 / 02:12</span>
          </div>
          <Button size="icon" variant="ghost" className="text-white h-8 w-8">
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="p-4">
        <p className="text-sm">
          {applicant.currentQuestion ||
            "Can you describe your experience with building cloud-based, streaming microservices at scale? Please provide specific examples, including the technologies and architectures used."}
        </p>
      </div>
    </Card>
  )
}

function InterviewQuestions({ applicant }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Knockout Questions</h3>
      <div className="space-y-3">
        {applicant.questions.map((question, index) => (
          <Card key={index} className="p-3 hover:bg-accent/50 cursor-pointer">
            <div className="flex items-start">
              <div className="h-12 w-12 rounded bg-muted flex-shrink-0 overflow-hidden mr-3">
                {question.thumbnail ? (
                  <img src={question.thumbnail || "/placeholder.svg"} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs text-muted-foreground">
                    {question.time}
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h4 className="font-medium">{question.title}</h4>
                <p className="text-sm text-muted-foreground">{question.duration} Min</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">Technical Interview</h3>
        <Card className="p-3 hover:bg-accent/50 cursor-pointer">
          <div className="flex items-start">
            <div className="h-12 w-12 rounded bg-muted flex-shrink-0 overflow-hidden mr-3 flex items-center justify-center text-xs">
              48 × 48
            </div>
            <div className="flex-1">
              <h4 className="font-medium">React Interview</h4>
              <p className="text-sm text-muted-foreground">37:12 Min</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

