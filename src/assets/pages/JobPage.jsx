import { useParams, Link } from "react-router-dom"
import { useEffect, useState } from "react"

import { ApplicantList } from "../components/RecruiterDashboard/applicant-list"
import { DashboardHeader } from "../components/RecruiterDashboard/header"
import { JobDetails } from "../components/RecruiterDashboard/job-details"
import { DashboardSidebar } from "../components/RecruiterDashboard/sidebar"
import { Button } from "../../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import axios from "../../api/axios"

export default function JobPage() {
  const [job, setJob] = useState(null)
  const [applicants, setApplicants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { jobId } = useParams()

 useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true)
        // Create job request
        const jobRequest = axios.get(`/jobs/${jobId}`, { withCredentials: true })
        
        // Create applicants request that handles 400 error
        const applicantsRequest = axios.get(`/jobs/${jobId}/applicants`, { 
          withCredentials: true 
        }).catch(error => {
          // If it's a 400 error (no applicants), return an object with empty data array
          if (error.response && error.response.status === 404) {
            return { data: [] };
          }
          // Otherwise, rethrow the error to be caught by the outer catch
          throw error;
        });
        
        // Execute both requests in parallel
        const [jobResponse, applicantsResponse] = await Promise.all([
          jobRequest,
          applicantsRequest
        ]);
        
        console.log("Job details response:", jobResponse.data);
        console.log("Applicants response:", applicantsResponse.data);
        
        // Update state with responses
        setJob(jobResponse.data);
        setApplicants(applicantsResponse.data || []);
        setError(null);

      } catch (error) {
        console.error("Error fetching job details:", error);
        setError("Failed to load job details");
        // Ensure applicants is an empty array in case of error
        setApplicants([]);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId]);

  if (loading) {
    return (
      <main className="container mx-auto p-4 md:p-6">
        <div className="flex animate-pulse flex-col space-y-4">
          <div className="h-8 w-1/3 rounded-md bg-muted"></div>
          <div className="h-4 w-1/4 rounded-md bg-muted"></div>
          <div className="h-64 rounded-md bg-muted"></div>
        </div>
      </main>
    )
  }

  if (error || !job) {
    return (
      <main className="container mx-auto p-4 md:p-6">
        <div className="flex flex-col items-center justify-center space-y-4 py-12">
          <h2 className="text-2xl font-bold">Job not found</h2>
          <p className="text-muted-foreground">
            {error || "The job posting you're looking for doesn't exist or has been removed."}
          </p>
          <Button asChild>
            <Link to="/dashboard">Return to Dashboard</Link>
          </Button>
        </div>
      </main>
    )
  }

  // Format deadline date
  const deadlineDate = new Date(job.deadline)
  const formattedDeadline = deadlineDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  // Format salary if needed
  const formattedSalary = job.salary ? 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(job.salary) : 
    'Not specified'

  // Enhanced job object with formatted values
  const enhancedJob = {
    ...job,
    formattedDeadline,
    formattedSalary,
    // Add any other formatted properties here if needed
  }

  return (
    <main className="container mx-auto p-4 md:p-6">
      <div className="mb-6 flex items-center">
        <Button variant="outline" size="sm" asChild className="mr-4">
          <Link to="/dashboard">
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
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{job.title}</h1>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="details">Job Details</TabsTrigger>
          <TabsTrigger value="applicants">
            Applicants
            {job && (
              <span className="ml-2 rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
                {applicants ? applicants.length : 0}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        <TabsContent value="details">
          <JobDetails job={enhancedJob} />
        </TabsContent>
        <TabsContent value="applicants">
          <ApplicantList applicants={applicants || []} jobId={jobId} />
        </TabsContent>
      </Tabs>
    </main>
  )
}