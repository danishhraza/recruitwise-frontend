import { Button, ConfigProvider, Dropdown, Input, Pagination, Tag } from 'antd';
import Search from 'antd/es/input/Search';
import { SlidersHorizontal } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import JobListing from '../components/JobListing';
import { Skeleton } from "@/components/ui/skeleton";
import Filters from '../components/Filters';
import { useFilters } from '../Context/FiltersContext';

// import { useFilters } from '../Hooks/useFilters';

const rowsPerPage = 5;


function ViewJobs() {
    // Pagination and UI states
    const [startIndex, setStartIndex] = useState(0);
    const [endIndex, setEndIndex] = useState(rowsPerPage);
    const [currentPage, setCurrentPage] = useState(1);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const { locations,dummy,filters,setFilters, handleSearch, handleLocationSelect, handleLocationDeselect } = useFilters();
    const [updateKey, setUpdateKey] = useState(0);
    const { searchQuery,filteredJobs,selectedLocations, selectedLocationKeys } = filters;
    useEffect(() => {
    setUpdateKey(prev => prev + 1); // Triggers a re-render
    console.log("Update list: ", filteredJobs);
}, [filteredJobs]); // Runs every time filteredJobs changes


    // Drawer controls
    const showDrawer = () => setOpen(true);
    const onClose = () => setOpen(false);

    // Pagination handler
    const onChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        setStartIndex((pageNumber - 1) * rowsPerPage);
        setEndIndex(pageNumber * rowsPerPage);
    };

    // Initial loading state
    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 3000);
    }, []);

    return (
        <>
            <h1 className="outfit-400 text-center text-white text-6xl md:text-8xl">
                <span className="bg-gradient-to-r from-blue-400 to-blue-200 text-transparent bg-clip-text">
                    View Jobs
                </span>
            </h1>
            <div className="w-full flex flex-wrap justify-center mt-5 gap-3 z-0">
                <div className='w-[700px]'>
                    <Search 
                        size='large' 
                        value={searchQuery}
                        onChange={(e) => setFilters(prev => ({ ...prev, searchQuery: e.target.value }))} 
                        onSearch={handleSearch} 
                        placeholder="Search for jobs" 
                        enterButton 
                    />
                </div>
                <div>
                    <Dropdown.Button 
                        size='large' 
                        menu={{
                            items: locations,
                            selectable: true,
                            selectedKeys: selectedLocationKeys,
                            multiple: true,
                            onDeselect: handleLocationDeselect,
                            onSelect: handleLocationSelect
                        }}
                    >
                        {selectedLocations?.length === 0 ? 'All Locations' : (
                            <div className='flex flex-wrap gap-2 max-w-full'>
                                {selectedLocationKeys
                                    ?.filter(key => key !== 'all' && key !== '')
                                    .map((key) => {
                                        const location = locations.find(loc => loc.key === key);
                                        return (
                                            <Tag
                                                key={key}
                                                closable
                                                onClose={(e) => {
                                                    e.preventDefault();
                                                    handleLocationDeselect({key:key});
                                                }}
                                            >
                                                {location?.label}
                                            </Tag>
                                        );
                                    })}
                            </div>
                        )}
                    </Dropdown.Button>
                </div>
                <Button size='large' icon={<SlidersHorizontal/>} onClick={showDrawer}/>
            </div>

            <Filters 
                open={open} 
                onClose={onClose}
                dummy={dummy}
                locations={locations}
           />

            <div key={updateKey} className='w-full flex flex-col items-center gap-3 mt-5 overflow-hidden'>
                {loading ? (
                    [...Array(rowsPerPage)].map((_, idx) => (
                        <Skeleton 
                            key={idx} 
                            className="h-[200px] md:h-[125px] w-full md:w-[70dvw] rounded-lg" 
                        />
                    ))
                ) : (
                    filteredJobs?.slice(startIndex, endIndex).map((job, idx) => (
                        <JobListing key={idx} data={job} />
                    ))
                )}

                <ConfigProvider theme={{
                    token: {
                        colorBgContainer: 'transparent',
                        colorText: 'white'
                    },
                    components: {
                        Pagination: {
                            itemBg: 'transparent',
                            itemHoverBg: 'gray-500',
                            itemHoverColor: 'grey-100',
                        }
                    }
                }}>
                    <Pagination
                        showQuickJumper
                        current={currentPage}
                        pageSize={rowsPerPage}
                        total={filteredJobs?.length}
                        onChange={onChange}
                    />
                </ConfigProvider>
            </div>
        </>
    );
}

export default ViewJobs;