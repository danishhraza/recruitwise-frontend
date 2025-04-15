import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Bookmark, ArrowLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFilters } from '../Context/FiltersContext';
import JobApplicationDrawer from '../components/JobApplicationDrawer';
import useGeneral from '../../hooks/useGeneral';
import { fetchJobById } from '../../lib/data'; // Import the fetchJobById function

// JobDetail Component for the detailed view page
const JobDetailPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { filters } = useFilters();
  const { isLoggedIn } = useGeneral();
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Fetch job details using the fetchJobById function
  useEffect(() => {
    const getJobDetails = async () => {
      try {
        setLoading(true);
        // First, try to find the job in the filtered jobs
        const jobFromContext = filters.filteredJobs.find(j => j.id === jobId);
        
        if (jobFromContext) {
          setJob(jobFromContext);
        } else {
          // If not found in context, fetch directly using fetchJobById
          const fetchedJob = await fetchJobById(jobId);
          if (fetchedJob) {
            setJob(fetchedJob);
          } else {
            setError(true);
          }
        }
      } catch (err) {
        console.error('Error fetching job details:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    
    getJobDetails();
  }, [jobId, filters.filteredJobs]);

  const openApplicationDrawer = () => {
    if (!isLoggedIn) {
      navigate('/auth/login', { 
        state: { 
          from: `/jobs/${jobId}` 
        } 
      });
    } else {
      setIsApplicationOpen(true);
    }
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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading job details...</p>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="flex flex-col items-center justify-center p-6 min-h-screen">
        <h2 className="text-xl font-semibold mb-4">Job not found</h2>
        <Button onClick={() => navigate('/jobs')}>Back to Jobs</Button>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-4xl p-4">
        <Button 
          variant="ghost" 
          className="mb-4 flex items-center gap-2"
          onClick={() => navigate('/jobs')}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Jobs
        </Button>

        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold">{job.title}</h2>
            <p className="text-lg text-blue-600">{job.company}</p>
            <p className="text-gray-600 dark:text-gray-400">{job.location}</p>
            <p className="text-gray-500">{formatSalary(job.salary)}</p>
            <div className="mt-4 flex gap-2">
              <Button className="flex items-center gap-2" onClick={openApplicationDrawer}>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4">
                <div>
                  <p className="text-gray-500">Location</p>
                  <p>{job.location}</p>
                </div>
                <div>
                  <p className="text-gray-500">Employment Type</p>
                  <p>{formatEmploymentType(job.employmentType)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Job Type</p>
                  <p>{formatEmploymentType(job.jobType)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Experience</p>
                  <p>{job.experience}</p>
                </div>
                <div>
                  <p className="text-gray-500">Salary</p>
                  <p>{formatSalary(job.salary)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Status</p>
                  <div className="flex items-center">
                    <span className={`px-2 py-1 ${job.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'} text-sm rounded-md`}>
                      {job.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-gray-500">Posted Date</p>
                  <p>{job.postedDate}</p>
                </div>
                <div>
                  <p className="text-gray-500">Application Deadline</p>
                  <p>{job.applicationDeadline}</p>
                </div>
                {job.recruiter && (
                  <div>
                    <p className="text-gray-500">Recruiter</p>
                    <p>{job.recruiter}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Skills/Tags */}
          {job.tags && job.tags.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job.tags.map((tag, index) => (
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
              <p>{job.description}</p>
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Requirements</h3>
              <ul className="list-disc pl-5 space-y-2">
                {job.requirements.map((req, index) => (
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
                {job.responsibilities.map((resp, index) => (
                  <li key={index}>{resp}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
      <JobApplicationDrawer 
        isOpen={isApplicationOpen} 
        onClose={() => setIsApplicationOpen(false)} 
        job={job}
      />
    </div>
  );
};

export default JobDetailPage;