import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Bookmark, Search, X, ExternalLink } from 'lucide-react';
import { ThemeProvider } from "../components/theme-provider";
import { ModeToggle } from "../components/mode-toggle"
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import Filters from '../components/Filters';
import { useFilters } from '../Context/FiltersContext';
import SearchBar from '../components/SearchBar';
import { useSearchParams } from 'react-router-dom';
import JobListing from '../components/JobListingPage';
import JobApplicationDrawer from '../components/JobApplicationDrawer';

// Mock job data
const jobsData = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    company: 'Innovative Tech Solutions',
    location: 'San Francisco, CA (Remote)',
    postedDate: '2023-04-10',
    salary: '$120,000 - $150,000',
    experienceLevel: 'Senior',
    employmentType: 'Full-time',
    status: 'Active',
    applicationDeadline: '2023-04-25',
    description: 'We are looking for a Senior Frontend Developer to join our team. You will be responsible for building and maintaining our web applications.',
    requirements: [
      '5+ years of experience with React',
      'Strong understanding of JavaScript, HTML, and CSS',
      'Experience with modern frontend frameworks',
      'Experience with state management libraries',
      'Experience with responsive design'
    ],
    responsibilities: [
      'Build and maintain web applications',
      'Collaborate with designers and backend developers',
      'Write clean, maintainable code',
      'Optimize applications for maximum speed and scalability',
      'Stay up-to-date with emerging trends and technologies'
    ]
  },
  {
    id: 2,
    title: 'UI/UX Developer',
    company: 'Creative Design Agency',
    location: 'New York, NY',
    postedDate: '2023-04-05',
    salary: '$90,000 - $120,000',
    experienceLevel: 'Mid-level',
    employmentType: 'Full-time',
    status: 'Active',
    applicationDeadline: '2023-04-20',
    description: 'We are looking for a UI/UX Developer to join our creative team. You will be responsible for designing and implementing user interfaces for our clients.',
    requirements: [
      '3+ years of experience with UI/UX design',
      'Proficiency with design tools like Figma or Sketch',
      'Knowledge of HTML, CSS, and JavaScript',
      'Understanding of user experience principles',
      'Portfolio of previous work'
    ],
    responsibilities: [
      'Create user-friendly interfaces',
      'Develop UI mockups and prototypes',
      'Implement responsive designs',
      'Collaborate with the development team',
      'Gather and evaluate user requirements'
    ]
  },
  {
    id: 3,
    title: 'Full Stack Engineer',
    company: 'Tech Startup Inc.',
    location: 'Austin, TX',
    postedDate: '2023-03-28',
    salary: '$110,000 - $140,000',
    experienceLevel: 'Senior',
    employmentType: 'Full-time',
    status: 'Active',
    applicationDeadline: '2023-04-15',
    description: 'We are seeking a Full Stack Engineer to join our growing team. You will work on both frontend and backend development for our main product.',
    requirements: [
      '4+ years of experience with full stack development',
      'Proficiency in React and Node.js',
      'Experience with databases (SQL and NoSQL)',
      'Knowledge of cloud services (AWS or Azure)',
      'Strong problem-solving skills'
    ],
    responsibilities: [
      'Develop and maintain both frontend and backend code',
      'Design and implement database schemas',
      'Ensure application performance and responsiveness',
      'Participate in code reviews',
      'Mentor junior developers'
    ]
  },
  {
    id: 4,
    title: 'Frontend Developer',
    company: 'E-commerce Platform',
    location: 'Chicago, IL',
    postedDate: '2023-03-20',
    salary: '$85,000 - $110,000',
    experienceLevel: 'Junior',
    employmentType: 'Full-time',
    status: 'Active',
    applicationDeadline: '2023-04-10',
    description: 'We are looking for a Frontend Developer to help build and maintain our e-commerce platform.',
    requirements: [
      '2+ years of experience with frontend development',
      'Proficiency in JavaScript, HTML, and CSS',
      'Experience with a modern JavaScript framework (React, Vue, or Angular)',
      'Knowledge of responsive design principles',
      'Familiarity with version control systems'
    ],
    responsibilities: [
      'Implement user interfaces according to designs',
      'Ensure cross-browser compatibility',
      'Optimize application for speed and scalability',
      'Collaborate with backend developers',
      'Troubleshoot and debug issues'
    ]
  },
  {
    id: 5,
    title: 'React Developer',
    company: 'Financial Tech Company',
    location: 'Boston, MA (Remote)',
    postedDate: '2023-03-15',
    salary: '$100,000 - $130,000',
    experienceLevel: 'Mid-level',
    employmentType: 'Full-time',
    status: 'Active',
    applicationDeadline: '2023-04-20',
    description: 'We are looking for a React Developer to join our financial technology team. You will be responsible for developing user interfaces for our financial products.',
    requirements: [
      '3+ years of experience with React',
      'Strong JavaScript skills',
      'Experience with Redux or other state management libraries',
      'Knowledge of modern frontend build tools',
      'Understanding of financial data visualization is a plus'
    ],
    responsibilities: [
      'Develop and maintain React components',
      'Implement complex user interfaces',
      'Ensure code quality and performance',
      'Work with UX designers to implement designs',
      'Participate in agile development processes'
    ]
  }
];

const JobListingPage = () => {

  const [selectedJob, setSelectedJob] = useState(jobsData[0]);  
  const {filters,setFilters} = useFilters()
  const [searchParams, setSearchParams] = useSearchParams();

  const {searchQuery,filteredJobs} = filters;
  const [showFilters, setShowFilters] = useState(false);
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);

  // Handle job selection
  const handleJobSelect = (job) => {
    setSelectedJob(job);
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
      const s = sQuery
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
      {/* Filters Dialog */}
     

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Job List */}
        <div className="w-2/5 border-r overflow-auto">
          {filteredJobs.map((job) => (
            <div 
              key={job.id} 
              className={`p-4 border-b cursor-pointer rounded-lg m-2 hover:bg-gray-50 dark:hover:bg-gray-800 ${selectedJob.id === job.id ? 'bg-blue-50 dark:bg-gray-800' : ''}`}
              onClick={() => handleJobSelect(job)}
            >
              <h3 className="font-medium text-lg">{job.title}</h3>
              <p className="text-gray-600">{job.company}</p>
              <p className="text-gray-500 text-sm">{job.location}</p>
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
                <p className="text-gray-600">{selectedJob.location}</p>
                <p className="text-gray-500">{selectedJob.salary}</p>
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
                      <p>{selectedJob.employmentType}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Experience Level</p>
                      <p>{selectedJob.experienceLevel}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Salary Range</p>
                      <p>{selectedJob.salary}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Status</p>
                      <div className="flex items-center">
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-sm rounded-md">
                          {selectedJob.status}
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
                  </div>
                </CardContent>
              </Card>

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