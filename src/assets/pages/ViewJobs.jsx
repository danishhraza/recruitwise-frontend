import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Bookmark, ExternalLink } from 'lucide-react';
import { ThemeProvider } from "../components/theme-provider";
import { ModeToggle } from "../components/mode-toggle";
import Filters from '../components/Filters';
import { useFilters } from '../Context/FiltersContext';
import SearchBar from '../components/SearchBar';
import { useSearchParams } from 'react-router-dom';
import JobListing from '../components/JobListingPage';
import JobApplicationDrawer from '../components/JobApplicationDrawer';
import { fetchAllJobs, fetchJobById } from '../../lib/data'; // Import functions from data.js

const JobListingPage = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const { filters, setFilters,setJobs,Jobs } = useFilters();
  const [searchParams, setSearchParams] = useSearchParams();
  const { searchQuery, filteredJobs } = filters;
  const [showFilters, setShowFilters] = useState(false);
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch all jobs when component mounts
  useEffect(() => {
    const loadJobs = async () => {
      try {
        const jobsData = await fetchAllJobs();
        console.log(jobsData)
        setJobs(jobsData);
        
        // Set initial selected job
        if (jobsData.length > 0) {
          setSelectedJob(jobsData[0]);
        }
        
        // Update filtered jobs in the filters context
        setFilters(prev => ({
          ...prev,
          filteredJobs: jobsData
        }));
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setLoading(false);
      }
    };
    
    loadJobs();
  }, [setFilters]);

  // Handle job selection
  const handleJobSelect = async (job) => {
    try {
      // Fetch complete job details by ID
      const jobDetails = await fetchJobById(job.id);
      if (jobDetails) {
        setSelectedJob(jobDetails);
      }
    } catch (error) {
      console.error('Error fetching job details:', error);
    }
  };

  const openApplicationDrawer = () => {
    setIsApplicationOpen(true);
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
    const today = new Date();
    const postedDate = new Date(dateString);
    const differenceInTime = today - postedDate;
    const differenceInDays = Math.floor(differenceInTime / (1000 * 3600 * 24));
    return differenceInDays === 0 ? 'Today' : `${differenceInDays} days ago`;
  };

  // Format salary as currency
  const formatSalary = (salary) => {
    if (!salary) return 'Not specified';
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(salary);
  };

  // Format employment type for display
  const formatEmploymentType = (type) => {
    if (!type) return '';
    return type.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading jobs...</div>;
  }

  return (
    <ThemeProvider defaultTheme="dark">
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
            {filteredJobs.map((job) => (
              <div 
                key={job.id} 
                className={`p-4 border-b cursor-pointer rounded-lg m-2 hover:bg-gray-50 dark:hover:bg-gray-800 ${selectedJob && selectedJob.id === job.id ? 'bg-blue-50 dark:bg-gray-800' : ''}`}
                onClick={() => handleJobSelect(job)}
              >
                <h3 className="font-medium text-lg">{job.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{job.company}</p>
                <p className="text-gray-500 text-sm">{job.location}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-xs rounded-md">
                    {formatEmploymentType(job.employmentType)}
                  </span>
                  <span className="px-2 py-1 bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 text-xs rounded-md">
                    {formatEmploymentType(job.jobType)}
                  </span>
                </div>
                <p className="text-gray-400 text-xs mt-2">{getDaysAgo(job.postedDate)}</p>
              </div>
            ))}
          </div>

          {/* Job Details */}
          <div className="w-3/5 overflow-auto p-6">
            {selectedJob && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold">{selectedJob.title}</h2>
                  <p className="text-lg text-blue-600">{selectedJob.company}</p>
                  <p className="text-gray-600 dark:text-gray-400">{selectedJob.location}</p>
                  <p className="text-gray-500">{formatSalary(selectedJob.salary)}</p>
                  <div className="mt-4 flex gap-2">
                    <Button className="flex items-center gap-2" onClick={openApplicationDrawer}>
                      <ExternalLink className="w-4 h-4" />
                      Apply now
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Bookmark className="w-4 h-4" />
                      Save
                    </Button>
                  </div>
                </div>

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
                        <p className="text-gray-500">Employment Type</p>
                        <p>{formatEmploymentType(selectedJob.employmentType)}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Job Type</p>
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
                        <p>{selectedJob.postedDate}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Application Deadline</p>
                        <p>{selectedJob.applicationDeadline}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Recruiter</p>
                        <p>{selectedJob.recruiter}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Skills/Tags */}
                {selectedJob.tags && selectedJob.tags.length > 0 && (
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="text-xl font-semibold mb-4">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedJob.tags.map((tag, index) => (
                          <span key={index} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Job Description */}
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-semibold mb-4">Job Description</h3>
                    <p>{selectedJob.description}</p>
                  </CardContent>
                </Card>

                {/* Requirements */}
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-semibold mb-4">Requirements</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      {selectedJob.requirements.map((req, index) => (
                        <li key={index}>{req}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Responsibilities */}
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="text-xl font-semibold mb-4">Responsibilities</h3>
                    <ul className="list-disc pl-5 space-y-2">
                      {selectedJob.responsibilities.map((resp, index) => (
                        <li key={index}>{resp}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
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
    </ThemeProvider>
  );
};

export default JobListingPage;