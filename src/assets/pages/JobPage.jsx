import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"

import { ApplicantList } from "../components/RecruiterDashboard/applicant-list"
import { DashboardHeader } from "../components/RecruiterDashboard//header"
import { JobDetails } from "../components/RecruiterDashboard//job-details"
import { DashboardSidebar } from "../components/RecruiterDashboard//sidebar"
import { Button } from "../../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { getJobById } from "../../lib/data"
import { ThemeProvider } from "../components/theme-provider";

export default function JobPage() {
  const params = useParams()
  const jobId = params.id
  const [job, setJob] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const jobData = await getJobById(jobId)
        setJob(jobData)
      } catch (error) {
        console.error("Failed to fetch job:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchJob()
  }, [jobId])

  if (loading) {
    return (
      <ThemeProvider defaultTheme="dark">
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar />
        <div className="flex-1">
          <DashboardHeader />
          <main className="container mx-auto p-4 md:p-6">
            <div className="flex animate-pulse flex-col space-y-4">
              <div className="h-8 w-1/3 rounded-md bg-muted"></div>
              <div className="h-4 w-1/4 rounded-md bg-muted"></div>
              <div className="h-64 rounded-md bg-muted"></div>
            </div>
          </main>
        </div>
      </div>
      </ThemeProvider>
    )
  }

  if (!job) {
    return (
      <ThemeProvider defaultTheme="dark">
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar />
        <div className="flex-1">
          <DashboardHeader />
          <main className="container mx-auto p-4 md:p-6">
            <div className="flex flex-col items-center justify-center space-y-4 py-12">
              <h2 className="text-2xl font-bold">Job not found</h2>
              <p className="text-muted-foreground">
                The job posting you're looking for doesn't exist or has been removed.
              </p>
              <Button asChild>
                <a href="/recruiter-dashboard">Return to Dashboard</a>
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
    <div className="flex min-h-screen bg-background text-foreground">
      <DashboardSidebar />
      <div className="flex-1">
        <DashboardHeader />
        <main className="container mx-auto p-4 md:p-6">
          <div className="mb-6 flex items-center">
            <Button variant="outline" size="sm" asChild className="mr-4">
              <a href="/recruiter-dashboard">
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
                Back
              </a>
            </Button>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{job.title}</h1>
          </div>

          <Tabs defaultValue="details" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="details">Job Details</TabsTrigger>
              <TabsTrigger value="applicants">
                Applicants
                {job.applicants && (
                  <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                    {job.applicants.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="details">
              <JobDetails job={job} />
            </TabsContent>
            <TabsContent value="applicants">
              <ApplicantList applicants={job.applicants || []} />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
    </ThemeProvider>
  )
}

