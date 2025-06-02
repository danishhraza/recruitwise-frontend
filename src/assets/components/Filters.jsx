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

export default function Filters({open,onClose}) {
    const {
        filters,
        setFilters
    } = useFilters();

    const [searchParams,setSearchParams] = useSearchParams()

    // Define mappings for display vs actual values
    const jobTypeMapping = {
        'Full Time': 'Full-Time',
        'Part Time': 'Part-Time', 
        'Internship': 'Internship',
        'Contract': 'Contract',
        'Temporary': 'Temporary'
    };

    const employmentTypeMapping = {
        'On Site': 'OnSite',
        'Hybrid': 'Hybrid',
        'Remote': 'Remote'
    };

    const experienceLevelMapping = {
        'Entry-level': 'Entry-level',
        'Junior': 'Junior',
        'Mid-level': 'Mid-level', 
        'Senior': 'Senior',
        'Executive': 'Executive'
    };

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
const handleJobTypeFilter = (displayJobType) => {
    const actualJobType = jobTypeMapping[displayJobType];
    console.log(actualJobType)
    setFilters(prevFilters => {
        const updatedJobTypes = { 
            ...prevFilters.selectedJobType, 
            [actualJobType]: !prevFilters.selectedJobType[actualJobType] 
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

const handleExperienceLevel = (displayExpLevel) => {
    const actualExpLevel = experienceLevelMapping[displayExpLevel];
    console.log(actualExpLevel)
    setFilters(prevFilters => {
        const updatedExperienceLevels = { 
            ...prevFilters.selectedExperienceLevel, 
            [actualExpLevel]: !prevFilters.selectedExperienceLevel[actualExpLevel] 
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

const handleEmploymentType = (displayEmployType) => {
    const actualEmployType = employmentTypeMapping[displayEmployType];
    console.log(actualEmployType)
    setFilters(prevFilters => {
        const updatedEmploymentTypes = { 
            ...prevFilters.selectedEmploymentType, 
            [actualEmployType]: !prevFilters.selectedEmploymentType[actualEmployType] 
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
          {Object.keys(jobTypeMapping).map((displayType) => {
            const actualType = jobTypeMapping[displayType];
            return (
              <div key={displayType} className="flex items-center space-x-2">
                <Checkbox 
                  id={`job-type-${displayType}`} 
                  checked={filters.selectedJobType?.[actualType] || false}
                  onCheckedChange={() => handleJobTypeFilter(displayType)}
                />
                <Label htmlFor={`job-type-${displayType}`}>{displayType}</Label>
              </div>
            );
          })}
        </div>
      </div>
      <hr />

      {/* Employment Type */}
      <div>
        <h3 className="font-medium mb-3">Employment Type</h3>
        <div className="grid grid-cols-2 gap-2">
          {Object.keys(employmentTypeMapping).map((displayType) => {
            const actualType = employmentTypeMapping[displayType];
            return (
              <div key={displayType} className="flex items-center space-x-2">
                <Checkbox 
                  id={`employment-${displayType}`} 
                  checked={filters.selectedEmploymentType?.[actualType] || false}
                  onCheckedChange={() => handleEmploymentType(displayType)}
                />
                <Label htmlFor={`employment-${displayType}`}>{displayType}</Label>
              </div>
            );
          })}
        </div>
      </div>
      <hr />

      {/* Experience Level */}
      <div>
        <h3 className="font-medium mb-3">Experience Level</h3>
        <div className="grid grid-cols-2 gap-2">
          {Object.keys(experienceLevelMapping).map((displayLevel) => {
            const actualLevel = experienceLevelMapping[displayLevel];
            return (
              <div key={displayLevel} className="flex items-center space-x-2">
                <Checkbox 
                  id={`level-${displayLevel}`} 
                  checked={filters.selectedExperienceLevel?.[actualLevel] || false}
                  onCheckedChange={() => handleExperienceLevel(displayLevel)}
                />
                <Label htmlFor={`level-${displayLevel}`}>{displayLevel}</Label>
              </div>
            );
          })}
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