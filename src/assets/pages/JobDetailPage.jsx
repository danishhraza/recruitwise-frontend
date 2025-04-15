import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Bookmark, ExternalLink, ArrowLeft } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import { useFilters } from '../Context/FiltersContext';
import JobApplicationDrawer from '../components/JobApplicationDrawer';
import useGeneral from '../../hooks/useGeneral';
import axios from '../../api/axios';

// JobDetail Component for the detailed view page
const JobDetailPage = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { filters } = useFilters();
  const {isLoggedIn,setIsLoggedIn,user,setUser} = useGeneral()
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  

  async function openApplicationDrawer(){
    if (!isLoggedIn) {
        navigate('/auth/login', { 
            state: { 
              from: `/jobs/${jobId}` 
            } 
          });
      }else{
        setIsApplicationOpen(true);
    }
  };

  // Find the job in the filtered jobs array
  const job = filters.filteredJobs.find(job => job.id === parseInt(jobId, 10));

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center p-6 h-screen">
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
            <p className="text-gray-600">{job.location}</p>
            <p className="text-gray-500">{job.salary}</p>
            <div className="mt-4 flex gap-2">
              <Button className="flex items-center gap-2" onClick={() => openApplicationDrawer()}>
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
                  <p>{job.employmentType}</p>
                </div>
                <div>
                  <p className="text-gray-500">Experience Level</p>
                  <p>{job.experienceLevel}</p>
                </div>
                <div>
                  <p className="text-gray-500">Salary Range</p>
                  <p>{job.salary}</p>
                </div>
                <div>
                  <p className="text-gray-500">Status</p>
                  <div className="flex items-center">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-md">
                      {job.status}
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
              </div>
            </CardContent>
          </Card>

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