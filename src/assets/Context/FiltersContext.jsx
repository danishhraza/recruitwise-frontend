import { createContext, useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const FiltersContext = createContext();

export function FiltersProvider({ children }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const [jobs, setJobs] = useState([]);
    const [filters, setFilters] = useState({
        searchQuery: '',
        selectedTime: 'Anytime',
        selectedTimeKey: ['all'],
        selectedLocations: [],
        selectedLocationKeys: [],
        selectedJobType: {},
        selectedEmploymentType: {},
        selectedExperienceLevel: {},
        filteredJobs: []
    });

    useEffect(() => {
        const query = searchParams.get("query") || "";
        const jobType = searchParams.get("jobType")?.split(",") || [];
        const eType = searchParams.get("eType")?.split(",") || [];
        const time = searchParams.get("time") || "Anytime";
        const expLevel = searchParams.get("expLevel")?.split(",") || [];
        const locations = searchParams.get("locations")?.split(",") || [];

        const selectedJobType = jobType.reduce((acc, curr) => {
            acc[curr] = true;
            return acc;
        }, {});

        const selectedExperienceLevel = expLevel.reduce((acc, curr) => {
            acc[curr] = true;
            return acc;
        }, {});

        const selectedEmploymentType = eType.reduce((acc, curr) => {
            acc[curr] = true;
            return acc;
        }, {});

        setFilters(prev => ({
            ...prev,
            searchQuery: query,
            selectedJobType,
            selectedEmploymentType,
            selectedExperienceLevel,
            selectedTime: time,
            selectedLocations: locations
        }));
    }, []);

    // Helper function to check if a job was posted within the selected time frame
    const isWithinTimeFrame = (postedDate, selectedTime) => {
        if (selectedTime === 'Anytime' || !postedDate) return true;
        
        const postDate = new Date(postedDate);
        const now = new Date();
        const daysDiff = Math.floor((now - postDate) / (1000 * 60 * 60 * 24));
        
        switch(selectedTime) {
            case 'Last 24 hours':
                return daysDiff <= 1;
            case 'Last 3 days':
                return daysDiff <= 3;
            case 'Last week':
                return daysDiff <= 7;
            case 'Last month':
                return daysDiff <= 30;
            default:
                return true;
        }
    };

    useEffect(() => {
      console.log(filters)
      const filtered = jobs.filter(job => {
        // Check if the job matches the search query
        const query = filters.searchQuery.toLowerCase().trim();
        const matchesQuery = query === '' || 
          (job.title && job.title.toLowerCase().includes(query)) || 
          (job.company && job.company.toLowerCase().includes(query)) || 
          (job.location && job.location.toLowerCase().includes(query));
        
        // Check if the job matches the selected job type(s)
        const matchesJobType = Object.keys(filters.selectedJobType).length === 0 || 
          !Object.values(filters.selectedJobType).some(Boolean) ||
          (job.jobType && filters.selectedJobType[job.jobType]);
        
        // Check if the job matches the selected employment type(s)
        const matchesEmploymentType = Object.keys(filters.selectedEmploymentType).length === 0 || 
          !Object.values(filters.selectedEmploymentType).some(Boolean) ||
          (job.employmentType && filters.selectedEmploymentType[job.employmentType]);
        
        // Check if the job matches the selected experience level(s)
        // Note: In your schema it's "experience" not "experienceLevel"
        const matchesExperienceLevel = Object.keys(filters.selectedExperienceLevel).length === 0 || 
          !Object.values(filters.selectedExperienceLevel).some(Boolean) ||
          (job.experience && filters.selectedExperienceLevel[job.experience]);
        
        // Check if the job matches the selected time frame
        const matchesTime = isWithinTimeFrame(job.postedDate, filters.selectedTime);
        
        // Check if the job matches the selected locations
        const matchesLocation = filters.selectedLocations.length === 0 || 
          (job.location && filters.selectedLocations.some(loc => job.location.includes(loc)));
    
        return matchesQuery && matchesJobType && matchesEmploymentType && 
               matchesExperienceLevel && matchesTime && matchesLocation;
      });
    
      // Update the filtered jobs in state
      setFilters(prev => ({ ...prev, filteredJobs: filtered }));
    }, [
      filters.searchQuery, 
      filters.selectedJobType, 
      filters.selectedEmploymentType, 
      filters.selectedExperienceLevel,
      filters.selectedTime,
      filters.selectedLocations,
      jobs
    ]);

    return (
        <FiltersContext.Provider value={{ filters, setFilters, setSearchParams, jobs, setJobs }}>
            {children}
        </FiltersContext.Provider>
    );
}

export function useFilters() {
  const context = useContext(FiltersContext);
  if (!context) {
    throw new Error('useFilters must be used within a FiltersProvider');
  }
  return context;
}