import { Checkbox, Divider, Drawer, Dropdown } from 'antd'
import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { useFilters } from '../Context/FiltersContext';
// import { useFilters } from '../Hooks/useFilters';

export default function Filters({open,onClose}) {
    const {
        locations,
        dummy,
        filters,
        setFilters
    } = useFilters();

    const { selectedTime, selectedTimeKey, selectedJobType, selectedEmploymentType } = filters;
    const [searchParams,setSearchParams] = useSearchParams()


// Handle time selection
const handleSelect = ({ key }) => {
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

            return {
                ...(currentQuery ? { query: currentQuery } : {}),
                ...(currentEType ? { eType: currentEType } : {}),
                ...(currTime ? { time: currTime } : {}),
                ...(activeJobTypes.length > 0 ? { jobType: activeJobTypes.join(",") } : {})
            };
        });

        return {
            ...prevFilters,
            selectedJobType: updatedJobTypes
        };
    });
};

const handleEmploymentType = (employType) => {
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

            return {
                ...(currentQuery ? { query: currentQuery } : {}),
                ...(jobType ? { jobType: jobType } : {}),
                ...(currTime ? { time: currTime } : {}),
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
<Drawer title="Filters" placement="right" closable onClose={onClose} open={open}>
    <div className='space-y-3'>
        <h3>Job Type</h3>
        <div className='flex flex-wrap gap-2'>
        <Checkbox checked={selectedJobType?.fullTime} 
  onChange={() => handleJobTypeFilter('fullTime')}>Full-time</Checkbox>
            <Checkbox checked={selectedJobType?.partTime} onChange={() => handleJobTypeFilter('partTime')}>Part-time</Checkbox>
            <Checkbox checked={selectedJobType?.internship} onChange={() => handleJobTypeFilter('internship')}>Internship</Checkbox>
            <Checkbox checked={selectedJobType?.contract} onChange={() => handleJobTypeFilter('contract')}>Contract</Checkbox>
            <Checkbox checked={selectedJobType?.temporary} onChange={() => handleJobTypeFilter('temporary')}>Temporary</Checkbox>

            </div>
    </div>
    <Divider/>
    <div className='space-y-3'>
        <h3>Employment Type</h3>
        <div className='flex flex-wrap gap-2'>
            <Checkbox checked={selectedEmploymentType?.onsite} onChange={()=> handleEmploymentType('onsite')}>On Site</Checkbox>
            <Checkbox checked={selectedEmploymentType?.hybrid} onChange={()=> handleEmploymentType('hybrid')}>Hybrid</Checkbox>
            <Checkbox checked={selectedEmploymentType?.remote} onChange={()=> handleEmploymentType('remote')}>Remote</Checkbox>
            </div>
    </div>
    <Divider/>
    <div className='space-y-3'>
        <h3>Time Posted</h3>
        <Dropdown.Button menu={{items:[{key:'all',label:'Anytime'},{key:'day',label:'Last 24 hours'},{key:'week',label:'Last 7 days'},{key:'month',label:'Last 30 days'}],selectable:true,onSelect:handleSelect,onDeselect:handleDeselect,selectedKeys:selectedTimeKey,defaultSelectedKeys:'all'}}>{selectedTime}</Dropdown.Button>
    </div>
</Drawer>
  )
}
