import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Bookmark, ExternalLink } from 'lucide-react';
import { ModeToggle } from "../components/mode-toggle";
import Filters from '../components/Filters';
import { useFilters } from '../Context/FiltersContext';
import SearchBar from '../components/SearchBar';
import { useSearchParams } from 'react-router-dom';
import JobListing from '../components/JobListingPage';
import JobApplicationDrawer from '../components/JobApplicationDrawer';
import { fetchAllJobs, fetchJobById } from '../../lib/data'; // Import functions from data.js
import axios from '../../api/axios';

const JobListingPage = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const { filters, setFilters, setJobs, Jobs } = useFilters();
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchQuery, filteredJobs } = filters;
  const [showFilters, setShowFilters] = useState(false);
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  // Function to sort jobs by most recent first
  const sortJobsByRecent = (jobs) => {
    return jobs.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.postedDate || 0);
      const dateB = new Date(b.createdAt || b.postedDate || 0);
      return dateB - dateA; // Most recent first
    });
  };
  
  async function fetchJobs() {
    try {
      const response = await axios.get('/jobs');
      const jobs = response.data;
      
      // Fetch company data for all jobs using Promise.all
      const jobsWithCompanyData = await Promise.all(
        jobs.map(async (job) => {
          try {
            // Extract company ID
            const companyId = job.company;
            // Fetch company data
            const companyResponse = await axios.get(`/company/${companyId}`);
            const companyData = companyResponse.data;
            
            // Return a new job object with company name instead of company ID
            return {
              ...job,
              company: companyData.name || 'Unknown Company', // Use company name or fallback
              companyLogo: companyData.logo || null, // You can add logo if available
              companyData: companyData // Optional: keep full company data if needed elsewhere
            };
          } catch (companyError) {
            console.error(`Error fetching company data for job ${job._id}:`, companyError);
            // Return job with default company name if company fetch fails
            return {
              ...job,
              company: 'Unknown Company',
              companyLogo: null
            };
          }
        })
      );
      
      // Sort jobs by most recent first
      const sortedJobs = sortJobsByRecent(jobsWithCompanyData);
      
      // Update state with jobs that include company names
      setJobs(sortedJobs);
      setFilters(prev => ({
        ...prev,
        filteredJobs: sortedJobs
      }));
      setLoading(false);
      setError(null);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setLoading(false);
      
      // Check if the error is a 404 (Not Found)
      if (error.response && error.response.status === 404) {
        setError("No jobs found");
        // Set empty jobs array
        setJobs([]);
        setFilters(prev => ({
          ...prev,
          filteredJobs: []
        }));
      } else {
        setError("Error loading jobs. Please try again later.");
      }
    }
  }
  
  // Fetch all jobs when component mounts
  useEffect(() => {
    fetchJobs();
  }, [setFilters]);

  // Helper function to check if job is selected
  const isJobSelected = (job) => {
    if (!selectedJob) return false;
    
    // Check if job ID matches selected job ID (handle both id and _id)
    if (job._id && selectedJob._id) return job._id === selectedJob._id;
    if (job.id && selectedJob.id) return job.id === selectedJob.id;
    if (job._id && selectedJob.id) return job._id === selectedJob.id;
    if (job.id && selectedJob._id) return job.id === selectedJob._id;
    
    return false;
  };

  // Handle job selection
  const handleJobSelect = async (job) => {
    try {
      // If we already have complete job details with company data, use it
      if (job.companyData) {
        setSelectedJob(job);
        return;
      }
      
      // Otherwise fetch complete job details by ID
      const jobId = job._id || job.id;
      const jobDetails = await fetchJobById(jobId);
      
      // If we have the job details but need company data
      if (jobDetails) {
        try {
          // Get company data
          const companyResponse = await axios.get(`/company/${jobDetails.company}`);
          const companyData = companyResponse.data;
          
          // Set selected job with company name
          setSelectedJob({
            ...jobDetails,
            company: companyData.name || 'Unknown Company',
            companyLogo: companyData.logo || null,
            companyData: companyData
          });
        } catch (companyError) {
          console.error('Error fetching company details:', companyError);
          // Set job with unknown company if company fetch fails
          setSelectedJob({
            ...jobDetails,
            company: 'Unknown Company'
          });
        }
      }
    } catch (error) {
      console.error('Error fetching job details:', error);
    }
  };

  const openApplicationDrawer = async () => {
    try {
      // Check if user is authenticated
      const response = await axios.get('/auth/me');
      
      // If successful, open the application drawer
      setIsApplicationOpen(true);
    } catch (error) {
      // If authentication fails, show login dialog
      console.log('User not authenticated:', error);
      setShowLoginDialog(true);
    }
  };

  function handleSearchChange(sQuery) {
    // Update the filters state
    setFilters((prevFilters) => ({
      ...prevFilters,
      searchQuery: sQuery,
    }));    
    // Update the URL parameters while preserving existing parameters
    setSearchParams(prevParams => {
      const jobType = prevParams.get("jobType") || "";
      const currTime = prevParams.get("time") || "";
      const currentExpLevel = prevParams.get("expLevel") || "";
      const currentEType = prevParams.get("eType") || "";
      return {
        ...(sQuery ? { query: sQuery } : {}),
        ...(jobType ? { jobType: jobType } : {}),
        ...(currTime ? { time: currTime } : {}),
        ...(currentEType ? { eType: currentEType } : {}),
        ...(currentExpLevel ? { expLevel: currentExpLevel } : {})
      };
    });
  }

  // Calculate days ago for posted date
  const getDaysAgo = (dateString) => {
    if (!dateString) return 'Date unknown';
    
    const today = new Date();
    const postedDate = new Date(dateString);
    const differenceInTime = today - postedDate;
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
    
    if (differenceInDays < 0) return 'Coming soon';  
    if (differenceInDays === 0) return 'Today';
    if (differenceInDays === 1) return 'Yesterday';
    if (differenceInDays < 7) return `${differenceInDays} days ago`;
    if (differenceInDays < 30) return `${Math.floor(differenceInDays/7)} weeks ago`;
    return `${Math.floor(differenceInDays/30)} months ago`;
  };

  // Format salary as currency
  const formatSalary = (salary) => {
    if (!salary) return 'Not specified';
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'PKR',
      maximumFractionDigits: 0
    }).format(salary);
  };

  // Format employment type for display (OnSite -> On Site, etc.)
  const formatEmploymentType = (type) => {
    if (!type) return '';
    
    // Handle specific employment types
    if (type.toLowerCase() === 'onsite') return 'On Site';
    if (type.toLowerCase() === 'remote') return 'Remote';
    if (type.toLowerCase() === 'hybrid') return 'Hybrid';
    
    // Handle job types and other cases
    return type.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading jobs...</div>;
  }

  return (
    <>
      <div className="hidden md:flex bg-background flex-col h-full mx-0 xl:mx-20 2xl:mx-96">
        {/* Search Bar */}
        <div className="py-8 px-4 sm:px-8 md:px-12 lg:px-16 xl:px-20 border-b">
          <div className="flex flex-col sm:flex-row gap-4">
            <SearchBar 
              initialSearchQuery={searchQuery} 
              onSearch={handleSearchChange} 
              />
            <div className="flex gap-2 items-center">
              <Button 
                onClick={() => setShowFilters(true)}
                variant="outline"
                >
                Filters
              </Button>
            </div>
          </div>
          <ModeToggle className="fixed bottom-7 left-7" />
        </div>
        <Filters open={showFilters} onClose={setShowFilters}/>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Job List */}
          <div className="w-2/5 border-r overflow-auto">
            {error ? (
              <div className="flex justify-center items-center h-full p-8">
                <div className="text-center">
                  <h3 className="text-xl font-medium text-gray-600 dark:text-gray-400 mb-2">{error}</h3>
                  <p className="text-gray-500">Try adjusting your search filters or check back later for new job postings.</p>
                  <Button className="mt-4" onClick={fetchJobs}>Refresh</Button>
                </div>
              </div>
            ) : filteredJobs.length === 0 ? (
              <div className="flex justify-center items-center h-full p-8">
                <div className="text-center">
                  <h3 className="text-xl font-medium text-gray-600 dark:text-gray-400 mb-2">No jobs found</h3>
                  <p className="text-gray-500">Try adjusting your search filters or check back later for new job postings.</p>
                  <Button className="mt-4" onClick={fetchJobs}>Refresh</Button>
                </div>
              </div>
            ) : (
              filteredJobs.map((job) => {
                const jobId = job._id || job.id;
                return (
                  <div 
                    key={jobId} 
                    className={`p-4 border-b cursor-pointer rounded-lg m-2 hover:bg-gray-50 dark:hover:bg-gray-800 ${isJobSelected(job) ? 'bg-blue-50 dark:bg-gray-800' : ''}`}
                    onClick={() => handleJobSelect(job)}
                  >
                    <h3 className="font-medium text-lg">{job.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{job.company}</p>
                    <p className="text-gray-500 text-sm">{job.location}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-xs rounded-md">
                        {formatEmploymentType(job.jobType)}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-xs rounded-md">
                        {formatEmploymentType(job.employmentType)}
                      </span>
                    </div>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {job.skills && job.skills.map((skill, index) => (
                        <span key={`${jobId}-skill-${index}`} className="px-2 py-1 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 text-xs rounded-md">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <p className="text-gray-400 text-xs">{getDaysAgo(job.createdAt || job.postedDate)}</p>
                      <p className="text-gray-600 dark:text-gray-400 text-xs">
                        {formatSalary(job.salary)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Job Details - Sticky Container */}
          <div className="w-3/5 flex flex-col">
            {selectedJob ? (
              <>
                {/* Sticky Header */}
                <div className="sticky top-0 bg-background border-b z-10 p-6 pb-4">
                  <h2 className="text-2xl font-bold">{selectedJob.title}</h2>
                  <p className="text-lg text-blue-600">{selectedJob.company}</p>
                  <p className="text-gray-600 dark:text-gray-400">{selectedJob.location}</p>
                  <p className="text-gray-500">{formatSalary(selectedJob.salary)}</p>
                  <div className="mt-4 flex gap-2">
                    <Button 
                      className="flex items-center gap-2" 
                      onClick={openApplicationDrawer}
                      disabled={!selectedJob.isActive}
                    >
                      <ExternalLink className="w-4 h-4" />
                      Apply now
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Bookmark className="w-4 h-4" />
                      Save
                    </Button>
                  </div>
                  {!selectedJob.isActive && (
                    <p className="text-red-500 mt-2">This job is no longer active</p>
                  )}
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-auto p-6 pt-2">
                  <div className="space-y-6">
                    {/* Job Information */}
                    <Card>
                      <CardContent className="pt-6">
                        <h3 className="text-xl font-semibold mb-4">Job Information</h3>
                        <div className="grid grid-cols-2 gap-y-4">
                          <div>
                            <p className="text-gray-500">Location</p>
                            <p>{selectedJob.location}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Job Type</p>
                            <p>{formatEmploymentType(selectedJob.employmentType)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Employment Type</p>
                            <p>{formatEmploymentType(selectedJob.jobType)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Experience</p>
                            <p>{selectedJob.experience}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Salary</p>
                            <p>{formatSalary(selectedJob.salary)}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Status</p>
                            <div className="flex items-center">
                              <span className={`px-2 py-1 ${selectedJob.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} text-sm rounded-md`}>
                                {selectedJob.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </div>
                          <div>
                            <p className="text-gray-500">Posted Date</p>
                            <p>{new Date(selectedJob.createdAt || selectedJob.postedDate).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Application Deadline</p>
                            <p>{selectedJob.deadline ? new Date(selectedJob.deadline).toLocaleDateString() : (selectedJob.applicationDeadline || 'Not specified')}</p>
                          </div>
                          {selectedJob.recruiter && (
                            <div>
                              <p className="text-gray-500">Recruiter</p>
                              <p>{selectedJob.recruiter}</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    {/* Skills/Tags */}
                    {(selectedJob.skills || selectedJob.tags) && (selectedJob.skills?.length > 0 || selectedJob.tags?.length > 0) && (
                      <Card>
                        <CardContent className="pt-6">
                          <h3 className="text-xl font-semibold mb-4">Skills</h3>
                          <div className="flex flex-wrap gap-2">
                            {selectedJob.skills && selectedJob.skills.map((skill, index) => (
                              <span key={`skill-${index}`} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm">
                                {skill}
                              </span>
                            ))}
                            {selectedJob.tags && selectedJob.tags.map((tag, index) => (
                              <span key={`tag-${index}`} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Job Description */}
                    {selectedJob.description && (
                      <Card>
                        <CardContent className="pt-6">
                          <h3 className="text-xl font-semibold mb-4">Job Description</h3>
                          <div className="whitespace-pre-line">{selectedJob.description}</div>
                        </CardContent>
                      </Card>
                    )}

                    {/* Requirements */}
                    {selectedJob.requirements && (
                      <Card>
                        <CardContent className="pt-6">
                          <h3 className="text-xl font-semibold mb-4">Requirements</h3>
                          {Array.isArray(selectedJob.requirements) ? (
                            <ul className="list-disc pl-5 space-y-2">
                              {selectedJob.requirements.map((req, index) => (
                                <li key={`req-${index}`}>{req}</li>
                              ))}
                            </ul>
                          ) : (
                            <div className="whitespace-pre-line">{selectedJob.requirements}</div>
                          )}
                        </CardContent>
                      </Card>
                    )}

                    {/* Responsibilities */}
                    {selectedJob.responsibilities && selectedJob.responsibilities.length > 0 && (
                      <Card>
                        <CardContent className="pt-6">
                          <h3 className="text-xl font-semibold mb-4">Responsibilities</h3>
                          <ul className="list-disc pl-5 space-y-2">
                            {selectedJob.responsibilities.map((resp, index) => (
                              <li key={`resp-${index}`}>{resp}</li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <div className="flex justify-center items-center h-full">
                {error ? (
                  <div className="text-center p-8">
                    <h3 className="text-xl font-medium text-gray-600 dark:text-gray-400 mb-2">{error}</h3>
                    <p className="text-gray-500">Please try again later or contact support if the problem persists.</p>
                  </div>
                ) : filteredJobs.length === 0 ? (
                  <div className="text-center p-8">
                    <h3 className="text-xl font-medium text-gray-600 dark:text-gray-400 mb-2">No jobs found</h3>
                    <p className="text-gray-500">Please adjust your search criteria or check back later.</p>
                  </div>
                ) : (
                  <div className="text-center p-8">
                    <h3 className="text-xl font-medium text-gray-600 dark:text-gray-400">Select a job to view details</h3>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <JobListing openDrawer={setIsApplicationOpen}/>
      <JobApplicationDrawer 
        isOpen={isApplicationOpen} 
        onClose={() => setIsApplicationOpen(false)} 
        job={selectedJob}
        />

      {/* Login Dialog */}
      <AlertDialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <AlertDialogContent onPointerDownOutside={() => setShowLoginDialog(false)} onEscapeKeyDown={() => setShowLoginDialog(false)}>
          <AlertDialogHeader>
            <AlertDialogTitle>Login Required</AlertDialogTitle>
            <AlertDialogDescription>
              You need to be logged in to apply for jobs. Please login to continue with your application.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => {
              // Redirect to login page or handle login
              window.location.href = '/login'; // Adjust this to your login route
            }}>
              Login
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default JobListingPage;