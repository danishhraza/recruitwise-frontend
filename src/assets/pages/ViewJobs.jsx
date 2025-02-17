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
    }
]

function ViewJobs() {
    const rowsPerPage = 5;
    
    const [searchQuery, setSearchQuery] = useState("");
    const [queryTags, setQueryTags] = useState([]);
    const [searchParams,setSearchParams] = useSearchParams()
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [selectedTime, setSelectedTime] = useState('Anytime')
    const [selectedJobType, setSelectedJobType] = useState('')
    const [selectedEmploymentType, setSelectedEmploymentType] = useState('')

    const [startIndex,setStartIndex] = useState(0)
    const [endIndex,setEndIndex] = useState(rowsPerPage)
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedLocations, setSelectedLocations] = useState([]);
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
        // Get search query from URL if present
        const queryFromURL = searchParams.get("query");
        if (queryFromURL) {
            setSearchQuery(queryFromURL);
            setQueryTags([queryFromURL]); // Add as tag
        }
    }, []);

    useEffect(() => {
        // Filter jobs whenever queryTags change
        if (queryTags.length > 0) {
            setFilteredJobs(dummy.filter(job => 
                queryTags.some(tag => job.title.toLowerCase().includes(tag.toLowerCase()))
            ));
        } else {
            setFilteredJobs(dummy); // Show all if no filter
        }
    }, [queryTags]);

    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 3000);
    },[])

    const locations =[
        { key: 'san francisco', label: 'San Francisco' },
        { key: 'new york', label: 'New York' },
        { key: 'seattle', label: 'Seattle' },
        { key: 'los angeles', label: 'Los Angeles' },
        { key: 'austin', label: 'Austin' },
        { key: 'toronto', label: 'Toronto' },
        { key: 'berlin', label: 'Berlin' },
        { key: 'palo alto', label: 'Palo Alto' }
    ]

function handleSelect(selected) {
        setSelectedLocations(selected.selectedKeys);
    }
function handleDeselect(selected) {
        setSelectedLocations((prev)=>prev.filter((loc)=>loc !== selected.key))

    }

    const onSearch = (value, _e, info) => {
        if (searchQuery.trim()) {
            setQueryTags(prevTags => [...prevTags, searchQuery]);
            setSearchParams({ query: searchQuery }); // Update URL with search term
        }else{

        setQueryTags([]); // Clear query tags
        setSearchParams({}); // Remove query from URL
        }
    }

  
function handleTagClose(tag){
    setSelectedLocations((prev)=>prev.filter((loc)=>loc !== tag))
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
        <Dropdown.Button  size='large' menu={{items:locations,selectable:true,selectedKeys:selectedLocations, multiple:true,onDeselect:handleDeselect,onSelect:handleSelect}}>{selectedLocations.length == 0? 'All Locations': <div className='flex flex-wrap gap-2 max-w-full'> {selectedLocations.map((loc,)=><Tag onClose={(e)=>{e.preventDefault(); handleTagClose(loc)}} key={loc} closable>{loc}</Tag>)}</div>}</Dropdown.Button>
    </div>
    <Button size='large' icon={<SlidersHorizontal/>} onClick={showDrawer}/>

</div>
<Filters open={open} onClose={onClose} selectedTime={selectedTime} setSelectedTime={setSelectedTime}/>
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
                total={Jobs.length}
                onChange={onChange}  // Pass function to handle page change
            />
              </ConfigProvider>
</div>
</>
  )
}

export default ViewJobs

