import { useParams, Link } from "react-router-dom"
import { useEffect, useState } from "react"

import { ApplicantList } from "../components/RecruiterDashboard/applicant-list"
import { DashboardHeader } from "../components/RecruiterDashboard/header"
import { JobDetails } from "../components/RecruiterDashboard/job-details"
import { DashboardSidebar } from "../components/RecruiterDashboard/sidebar"
import { Button } from "../../components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import axios from "../../api/axios"
import ApplicantProfilePage from "./ApplicantProfilePage"

export default function JobPage() {
  const [job, setJob] = useState(null)
  const [applicants, setApplicants] = useState([])
  const [selectedApplicant, setSelectedApplicant] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { jobId } = useParams()

  // Helper function to format applied date
  const formatAppliedDate = (dateString) => {
    const date = new Date(dateString)
    
    // Format date as DD/MM/YYYY
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    
    // Format time as HH:MM:SS AM/PM
    const hours = date.getHours()
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const formattedHours = (hours % 12 || 12).toString().padStart(2, '0')
    
    return `${day}/${month}/${year} ${formattedHours}:${minutes}:${seconds} ${ampm}`
  }

  // Helper function to format job type (e.g., "Full-Time" -> "Full Time")
  const formatJobType = (jobType) => {
    if (!jobType) return jobType
    return jobType.replace(/-/g, ' ')
  }

  // Helper function to format employment type (e.g., "OnSite" -> "On Site")
  const formatEmploymentType = (employmentType) => {
    if (!employmentType) return employmentType
    // Add space before capital letters (except the first one)
    return employmentType.replace(/([a-z])([A-Z])/g, '$1 $2')
  }

  // Helper function to format any date to DD/MM/YYYY HH:MM:SS AM/PM
  const formatDateTime = (dateString) => {
    if (!dateString) return dateString
    const date = new Date(dateString)
    
    // Format date as DD/MM/YYYY
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    
    // Format time as HH:MM:SS AM/PM
    const hours = date.getHours()
    const minutes = date.getMinutes().toString().padStart(2, '0')
    const seconds = date.getSeconds().toString().padStart(2, '0')
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const formattedHours = (hours % 12 || 12).toString().padStart(2, '0')
    
    return `${day}/${month}/${year} ${formattedHours}:${minutes}:${seconds} ${ampm}`
  }

  // Helper function to map interview status
  const mapInterviewStatus = (status) => {
    switch (status) {
      case 'interview_scheduled':
        return 'Pending'
      case 'interviewed':
        return 'Completed'
      default:
        return status // Return original status if no mapping found
    }
  }

  // Function to handle applicant selection
  const handleApplicantSelect = (applicant) => {
    setSelectedApplicant(applicant)
  }

  // Function to go back to applicant list
  const handleBackToList = () => {
    setSelectedApplicant(null)
  }

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
          // If it's a 404 error (no applicants), return an object with empty data array
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
        
        // Process applicants data to format dates and map interview status
        const processedApplicants = (applicantsResponse.data || []).map(applicant => ({
          ...applicant,
          formattedAppliedDate: formatAppliedDate(applicant.appliedDate),
          mappedInterviewStatus: mapInterviewStatus(applicant.interviewStatus)
        }));
        
        // Update state with responses
        setJob(jobResponse.data);
        setApplicants(processedApplicants);
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
  const formattedDeadline = formatDateTime(job.deadline)

  // Format posted date
  const formattedPostedDate = formatDateTime(job.postedDate || job.createdAt)

  // Format salary if needed
  const formattedSalary = job.salary ? 
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(job.salary) : 
    'Not specified'

  // Enhanced job object with formatted values
  const enhancedJob = {
    ...job,
    formattedDeadline,
    formattedPostedDate,
    formattedSalary,
    formattedJobType: formatJobType(job.jobType),
    formattedEmploymentType: formatEmploymentType(job.employmentType),
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
          <div className="space-y-6">
            {/* Job Information Card */}
            <div className="rounded-lg border bg-card p-6">
              <h2 className="mb-4 text-xl font-semibold">Job Information</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h3 className="mb-1 text-sm font-medium text-muted-foreground">Job Type</h3>
                  <p className="text-base">{enhancedJob.formattedJobType || 'Not specified'}</p>
                </div>
                <div>
                  <h3 className="mb-1 text-sm font-medium text-muted-foreground">Employment Type</h3>
                  <p className="text-base">{enhancedJob.formattedEmploymentType || 'Not specified'}</p>
                </div>
                <div>
                  <h3 className="mb-1 text-sm font-medium text-muted-foreground">Salary</h3>
                  <p className="text-base">{enhancedJob.formattedSalary}</p>
                </div>
                <div>
                  <h3 className="mb-1 text-sm font-medium text-muted-foreground">Location</h3>
                  <p className="text-base">{job.location || 'Not specified'}</p>
                </div>
                <div>
                  <h3 className="mb-1 text-sm font-medium text-muted-foreground">Application Deadline</h3>
                  <p className="text-base">{enhancedJob.formattedDeadline}</p>
                </div>
                <div>
                  <h3 className="mb-1 text-sm font-medium text-muted-foreground">Posted Date</h3>
                  <p className="text-base">{enhancedJob.formattedPostedDate}</p>
                </div>
              </div>
            </div>
            
            {/* Job Description Card */}
            <div className="rounded-lg border bg-card p-6">
              <h2 className="mb-4 text-xl font-semibold">Job Description</h2>
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                  {job.description || 'No description provided.'}
                </p>
              </div>
            </div>

            {/* Requirements Card */}
            {job.requirements && (
              <div className="rounded-lg border bg-card p-6">
                <h2 className="mb-4 text-xl font-semibold">Requirements</h2>
                <div className="prose max-w-none">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">
                    {job.requirements}
                  </p>
                </div>
              </div>
            )}

            {/* Skills Card */}
            {job.skills && job.skills.length > 0 && (
              <div className="rounded-lg border bg-card p-6">
                <h2 className="mb-4 text-xl font-semibold">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="rounded-md bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        <TabsContent value="applicants">
          {selectedApplicant ? (
            <ApplicantProfilePage
              applicant={selectedApplicant}
              jobId={jobId}
              onBack={handleBackToList}
            />
          ) : (
            <ApplicantList
              applicants={applicants || []}
              jobId={jobId}
              onApplicantSelect={handleApplicantSelect}
            />
          )}
        </TabsContent>
      </Tabs>
    </main>
  )
}