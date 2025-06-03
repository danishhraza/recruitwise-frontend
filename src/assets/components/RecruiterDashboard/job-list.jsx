import { useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useForm, Controller } from "react-hook-form"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import "../../../styles/datepicker-custom.css" // Add custom datepicker styles

import { Badge } from "../../../components/ui/badge"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card"
import { Input } from "../../../components/ui/input"
import { Skeleton } from "../../../components/ui/skeleton"
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetFooter,
  SheetClose
} from "../../../components/ui/sheet"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../../../components/ui/select"
import { Textarea } from "../../../components/ui/textarea"
import { Label } from "../../../components/ui/label"
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "../../../components/ui/form"
import { format } from "date-fns"
import { Plus } from "lucide-react"
import { cn } from "../../../lib/utils"
import axios from "../../../api/axios"
import { toast } from "sonner"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

export function JobList() {
  const navigate = useNavigate()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [open, setOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState("basic")
  const [customQuestions, setCustomQuestions] = useState([])
  const [jobToDelete, setJobToDelete] = useState(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // Custom questions handling
  const addCustomQuestion = () => {
    setCustomQuestions([...customQuestions, ""]);
    // Also update the form value
    const currentQuestions = form.getValues("customQuestions") || [];
    form.setValue("customQuestions", [...currentQuestions, ""]);
  };

  const updateCustomQuestion = (index, value) => {
    const updatedQuestions = [...customQuestions];
    updatedQuestions[index] = value;
    setCustomQuestions(updatedQuestions);
    
    // Update the form value
    form.setValue("customQuestions", updatedQuestions);
  };

  const removeCustomQuestion = (index) => {
    const updatedQuestions = customQuestions.filter((_, i) => i !== index);
    setCustomQuestions(updatedQuestions);
    
    // Update the form value
    form.setValue("customQuestions", updatedQuestions);
  };

async function fetchJobs() {
  setLoading(true)
  try {
    const response = await axios.get("/recruiter/my-jobs", { withCredentials: true })
    console.log("Jobs fetched:", response.data)
    
    // Sort jobs by creation date (most recent first)
    const sortedJobs = response.data.sort((a, b) => 
      new Date(b.createdAt) - new Date(a.createdAt)
    )
    
    setJobs(sortedJobs)
  } catch (error) {
    console.error("Failed to fetch jobs:", error)
    toast.error("Failed to fetch jobs")
  } finally {
    setLoading(false)
  }
}

  useEffect(() => {
    fetchJobs()
  }, [])

  const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  customQuestions: z.array(z.string()),
  deadline: z.date(),
  salary: z.number().min(0),
  jobType: z.string().min(1, "Job type is required"),
  skills: z.array(z.string()).min(1, "At least one skill is required"), // This makes skills required
  experience: z.string().min(1, "Experience is required"),
  employmentType: z.string().min(1, "Employment type is required"),
  requirements: z.string().min(1, "Requirements are required"),
  location: z.string().min(1, "Location is required"),
  coverLetterRequired: z.boolean()
})

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      customQuestions: [],
      deadline: new Date(),
      salary: 0,
      jobType: "",
      skills: [],
      experience: "",
      employmentType: "",
      requirements: "",
      location: "",
      coverLetterRequired: false
    }
  })

 const onSubmit = async (data) => {
  try {
    // Format the data to match the required payload structure
    const formattedData = {
      ...data,
      deadline: data.deadline.toISOString(),
      // Ensure jobType and employmentType match expected values
      jobType: data.jobType,
      employmentType: data.employmentType,
      // Only include customQuestions if there are any
      ...(data.customQuestions.length > 0 ? { customQuestions: data.customQuestions } : {})
    };
    
    await axios.post("/jobs/create", formattedData, {withCredentials: true})
    console.log(formattedData)
    
    // Close the sheet first
    setOpen(false)
    
    // Reset form
    form.reset()
    
    // Reset custom questions state
    setCustomQuestions([])
    
    // Reset to basic page
    setCurrentPage("basic")
    
    // Refresh the job list to get the latest data
    await fetchJobs()
    
    // Show success message
    toast.success("Job created successfully!")
    
  } catch (error) {
    console.error("Failed to create job:", error)
    toast.error("Failed to create job. Please try again.")
  }
}

  const filteredJobs = jobs.filter(
    (job) =>
      job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleJobClick = (jobId) => {
    navigate(`/dashboard/${jobId}`)
  }

  const handleDeleteClick = (e, job) => {
    e.stopPropagation() // Prevent card click from triggering
    setJobToDelete(job)
    setShowDeleteDialog(true)
  }

  const confirmDelete = async () => {
    if (!jobToDelete) return

    try {
      await axios.delete(`/jobs/${jobToDelete.id}`, { withCredentials: true })
      setShowDeleteDialog(false)
      setJobToDelete(null)
      toast.success("Job deleted successfully")
      fetchJobs() // Refresh the job list
    } catch (error) {
      console.error("Failed to delete job:", error)
      toast.error("Failed to delete job")
    }
  }

  // Job type configurations with display labels and backend values
  const jobTypeOptions = [
    { value: "Full-Time", label: "Full Time" },
    { value: "Part-Time", label: "Part Time" },
    { value: "Contract", label: "Contract" },
    { value: "Temporary", label: "Temporary" },
    { value: "Internship", label: "Internship" }
  ]

  const employmentTypeOptions = [
    { value: "OnSite", label: "On Site" },
    { value: "Remote", label: "Remote" },
    { value: "Hybrid", label: "Hybrid" }
  ]

  // Helper functions to get display labels
  const getJobTypeLabel = (value) => {
    const option = jobTypeOptions.find(opt => opt.value === value)
    return option ? option.label : value
  }

  const getEmploymentTypeLabel = (value) => {
    const option = employmentTypeOptions.find(opt => opt.value === value)
    return option ? option.label : value
  }

  if (loading) {
    return (
      <div>
        <div className="mb-4 flex w-full items-center justify-between space-x-2">
          <Skeleton className="h-10 w-full max-w-md" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-[220px] w-full rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex w-full items-center justify-between">
        <Input
          placeholder="Search jobs by title, or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
        <Button onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Post Job
        </Button>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <h3 className="mb-2 text-xl font-medium">No job postings found</h3>
          <p className="mb-6 text-muted-foreground">
            {searchQuery
              ? `No jobs match your search for "${searchQuery}"`
              : "You haven't created any job postings yet."}
          </p>
          <Button onClick={() => setOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Create New Job
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => (
            <Card
              key={job.id}
              className="cursor-pointer rounded-lg border-gray-500/25 bg-primary-foreground hover:border-primary hover:shadow-md relative"
              onClick={() => handleJobClick(job.id)}
            >
              <div 
                className="absolute top-2 right-2 z-10 rounded-full bg-gray-200 dark:bg-gray-700 p-1 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600"
                onClick={(e) => handleDeleteClick(e, job)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </div>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="line-clamp-2 text-xl">{job.title}</CardTitle>
                  <Badge variant={job.isActive ? "default" : "secondary"}>{job.isActive ? "Active" : "Closed"}</Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="mb-4 space-y-2 text-sm">
                  <div className="flex items-center text-muted-foreground">
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
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    {job.location}
                  </div>
                  <div className="flex items-center text-muted-foreground">
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
                      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                      <line x1="16" x2="16" y1="2" y2="6" />
                      <line x1="8" x2="8" y1="2" y2="6" />
                      <line x1="3" x2="21" y1="10" y2="10" />
                    </svg>
                    Posted: {new Date(job.createdAt).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-muted-foreground">
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
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    Deadline: {new Date(job.deadline).toLocaleDateString()}
                  </div>
                  <div className="flex items-center text-muted-foreground">
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
                      <path d="M20 7h-9" />
                      <path d="M14 17H5" />
                      <circle cx="17" cy="17" r="3" />
                      <circle cx="7" cy="7" r="3" />
                    </svg>
                    {getJobTypeLabel(job.jobType)} • {getEmploymentTypeLabel(job.employmentType)}
                  </div>
                  <div className="flex items-center text-muted-foreground">
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
                      <path d="M12 2v2" />
                      <path d="M12 20v2" />
                      <path d="m4.93 4.93 1.41 1.41" />
                      <path d="m17.66 17.66 1.41 1.41" />
                      <path d="M2 12h2" />
                      <path d="M20 12h2" />
                      <path d="m6.34 17.66-1.41 1.41" />
                      <path d="m19.07 4.93-1.41 1.41" />
                    </svg>
                    {job.experience}
                  </div>
                  <div className="flex items-center text-muted-foreground">
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
                      <path d="M8 21s1-1 4-1 4 1 4 1" />
                      <path d="M12 3v2" />
                      <path d="M20 20a8 8 0 1 0-16 0" />
                      <path d="M12 10a3 3 0 1 0 0 5" />
                    </svg>
                    Salary: {new Intl.NumberFormat('en-US', { 
                      style: 'currency', 
                      currency: 'PKR',
                      minimumFractionDigits: 0
                    }).format(job.salary)}
                  </div>
                </div>
                {job.skills && job.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-3">
                    {job.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <Button variant="ghost" size="sm">
                  View Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Job Creation Drawer */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent className="w-full sm:max-w-xl overflow-y-auto">
          <SheetHeader className="mb-6">
            <SheetTitle>Post a New Job</SheetTitle>
            <SheetDescription>
              Fill in the details below to create a new job posting.
            </SheetDescription>
          </SheetHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {currentPage === "basic" ? (
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Title</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Senior Frontend Developer" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Job Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe the job role, responsibilities, and requirements" 
                            className="min-h-24"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="salary"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Salary</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="Monthly salary" 
                              {...field}
                              onChange={e => field.onChange(Number(e.target.value))}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. New York, NY" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="jobType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Job Type</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select job type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {jobTypeOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="employmentType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Employment Type</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {employmentTypeOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Experience Required</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. 3+ years of JavaScript experience" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="skills"
                    render={({ field: { onChange, ...field } }) => {
                      const [skillsInput, setSkillsInput] = useState(field.value?.join(", ") || "")
                      
                      return (
                        <FormItem>
                          <FormLabel>Required Skills</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="e.g. React, TypeScript, Node.js (comma separated)" 
                              {...field}
                              value={skillsInput}
                              onChange={(e) => {
                                const value = e.target.value
                                setSkillsInput(value)
                              
                                // Only update the form value on blur or when component unmounts
                                // This allows normal typing behavior while editing
                              }}
                              onBlur={() => {
                                // Convert the comma-separated string to an array when focus leaves the input
                                const skillsArray = skillsInput
                                  .split(',')
                                  .map(skill => skill.trim())
                                  .filter(Boolean)
                                
                                onChange(skillsArray)
                              }}
                              required
                            />
                          </FormControl>
                          <FormDescription>
                            Enter skills separated by commas
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )
                    }}
                  />

                  <FormField
                    control={form.control}
                    name="requirements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Requirements</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="List specific requirements for the position" 
                            className="min-h-20"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="deadline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Application Deadline</FormLabel>
                        <FormControl>
                          <Controller
                            control={form.control}
                            name="deadline"
                            render={({ field }) => (
                              <DatePicker
                                selected={field.value ? new Date(field.value) : null}
                                onChange={(date) => field.onChange(date)}
                                dateFormat="MMMM d, yyyy"
                                minDate={new Date()}
                                placeholderText="Select deadline date"
                                className="datepicker-input w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                calendarClassName="datepicker-calendar"
                                popperClassName="datepicker-popper"
                                wrapperClassName="datepicker-wrapper w-full"
                                showPopperArrow={false}
                              />
                            )}
                          />
                        </FormControl>
                        <FormDescription>
                          Select the application deadline date
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="coverLetterRequired"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <input
                            type="checkbox"
                            checked={field.value}
                            onChange={field.onChange}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Require Cover Letter</FormLabel>
                          <FormDescription>
                            Require applicants to submit a cover letter with their application
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />

                  <div className="mt-6 flex justify-end">
                    <Button 
                      type="button" 
                      variant="secondary"
                      onClick={() => setCurrentPage("questions")}
                    >
                      Add Custom Questions
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Custom Questions</h3>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={addCustomQuestion}
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add Question
                      </Button>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="customQuestions"
                      render={({ field }) => (
                        <FormItem>
                          <FormDescription>
                            Add custom questions for applicants to answer. Leave empty if no custom questions are needed.
                          </FormDescription>
                          <div className="space-y-3">
                            {customQuestions.map((_, index) => (
                              <div key={index} className="flex gap-2">
                                <Input
                                  placeholder={`Question ${index + 1}`}
                                  value={customQuestions[index]}
                                  onChange={(e) => updateCustomQuestion(index, e.target.value)}
                                  className="flex-1"
                                />
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  onClick={() => removeCustomQuestion(index)}
                                >
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
                                    className="h-4 w-4"
                                  >
                                    <path d="M3 6h18" />
                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                  </svg>
                                </Button>
                              </div>
                            ))}
                            {customQuestions.length === 0 && (
                              <div className="p-4 border border-dashed rounded-md text-center text-muted-foreground">
                                No custom questions added. Click "Add Question" to add one.
                              </div>
                            )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="mt-6 flex justify-between">
                    <Button 
                      type="button" 
                      variant="secondary"
                      onClick={() => setCurrentPage("basic")}
                    >
                      Back to Details
                    </Button>
                  </div>
                </div>
              )}

              <SheetFooter className="mt-6 flex-col sm:flex-row gap-4">
                <SheetClose asChild>
                  <Button type="button" variant="outline">Cancel</Button>
                </SheetClose>
                <Button type="submit">Create Job</Button>
              </SheetFooter>
            </form>
          </Form>
        </SheetContent>
      </Sheet>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Confirm Delete</h3>
            <p className="mb-6">
              Are you sure you want to delete the job posting "{jobToDelete?.title}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteDialog(false)
                  setJobToDelete(null)
                }}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Yes, Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}