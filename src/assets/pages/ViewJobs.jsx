import { Button, Checkbox, ConfigProvider, Divider, Drawer, Dropdown, Input, Pagination, Tag} from 'antd'
import Search from 'antd/es/input/Search'
import { FilterIcon, SlidersHorizontal } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import JobListing from '../components/JobListing'
import { Skeleton } from "@/components/ui/skeleton"
import { useSearchParams } from 'react-router-dom'
import Filters from '../components/Filters'

const dummy = [
    {
        "_id": "67aa2c702a2b20e132f3cb48",
        "title": "Software Engineer",
        "description": "Develop and maintain web applications",
        "company": "Google",
        "salary": 800.00,
        "jobType": "full-time",
        "tags": ["JavaScript", "React", "Node.js"],
        "experience": "3 Years",
        "employmentType": "onsite",
        "requirements": ["JavaScript", "React", "Node.js", "MongoDB"],
        "recruiter": "Alice",
        "location": "San Francisco",
        "isActive": true,
        "applicants": [],
        "createdAt": "2025-02-10T16:45:10.000Z",
        "updatedAt": "2025-02-10T16:45:10.000Z",
        "__v": 0
    },
    {
        "_id": "67aa2c702a2b20e132f3cb49",
        "title": "Data Scientist",
        "description": "Analyze large datasets to extract insights",
        "company": "Microsoft",
        "salary": 950.50,
        "jobType": "contract",
        "tags": ["Python", "TensorFlow", "Big Data"],
        "experience": "4 Years",
        "employmentType": "remote",
        "requirements": ["Python", "pandas", "TensorFlow"],
        "recruiter": "John",
        "location": "New York",
        "isActive": true,
        "applicants": [],
        "createdAt": "2025-02-10T16:46:30.000Z",
        "updatedAt": "2025-02-10T16:46:30.000Z",
        "__v": 0
    },
    {
        "_id": "67aa2c702a2b20e132f3cb50",
        "title": "DevOps Engineer",
        "description": "Manage and deploy scalable infrastructure",
        "company": "Amazon",
        "salary": 750.00,
        "jobType": "full-time",
        "tags": ["AWS", "Kubernetes", "Terraform"],
        "experience": "5 Years",
        "employmentType": "hybrid",
        "requirements": ["AWS", "Docker", "Jenkins"],
        "recruiter": "Mike",
        "location": "Seattle",
        "isActive": true,
        "applicants": [],
        "createdAt": "2025-02-10T16:47:15.000Z",
        "updatedAt": "2025-02-10T16:47:15.000Z",
        "__v": 0
    },
    {
        "_id": "67aa2c702a2b20e132f3cb51",
        "title": "Backend Developer",
        "description": "Build scalable APIs and backend services",
        "company": "Netflix",
        "salary": 870.25,
        "jobType": "full-time",
        "tags": ["Node.js", "Express", "MongoDB"],
        "experience": "3 Years",
        "employmentType": "remote",
        "requirements": ["Node.js", "Express", "MongoDB", "Redis"],
        "recruiter": "Sarah",
        "location": "Los Angeles",
        "isActive": true,
        "applicants": [],
        "createdAt": "2025-02-10T16:48:00.000Z",
        "updatedAt": "2025-02-10T16:48:00.000Z",
        "__v": 0
    },
    {
        "_id": "67aa2c702a2b20e132f3cb52",
        "title": "Frontend Developer",
        "description": "Create stunning UI with React and Tailwind",
        "company": "Meta",
        "salary": 780.00,
        "jobType": "full-time",
        "tags": ["React", "Tailwind", "TypeScript"],
        "experience": "2 Years",
        "employmentType": "onsite",
        "requirements": ["React", "TypeScript", "Tailwind", "Redux"],
        "recruiter": "Emma",
        "location": "Austin",
        "isActive": true,
        "applicants": [],
        "createdAt": "2025-02-10T16:48:45.000Z",
        "updatedAt": "2025-02-10T16:48:45.000Z",
        "__v": 0
    },
    {
        "_id": "67aa2c702a2b20e132f3cb53",
        "title": "Cloud Engineer",
        "description": "Develop and maintain cloud infrastructure",
        "company": "IBM",
        "salary": 820.00,
        "jobType": "contract",
        "tags": ["Azure", "AWS", "GCP"],
        "experience": "6 Years",
        "employmentType": "remote",
        "requirements": ["Azure", "AWS", "Terraform"],
        "recruiter": "Tom",
        "location": "Toronto",
        "isActive": true,
        "applicants": [],
        "createdAt": "2025-02-10T16:49:20.000Z",
        "updatedAt": "2025-02-10T16:49:20.000Z",
        "__v": 0
    },
    {
        "_id": "67aa2c702a2b20e132f3cb54",
        "title": "Cybersecurity Analyst",
        "description": "Secure company infrastructure from cyber threats",
        "company": "Cisco",
        "salary": 890.00,
        "jobType": "full-time",
        "tags": ["Security", "Networking", "Ethical Hacking"],
        "experience": "5 Years",
        "employmentType": "hybrid",
        "requirements": ["Firewalls", "SIEM", "Networking"],
        "recruiter": "Sophia",
        "location": "Berlin",
        "isActive": true,
        "applicants": [],
        "createdAt": "2025-02-10T16:50:05.000Z",
        "updatedAt": "2025-02-10T16:50:05.000Z",
        "__v": 0
    },
    {
        "_id": "67aa2c702a2b20e132f3cb55",
        "title": "QA Engineer",
        "description": "Ensure software quality through automated testing",
        "company": "Tesla",
        "salary": 720.00,
        "jobType": "full-time",
        "tags": ["Selenium", "Cypress", "Testing"],
        "experience": "3 Years",
        "employmentType": "onsite",
        "requirements": ["Selenium", "JUnit", "Postman"],
        "recruiter": "Daniel",
        "location": "Palo Alto",
        "isActive": true,
        "applicants": [],
        "createdAt": "2025-02-10T16:50:50.000Z",
        "updatedAt": "2025-02-10T16:50:50.000Z",
        "__v": 0
    },
    {
        "_id": "67aa2c702a2b20e132f3cb56",
        "title": "AI Researcher",
        "description": "Develop AI algorithms and models",
        "company": "OpenAI",
        "salary": 980.00,
        "jobType": "full-time",
        "tags": ["Deep Learning", "NLP", "AI"],
        "experience": "7 Years",
        "employmentType": "remote",
        "requirements": ["PyTorch", "Transformers", "GPT"],
        "recruiter": "Elon",
        "location": "San Francisco",
        "isActive": true,
        "applicants": [],
        "createdAt": "2025-02-10T16:51:30.000Z",
        "updatedAt": "2025-02-10T16:51:30.000Z",
        "__v": 0
    },
    {
        "_id": "67aa2c702a2b20e132f3cb57",
        "title": "Mobile App Developer",
        "description": "Develop Android and iOS applications",
        "company": "Snapchat",
        "salary": 860.00,
        "jobType": "contract",
        "tags": ["Flutter", "Swift", "Kotlin"],
        "experience": "4 Years",
        "employmentType": "hybrid",
        "requirements": ["Flutter", "Dart", "Kotlin"],
        "recruiter": "Lisa",
        "location": "Los Angeles",
        "isActive": true,
        "applicants": [],
        "createdAt": "2025-02-10T16:52:10.000Z",
        "updatedAt": "2025-02-10T16:52:10.000Z",
        "__v": 0
    },
    {
        "_id": "67aa2b702a2b20e132f3cb58",
        "title": "Front-end Developer",
        "description": "Develop responsive web interfaces",
        "company": "Google",
        "salary": 1200.00,
        "jobType": "fullTime",
        "tags": ["React", "JavaScript", "CSS"],
        "experience": "2 Years",
        "employmentType": "remote",
        "requirements": ["React", "HTML", "CSS"],
        "recruiter": "John",
        "location": "Mountain View",
        "isActive": true,
        "applicants": [],
        "createdAt": "2025-02-16T12:30:00.000Z",
        "updatedAt": "2025-02-16T12:30:00.000Z",
        "__v": 0
     },
     {
        "_id": "67aa2b702a2b20e132f3cb59",
        "title": "Data Scientist",
        "description": "Analyze and interpret complex data",
        "company": "Tesla",
        "salary": 1400.00,
        "jobType": "fullTime",
        "tags": ["Python", "Machine Learning", "TensorFlow"],
        "experience": "3 Years",
        "employmentType": "onsite",
        "requirements": ["Python", "SQL", "Machine Learning"],
        "recruiter": "Sara",
        "location": "Palo Alto",
        "isActive": true,
        "applicants": [],
        "createdAt": "2025-02-16T08:45:00.000Z",
        "updatedAt": "2025-02-16T08:45:00.000Z",
        "__v": 0
     },
     {
        "_id": "67aa2b702a2b20e132f3cb60",
        "title": "Backend Developer",
        "description": "Build and maintain backend systems",
        "company": "Microsoft",
        "salary": 1100.00,
        "jobType": "contract",
        "tags": ["Node.js", "MongoDB", "API"],
        "experience": "5 Years",
        "employmentType": "hybrid",
        "requirements": ["Node.js", "Express", "MongoDB"],
        "recruiter": "Jake",
        "location": "Redmond",
        "isActive": true,
        "applicants": [],
        "createdAt": "2025-02-13T10:15:00.000Z",
        "updatedAt": "2025-02-13T10:15:00.000Z",
        "__v": 0
     },
     {
        "_id": "67aa2b702a2b20e132f3cb61",
        "title": "UX/UI Designer",
        "description": "Design user-friendly interfaces and experiences",
        "company": "Apple",
        "salary": 950.00,
        "jobType": "partTime",
        "tags": ["Figma", "Sketch", "Adobe XD"],
        "experience": "4 Years",
        "employmentType": "remote",
        "requirements": ["Figma", "Sketch", "Wireframing"],
        "recruiter": "Emily",
        "location": "Cupertino",
        "isActive": true,
        "applicants": [],
        "createdAt": "2025-02-13T09:00:00.000Z",
        "updatedAt": "2025-02-13T09:00:00.000Z",
        "__v": 0
     },
     {
        "_id": "67aa2b702a2b20e132f3cb62",
        "title": "DevOps Engineer",
        "description": "Automate and manage infrastructure",
        "company": "Amazon",
        "salary": 1300.00,
        "jobType": "contract",
        "tags": ["Docker", "Kubernetes", "AWS"],
        "experience": "6 Years",
        "employmentType": "onsite",
        "requirements": ["Docker", "Kubernetes", "CI/CD"],
        "recruiter": "David",
        "location": "Seattle",
        "isActive": true,
        "applicants": [],
        "createdAt": "2025-02-07T15:00:00.000Z",
        "updatedAt": "2025-02-07T15:00:00.000Z",
        "__v": 0
     }     
     
]
const jobTypes = ["fullTime", "partTime", "internship", "contract", "temporary"];
const employmentTypes = ["onsite", "hybrid", "remote"];

