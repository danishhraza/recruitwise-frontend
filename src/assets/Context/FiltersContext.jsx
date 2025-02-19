import { createContext, useContext, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

const FiltersContext = createContext();

const jobTypes = ["fullTime", "partTime", "internship", "contract", "temporary"];
const employmentTypes = ["onsite", "hybrid", "remote"];
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


export const FiltersProvider = ({ children }) => {
    const [searchParams, setSearchParams] = useSearchParams ();
    const [filters, setFilters] = useState({
        searchQuery: '',
        queryTags: [],
        selectedTime: 'Anytime',
        selectedTimeKey: ['all'],
        selectedLocations: [],
        selectedLocationKeys: [],
        selectedJobType: {}, 
        selectedEmploymentType: {},
        filteredJobs: []
    });


    
    
        // Initialize filters from URL params
        useEffect(() => {
            const initializeFromURL = () => {
                const updates = {};
                
                // Search query
                const queryFromURL = searchParams.get('query');
                if (queryFromURL) {
                    updates.searchQuery = queryFromURL;
                    updates.queryTags = [queryFromURL];
                }
    
                // Job types
                const paramJobTypes = searchParams.get('jobType')?.split(',') || [];
                updates.selectedJobType = jobTypes.reduce(
                    (acc, type) => ({ ...acc, [type]: paramJobTypes.includes(type) }), {}
                );
    
                // Employment types
                const paramEmployTypes = searchParams.get('eType')?.split(',') || [];
                updates.selectedEmploymentType = employmentTypes.reduce(
                    (acc, type) => ({ ...acc, [type]: paramEmployTypes.includes(type) }), {}
                );
    
                // Locations
                const locationParam = searchParams.get('location');
                if (locationParam) {
                    const locationKeys = locationParam.split(',').filter(key => key !== 'all');
                    updates.selectedLocationKeys = locationKeys;
                    updates.selectedLocations = locationKeys
                        .map(key => locations.find(loc => loc.key === key)?.label)
                        .filter(Boolean);
                }
    
                // Time filter
                const timeParam = searchParams.get('time');
                if (timeParam && ['day', 'week', 'month'].includes(timeParam)) {
                    updates.selectedTimeKey = [timeParam];
                    updates.selectedTime = {
                        day: 'Last 24 hours',
                        week: 'Last 7 days',
                        month: 'Last 30 days'
                    }[timeParam] || 'Anytime';
                }
    
                setFilters(prev => ({ ...prev, ...updates }));
            };
            console.log(filters)
            initializeFromURL();
        }, []); // Only run once on mount
     
        useEffect(() => {
            const filterJobs = () => {
                const jobTypeMap = {
                    fullTime: "full-time",
                    partTime: "part-time",
                    internship: "internship",
                    contract: "contract",
                    temporary: "temporary"
                };
        
                // Always filter from the full list (dummy)
                const filtered = dummy.filter(job => {
                    const matchingCriteria = {
                        jobType: Object.keys(filters.selectedJobType)
                            .some(type => filters.selectedJobType[type] && job.jobType === jobTypeMap[type]),
                        employmentType: Object.keys(filters.selectedEmploymentType)
                            .some(type => filters.selectedEmploymentType[type] && job.employmentType === type),
                        queryTags: filters.queryTags.length === 0 ||
                            filters.queryTags.some(tag => job.title.toLowerCase().includes(tag.toLowerCase())),
                        timeFrame: (() => {
                            const daysDifference = (new Date() - new Date(job.createdAt)) / (1000 * 60 * 60 * 24);
                            const timeFrames = {
                                day: daysDifference < 2,
                                week: daysDifference < 8,
                                month: daysDifference < 31,
                                all: true
                            };
                            return timeFrames[filters.selectedTimeKey[0]];
                        })(),
                        location: filters.selectedLocationKeys.length === 0 ||
                            filters.selectedLocationKeys.some(key => {
                                const location = locations.find(loc => loc.key === key);
                                return location?.label.toLowerCase() === job.location.toLowerCase();
                            })
                    };
                    console.log("Query tags: ",matchingCriteria.queryTags)
                    return matchingCriteria.queryTags &&
                        (Object.values(filters.selectedJobType).some(Boolean) ? matchingCriteria.jobType : true) &&
                        (Object.values(filters.selectedEmploymentType).some(Boolean) ? matchingCriteria.employmentType : true) &&
                        matchingCriteria.timeFrame &&
                        matchingCriteria.location;
                });

                console.log("Filtered Jobs: ",filtered)
        
                // Update filters state with the new filtered jobs
                setFilters(prev => ({ ...prev, filteredJobs: filtered }));
            };
        
            filterJobs();
        }, [
            filters.queryTags,
            filters.selectedJobType,
            filters.selectedEmploymentType,
            filters.selectedTimeKey,
            filters.selectedLocationKeys,
            dummy,
            locations
        ]);
        
        const handleSearch = (value) => {
            const trimmedValue = value.trim().toLowerCase();
        
            setFilters(prev => ({
                ...prev,
                queryTags: trimmedValue ? [trimmedValue] : [] // Replace with latest query
            }));
        
            setSearchParams(prev => {
                const currentJobTypes = prev.get("jobType") || "";
                return trimmedValue
                    ? { query: trimmedValue, ...(currentJobTypes ? { jobType: currentJobTypes } : {}) }
                    : currentJobTypes ? { jobType: currentJobTypes } : {};
            });
        };
        
    
        const handleLocationSelect = (selected) => {
            const newKeys = selected.selectedKeys;
            const newLocations = locations
                .filter(loc => newKeys.includes(loc.key))
                .map(loc => loc.label);
    
            setFilters(prev => ({
                ...prev,
                selectedLocationKeys: newKeys,
                selectedLocations: newLocations
            }));
    
            updateLocationParams(newKeys);
        };
    
        const handleLocationDeselect = (selected) => {
            console.log("Deselected Key:", selected.key);
        
            // Filter out the deselected key from selectedKeys
            const newKeys = filters.selectedLocationKeys.filter(k => k !== selected.key);
            console.log("Updated Selected Keys:", newKeys);
        
            // Ensure selectedLocations correctly reflects newKeys
            const newLocations = newKeys.length > 0
                ? locations.filter(loc => newKeys.includes(loc.key)).map(loc => loc.label)
                : [];
        
            console.log("Updated Selected Locations:", newLocations);
        
            setFilters(prev => ({
                ...prev,
                selectedLocationKeys: newKeys,
                selectedLocations: newLocations
            }));
        
            updateLocationParams(newKeys);
        };
        
        
        function handleTagRemove(tag){
            const newKeys = filters.selectedLocationKeys.filter(loc => loc.key == tag);
        }
        const updateLocationParams = (locationKeys) => {
            const filteredKeys = locationKeys.filter(key => key !== 'all');
        
            // Create a new URLSearchParams instance to avoid mutating the original
            const newSearchParams = new URLSearchParams(searchParams);
        
            if (filteredKeys.length === 0) {
                newSearchParams.delete('location'); // Remove location if empty
            } else {
                newSearchParams.set('location', filteredKeys.join(',')); // Update location param
            }
        
            setSearchParams(newSearchParams); // Update with new params
        };
        
    return (
        <FiltersContext.Provider value={{ filters,handleTagRemove, setFilters, handleSearch, handleLocationSelect, handleLocationDeselect, locations, dummy }}>
            {children}
        </FiltersContext.Provider>
    );
};

export function useFilters() {
  const context = useContext(FiltersContext);
  if (!context) {
    throw new Error('useRoom must be used within a FiltersProvider');
  }
  return context;
}