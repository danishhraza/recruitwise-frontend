import { Button, Dropdown, Input} from 'antd'
import Search from 'antd/es/input/Search'
import { FilterIcon, SlidersHorizontal } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import JobListing from '../components/JobListing'
import { Skeleton } from "@/components/ui/skeleton"

function ViewJobs() {
    const [loading,setLoading] = useState(false)

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
    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
        }, 3000);
    },[])

    const locations =[
        { key: 'san-francisco', label: 'San Francisco' },
        { key: 'new-york', label: 'New York' },
        { key: 'seattle', label: 'Seattle' },
        { key: 'los-angeles', label: 'Los Angeles' },
        { key: 'austin', label: 'Austin' },
        { key: 'toronto', label: 'Toronto' },
        { key: 'berlin', label: 'Berlin' },
        { key: 'palo-alto', label: 'Palo Alto' }
    ]
    
      
  return (
    <><h1 className="gabarito-400 text-center text-white text-6xl md:text-8xl">
    <span className="bg-gradient-to-r from-blue-400 to-blue-200 text-transparent bg-clip-text">
    View Jobs
</span>
</h1>
<div className="w-full flex justify-center mt-5 gap-3">
    <div className='w-[700px]'>
<Search size='large' placeholder="Search for jobs" enterButton />
    </div>
    <div>
        <Dropdown.Button size='large' menu={{items:locations,selectable:true,multiple:true}}>Select Locations</Dropdown.Button>
    </div>
    <Button size='large' icon={<SlidersHorizontal/>} />
</div>
<div className='w-full flex flex-col items-center gap-3 mt-5 overflow-auto'>
    {dummy.map((job,idx) => loading? <Skeleton className="h-[125px] w-[70dvw] rounded-lg" />:
    <JobListing key={idx} data={job} />
)}
</div>
</>
  )
}

export default ViewJobs