function ViewJobs() {
    const rowsPerPage = 5;
    
    const [searchQuery, setSearchQuery] = useState("");
    const [queryTags, setQueryTags] = useState([]);
    const [searchParams,setSearchParams] = useSearchParams()
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [selectedTime, setSelectedTime] = useState('Anytime')
    const [selectedTimeKey, setSelectedTimeKey] = useState('all')
    const [selectedLocations, setSelectedLocations] = useState([]);
    const [selectedLocationKeys, setSelectedLocationKeys] = useState('all')
    const [selectedJobType, setSelectedJobType] = useState(
        jobTypes.reduce((acc, type) => ({ ...acc, [type]: false }), {}) // Initial state with all false
      );
    const [selectedEmploymentType, setSelectedEmploymentType] = useState(employmentTypes.reduce((acc, type) => ({ ...acc, [type]: false }), {}) )

    const [startIndex,setStartIndex] = useState(0)
    const [endIndex,setEndIndex] = useState(rowsPerPage)
    const [currentPage, setCurrentPage] = useState(1);
    const [Jobs,setJobs] = useState(dummy)
    const [open, setOpen] = useState(false);
    const showDrawer = () => {
      setOpen(true);
    };
    const onClose = () => {
      setOpen(false);
    };
    const onChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        setStartIndex((pageNumber - 1) * rowsPerPage);
        setEndIndex(pageNumber * rowsPerPage);
    };
    const [loading,setLoading] = useState(false)

    useEffect(() => {
        const paramJobTypes = searchParams.get("jobType")?.split(",") || [];
        setSelectedJobType(
          jobTypes.reduce(
            (acc, type) => ({ ...acc, [type]: paramJobTypes.includes(type) }),
            {}
          )
        );
      }, []);
    useEffect(() => {
        const paramEmployTypes = searchParams.get("eType")?.split(",") || [];
        setSelectedEmploymentType(
          employmentTypes.reduce(
            (acc, type) => ({ ...acc, [type]: paramEmployTypes.includes(type) }),
            {}
          )
        );
      }, []);

      useEffect(() => {
        const locationParam = searchParams.get('location');
    
        if (locationParam) {
            // Split the location values into an array, filtering out empty values (if any)
            const locationKeys = locationParam.split(',').filter(key => key !== 'all');
    
            // Set selected location keys based on the URL search parameter
            setSelectedLocationKeys(locationKeys);
    
            // Set the corresponding location labels based on the selected keys
            const selectedLocations = locationKeys.map(key => {
                const location = locations.find(loc => loc.key === key);
                return location ? location.label : null;
            }).filter(label => label); // Filter out any null values
    
            setSelectedLocations(selectedLocations);
        } else {
            // If no location param exists, reset the locations
            setSelectedLocationKeys([]);
            setSelectedLocations([]);
        }
    }, [searchParams]);  // Re-run the effect when searchParams changes

      useEffect(() => {
        const timeParam = searchParams.get('time');
        if (timeParam && ['day', 'week', 'month'].includes(timeParam)) {
            setSelectedTimeKey([timeParam]);
            setSelectedTime(
                timeParam === 'day' ? 'Last 24 hours' :
                timeParam === 'week' ? 'Last 7 days' :
                timeParam === 'month' ? 'Last 30 days' :
                'Anytime'
            );
        }
    }, [searchParams]);

    useEffect(() => {
        // Get search query from URL if present
        const queryFromURL = searchParams.get("query");
        if (queryFromURL) {
            setSearchQuery(queryFromURL);
            setQueryTags([queryFromURL]); // Add as tag
        }
    }, []);

    useEffect(() => {
        setFilteredJobs(() => {
            return dummy.filter(job => {
                // Previous mapping
                const jobTypeMap = {
                    fullTime: "full-time",
                    partTime: "part-time",
                    internship: "internship",
                    contract: "contract",
                    temporary: "temporary"
                };
    
                // Previous matching conditions
                const isMatchingJobType = Object.keys(selectedJobType)
                    .some(type => selectedJobType[type] && job.jobType === jobTypeMap[type]);
    
                const isMatchingEmploymentType = Object.keys(selectedEmploymentType)
                    .some(type => selectedEmploymentType[type] && job.employmentType === type);
    
                const isMatchingQueryTags = queryTags.length === 0 ||
                    queryTags.some(tag => job.title.toLowerCase().includes(tag.toLowerCase()));
    
                // Time filtering logic updated for dropdown
                const jobDate = new Date(job.createdAt);
                const currentDate = new Date();
                const timeDifference = currentDate - jobDate;
                const daysDifference = timeDifference / (1000 * 60 * 60 * 24);
    
                // Check time frame based on selected key
                const isMatchingTimeFrame = 
                    selectedTimeKey[0] === 'all' ? true :
                    selectedTimeKey[0] === 'day' ? daysDifference < 2 :
                    selectedTimeKey[0] === 'week' ? daysDifference < 8 :
                    selectedTimeKey[0] === 'month' ? daysDifference < 31 :
                    true;
    
                // Location filtering logic
                const isMatchingLocation = selectedLocationKeys.length === 0 || 
                    selectedLocationKeys.some(key => {
                        const location = locations.find(loc => loc.key === key);  // Find location by key
                        return location?.label.toLowerCase() === job.location.toLowerCase();  // Match the label
                    });
    
                // Combine all filters
                return isMatchingQueryTags &&
                    (Object.values(selectedJobType).some(Boolean) ? isMatchingJobType : true) &&
                    (Object.values(selectedEmploymentType).some(Boolean) ? isMatchingEmploymentType : true) &&
                    isMatchingTimeFrame &&
                    isMatchingLocation;
            });
        });
    }, [queryTags, selectedJobType, selectedEmploymentType, selectedTimeKey, selectedLocationKeys]);
    

    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 3000);
    },[])

    const locations = [
        { key: 'sf', label: 'San Francisco' },
        { key: 'ny', label: 'New York' },
        { key: 'seattle', label: 'Seattle' },
        { key: 'la', label: 'Los Angeles' },
        { key: 'austin', label: 'Austin' },
        { key: 'toronto', label: 'Toronto' },
        { key: 'berlin', label: 'Berlin' },
        { key: 'pa', label: 'Palo Alto' }
    ];
    


    const onSearch = (value, _e, info) => {
        if (searchQuery.trim()) {
            setQueryTags(prevTags => [...prevTags, searchQuery]);
    
            // Preserve existing jobType filters
            setSearchParams(prevParams => {
                const currentJobTypes = prevParams.get("jobType") || "";
                return { query: searchQuery, ...(currentJobTypes ? { jobType: currentJobTypes } : {}) };
            });
        } else {
            setQueryTags([]);
            
            setSearchParams(prevParams => {
                const currentJobTypes = prevParams.get("jobType") || "";
                return currentJobTypes ? { jobType: currentJobTypes } : {}; // Keep jobType if present
            });
        }
    };
    
    function handleSelect(selected) {
        setSelectedLocationKeys(selected.selectedKeys); // Store keys (abbreviations)
        setSelectedLocations(locations.filter(loc => selected.selectedKeys.includes(loc.key)).map(loc => loc.label)); // Store labels
        updateSearchParams(selected.selectedKeys);
    }
    
    function handleDeselect(selected) {
        console.log(selected)
        setSelectedLocationKeys((prev) => prev.filter((loc) => loc !== selected.key)); // Remove key
        setSelectedLocations((prev) => prev.filter((loc) => loc !== selected.label)); // Remove label
        handleTagClose(selected.key);
        updateSearchParams(selectedLocationKeys.filter((loc) => loc !== selected.key));
    }
    
    function handleTagClose(tag) {
        setSelectedLocationKeys((prev) => prev.filter((loc) => loc !== tag)); // Remove key
        setSelectedLocations((prev) => prev.filter((loc) => loc !== locations.find(loc => loc.key === tag).label)); // Remove label
        updateSearchParams(selectedLocationKeys.filter((loc) => loc !== tag));
    }
    
    function updateSearchParams(locationKeys) {
        // Filter out the "all" value from locationKeys
        const filteredLocationKeys = locationKeys.filter(key => key !== 'all');
    
        if (filteredLocationKeys.length === 0) {
            // Remove the location param from the search if no locations are selected
            searchParams.delete('location');
        } else {
            // Update the location param with selected location keys, excluding "all"
            searchParams.set('location', filteredLocationKeys.join(','));
        }
    
        // Update the search params in the URL
        setSearchParams(searchParams);
    }
    

    
  return (
    <><h1 className="gabarito-400 text-center text-white text-6xl md:text-8xl">
    <span className="bg-gradient-to-r from-blue-400 to-blue-200 text-transparent bg-clip-text">
    View Jobs
</span>
</h1>
<div className="w-full flex flex-wrap justify-center mt-5 gap-3">
    <div className='w-[700px]'>
<Search size='large' value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)} onSearch={onSearch} placeholder="Search for jobs" enterButton />
    </div>
    <div>
        <Dropdown.Button  size='large' menu={{items:locations,selectable:true,selectedKeys:selectedLocationKeys, multiple:true,onDeselect:handleDeselect,onSelect:handleSelect}}>{selectedLocations.length == 0? 'All Locations': <div className='flex flex-wrap gap-2 max-w-full'> {selectedLocationKeys.filter(key => key !== 'all' && key !== '').map((key) => {
    const location = locations.find(loc => loc.key === key);  // Find the location object using the key
    return (
        <Tag
            onClose={(e) => { e.preventDefault(); handleTagClose(key); }}  // Pass the key for closing
            key={key}  // Use the location key
            closable
        >
            {location?.label}  {/* Render the label of the location */}
        </Tag>
    );
})}
</div>}</Dropdown.Button>
    </div>
    <Button size='large' icon={<SlidersHorizontal/>} onClick={showDrawer}/>

