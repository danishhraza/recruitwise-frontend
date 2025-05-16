import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ModeToggle } from "./mode-toggle";
import Filters from './Filters';
import { useFilters } from '../Context/FiltersContext';
import SearchBar from './SearchBar';
import { useSearchParams, useNavigate } from 'react-router-dom';

// Main job listing component - renamed from ViewJobs to match your structure
const JobListing = () => {
  const navigate = useNavigate();
  const { filters, setFilters } = useFilters();
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const { searchQuery, filteredJobs } = filters;

  // Handle job selection
  const handleJobSelect = (job) => {
    navigate(`/jobs/${job.id}`);
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

  return (
    
    <div className="bg-background min-h-screen sm:flex flex-col md:hidden">
      {/* Search Bar */}
      <div className="py-4 px-4 border-b">
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

      {/* Job List - Full width on mobile */}
      <div className="w-full">
        {filteredJobs.map((job) => (
          <div 
            key={job.id} 
            className="p-4 border-b cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
            onClick={() => handleJobSelect(job)}
          >
            <h3 className="font-medium text-lg">{job.title}</h3>
            <p className="text-gray-600 dark:text-gray-400">{job.company}</p>
            <p className="text-gray-500 dark:text-gray-500 text-sm">{job.location}</p>
            <p className="text-gray-400 dark:text-gray-600 text-xs mt-2">{getDaysAgo(job.postedDate)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobListing;