
import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { useFilters } from '../Context/FiltersContext';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogHeader,
    DialogTrigger,
  } from "@/components/ui/dialog";
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { useFilters } from '../Hooks/useFilters';

export default function Filters({open,onClose}) {
    const {
        filters,
        setFilters
    } = useFilters();

    // const { selectedTime, selectedTimeKey, selectedJobType, selectedEmploymentType } = filters;
    const [searchParams,setSearchParams] = useSearchParams()


// Handle time selection
const handleSelect = ({ key }) => {
    console.log(key)
    setFilters(prevFilters => ({
        ...prevFilters,
        selectedTimeKey: [key],
        selectedTime: key === 'all' ? 'Anytime' :
                      key === 'day' ? 'Last 24 hours' :
                      key === 'week' ? 'Last 7 days' :
                      'Last 30 days'
    }));

    // Update URL params while preserving other params
    setSearchParams(prevParams => {
        const currentQuery = prevParams.get("query") || "";
        const currentJobType = prevParams.get("jobType") || "";
        const currentEType = prevParams.get("eType") || "";

        return {
            ...(currentQuery ? { query: currentQuery } : {}),
            ...(currentJobType ? { jobType: currentJobType } : {}),
            ...(currentEType ? { eType: currentEType } : {}),
            ...(key !== 'all' ? { time: key } : {})
        };
    });
};

// Handle time deselection
const handleDeselect = () => {
    setFilters(prevFilters => ({
        ...prevFilters,
        selectedTimeKey: ['all'],
        selectedTime: 'Anytime'
    }));
};


// Handle job type filter
const handleJobTypeFilter = (jobType) => {
    console.log(jobType)
    setFilters(prevFilters => {
        const updatedJobTypes = { 
            ...prevFilters.selectedJobType, 
            [jobType]: !prevFilters.selectedJobType[jobType] 
        };

        // Get active job types
        const activeJobTypes = Object.keys(updatedJobTypes).filter(type => updatedJobTypes[type]);

        setSearchParams(prevParams => {
          const currentQuery = prevParams.get("query") || "";
          const currentEType = prevParams.get("eType") || "";
          const currTime = prevParams.get("time") || "";
          const currentExpLevel = prevParams.get("expLevel") || "";
      
          return {
              ...(currentQuery ? { query: currentQuery } : {}),
              ...(currentEType ? { eType: currentEType } : {}),
              ...(currTime ? { time: currTime } : {}),
              ...(activeJobTypes.length > 0 ? { jobType: activeJobTypes.join(",") } : {}),
              ...(currentExpLevel ? { expLevel: currentExpLevel } : {})
          };
      });

        return {
            ...prevFilters,
            selectedJobType: updatedJobTypes
        };
    });
};

const handleExperienceLevel = (expLevel) => {
    console.log(expLevel)
    setFilters(prevFilters => {
        const updatedExperienceLevels = { 
            ...prevFilters.selectedExperienceLevel, 
            [expLevel]: !prevFilters.selectedExperienceLevel[expLevel] 
        };

        // Get active experience levels
        const activeExpLevels = Object.keys(updatedExperienceLevels).filter(level => updatedExperienceLevels[level]);

        setSearchParams(prevParams => {
            const currentQuery = prevParams.get("query") || "";
            const jobType = prevParams.get("jobType") || "";
            const eType = prevParams.get("eType") || "";
            const currTime = prevParams.get("time") || "";

            return {
                ...(currentQuery ? { query: currentQuery } : {}),
                ...(jobType ? { jobType: jobType } : {}),
                ...(eType ? { eType: eType } : {}),
                ...(currTime ? { time: currTime } : {}),
                ...(activeExpLevels.length > 0 ? { expLevel: activeExpLevels.join(",") } : {})
            };
        });

        return {
            ...prevFilters,
            selectedExperienceLevel: updatedExperienceLevels
        };
    });
};

const handleEmploymentType = (employType) => {
    console.log(employType)
    setFilters(prevFilters => {
        const updatedEmploymentTypes = { 
            ...prevFilters.selectedEmploymentType, 
            [employType]: !prevFilters.selectedEmploymentType[employType] 
        };

        // Get active employment types
        const activeEmployTypes = Object.keys(updatedEmploymentTypes).filter(type => updatedEmploymentTypes[type]);

        setSearchParams(prevParams => {
            const currentQuery = prevParams.get("query") || "";
            const jobType = prevParams.get("jobType") || "";
            const currTime = prevParams.get("time") || "";
            const currentExpLevel = prevParams.get("expLevel") || "";
            return {
                ...(currentQuery ? { query: currentQuery } : {}),
                ...(jobType ? { jobType: jobType } : {}),
                ...(currTime ? { time: currTime } : {}),
                ...(currentExpLevel ? { expLevel: currentExpLevel } : {}),
                ...(activeEmployTypes.length > 0 ? { eType: activeEmployTypes.join(",") } : {})
            };
        });

        return {
            ...prevFilters,
            selectedEmploymentType: updatedEmploymentTypes
        };
    });
};


return (
<Dialog open={open} onOpenChange={onClose}>
  <DialogContent className="sm:max-w-md">
    <DialogHeader>
      <DialogTitle className="flex justify-between items-center">
        <span>Filters</span>
      </DialogTitle>
    </DialogHeader>
    <div className="space-y-6 py-4">
      
      {/* Job Type */}
      <div>
        <h3 className="font-medium mb-3">Job Type</h3>
        <div className="grid grid-cols-2 gap-2">
          {['Full-Time', 'Part-Time', 'Internship', 'Contract', 'Temporary'].map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox 
                id={`job-type-${type}`} 
                checked={filters.selectedJobType?.[type] || false}
                onCheckedChange={() => handleJobTypeFilter(type)}
              />
              <Label htmlFor={`job-type-${type}`}>{type}</Label>
            </div>
          ))}
        </div>
      </div>
      <hr />

      {/* Employment Type */}
      <div>
        <h3 className="font-medium mb-3">Employment Type</h3>
        <div className="grid grid-cols-2 gap-2">
          {['On Site', 'Hybrid', 'Remote'].map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox 
                id={`employment-${type}`} 
                checked={filters.selectedEmploymentType?.[type] || false}
                onCheckedChange={() => handleEmploymentType(type)}
              />
              <Label htmlFor={`employment-${type}`}>{type}</Label>
            </div>
          ))}
        </div>
      </div>
      <hr />

      {/* Experience Level */}
      <div>
        <h3 className="font-medium mb-3">Experience Level</h3>
        <div className="grid grid-cols-2 gap-2">
          {['Entry-level', 'Junior', 'Mid-level', 'Senior', 'Executive'].map((level) => (
            <div key={level} className="flex items-center space-x-2">
              <Checkbox 
                id={`level-${level}`} 
                checked={filters.selectedExperienceLevel?.[level] || false}
                onCheckedChange={() => handleExperienceLevel(level)}
              />
              <Label htmlFor={`level-${level}`}>{level}</Label>
            </div>
          ))}
        </div>
      </div>
      <hr />

      {/* Time Posted */}
      <div>
        <h3 className="font-medium mb-3">Time Posted</h3>
        <Select
          value={filters.selectedTime}
          onValueChange={(value) => {
            if (value === 'Anytime') {
              handleDeselect();
            } else {
              const key =
                value === 'Last 24 hours'
                  ? 'day'
                  : value === 'Last 7 days'
                  ? 'week'
                  : value === 'Last 30 days'
                  ? 'month'
                  : 'all';
              handleSelect({ key });
            }
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Anytime">Anytime</SelectItem>
            <SelectItem value="Last 24 hours">Past 24 hours</SelectItem>
            <SelectItem value="Last 7 days">Past week</SelectItem>
            <SelectItem value="Last 30 days">Past month</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  </DialogContent>
</Dialog>

  )
}