</div>
<Filters open={open} onClose={onClose} selectedTime={selectedTime} selectedTimeKey={selectedTimeKey} setSelectedTimeKey={setSelectedTimeKey} setSelectedTime={setSelectedTime} selectedJobType={selectedJobType} setSelectedJobType={setSelectedJobType} selectedEmploymentType={selectedEmploymentType} setSelectedEmploymentType={setSelectedEmploymentType}/>
<div className='w-full flex flex-col items-center gap-3 mt-5 overflow-hidden'>
{loading
            ? [...Array(rowsPerPage)].map((_, idx) => (
                <Skeleton key={idx} className="h-[200px] md:h-[125px] w-full md:w-[70dvw] rounded-lg" />
              ))
            : filteredJobs.slice(startIndex, endIndex).map((job, idx) => (
                <JobListing key={idx} data={job} />
              ))}
              <ConfigProvider theme={
                {   
                    token:{
                        colorBgContainer:'transparent',
                        colorText:'white'
                    },
                    components:{
                    Pagination:{
                        itemBg:'transparent',
                        itemHoverBg:'gray-500',
                        itemHoverColor:'grey-100',
                        }
                    }
                }
            }>
          <Pagination
                showQuickJumper
                current={currentPage}  // Ensure controlled state
                pageSize={rowsPerPage}
                total={filteredJobs.length}
                onChange={onChange}  // Pass function to handle page change
            />
              </ConfigProvider>
</div>
</>
  )
}

export default ViewJobs

