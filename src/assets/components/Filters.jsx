import { Checkbox, Divider, Drawer, Dropdown } from 'antd'
import React from 'react'
import { useSearchParams } from 'react-router-dom'

export default function Filters({open,onClose,selectedTime,setSelectedTime,selectedTimeKey, setSelectedTimeKey,setSelectedJobType,selectedJobType,setSelectedEmploymentType,selectedEmploymentType,setSelectedTimePosted}) {
    const [searchParams,setSearchParams] = useSearchParams()


    // Handle time selection
    const handleSelect = ({ key }) => {
        setSelectedTimeKey([key]);
        setSelectedTime(
            key === 'all' ? 'Anytime' :
            key === 'day' ? 'Last 24 hours' :
            key === 'week' ? 'Last 7 days' :
            'Last 30 days'
        );

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


    const handleDeselect = () => {
        setSelectedTimeKey(['all']);
        setSelectedTime('Anytime');
    };

    function handleJobTypeFilter(jobType) {
        setSelectedJobType(prev => {
            const updatedState = { ...prev, [jobType]: !prev[jobType] };
    
            // Get active job types as an array
            const activeJobTypes = Object.keys(updatedState).filter(type => updatedState[type]);
    
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
    
            return updatedState;
        });
    }

function handleEmploymentType(employType){
    setSelectedEmploymentType(prev => {
        const updatedState = { ...prev, [employType]: !prev[employType] };

        // Get active job types as an array
        const activeEmployTypes = Object.keys(updatedState).filter(type => updatedState[type]);

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

        return updatedState;
    });
}

return (
<Drawer title="Filters" placement="right" closable onClose={onClose} open={open}>
    <div className='space-y-3'>
        <h3>Job Type</h3>
        <div className='flex flex-wrap gap-2'>
        <Checkbox checked={selectedJobType.fullTime} 
  onChange={() => handleJobTypeFilter('fullTime')}>Full-time</Checkbox>
            <Checkbox checked={selectedJobType.partTime} onChange={() => handleJobTypeFilter('partTime')}>Part-time</Checkbox>
            <Checkbox checked={selectedJobType.internship} onChange={() => handleJobTypeFilter('internship')}>Internship</Checkbox>
            <Checkbox checked={selectedJobType.contract} onChange={() => handleJobTypeFilter('contract')}>Contract</Checkbox>
            <Checkbox checked={selectedJobType.temporary} onChange={() => handleJobTypeFilter('temporary')}>Temporary</Checkbox>

            </div>
    </div>
    <Divider/>
    <div className='space-y-3'>
        <h3>Employment Type</h3>
        <div className='flex flex-wrap gap-2'>
            <Checkbox checked={selectedEmploymentType.onsite} onChange={()=> handleEmploymentType('onsite')}>On Site</Checkbox>
            <Checkbox checked={selectedEmploymentType.hybrid} onChange={()=> handleEmploymentType('hybrid')}>Hybrid</Checkbox>
            <Checkbox checked={selectedEmploymentType.remote} onChange={()=> handleEmploymentType('remote')}>Remote</Checkbox>
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
