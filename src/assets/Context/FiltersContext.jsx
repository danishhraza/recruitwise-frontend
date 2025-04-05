import { createContext, useContext, useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";

const FiltersContext = createContext();

const jobTypes = ['Full-time', 'Part-time', 'Internship', 'Contract', 'Temporary'];
const employmentTypes = ['On Site', 'Hybrid', 'Remote'];
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

const jobs = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'Innovative Tech Solutions',
      location: 'San Francisco, CA (Remote)',
      postedDate: '2023-04-10',
      salary: '$120,000 - $150,000',
      experienceLevel: 'Senior',
      jobType: 'Full-time',
      employmentType: 'On Site',
      department: 'Engineering',
      status: 'Active',
      applicationDeadline: '2023-04-25',
      description: 'We are looking for a Senior Frontend Developer to join our team. You will be responsible for building and maintaining our web applications.',
      requirements: [
        '5+ years of experience with React',
        'Strong understanding of JavaScript, HTML, and CSS',
        'Experience with modern frontend frameworks',
        'Experience with state management libraries',
        'Experience with responsive design'
      ],
      responsibilities: [
        'Build and maintain web applications',
        'Collaborate with designers and backend developers',
        'Write clean, maintainable code',
        'Optimize applications for maximum speed and scalability',
        'Stay up-to-date with emerging trends and technologies'
      ]
    },
    {
      id: 2,
      title: 'UI/UX Developer',
      company: 'Creative Design Agency',
      location: 'New York, NY',
      postedDate: '2023-04-05',
      salary: '$90,000 - $120,000',
      experienceLevel: 'Mid-level',
      jobType: 'Part-time',
      employmentType: 'Remote',
      department: 'Design',
      status: 'Active',
      applicationDeadline: '2023-04-20',
      description: 'We are looking for a UI/UX Developer to join our creative team. You will be responsible for designing and implementing user interfaces for our clients.',
      requirements: [
        '3+ years of experience with UI/UX design',
        'Proficiency with design tools like Figma or Sketch',
        'Knowledge of HTML, CSS, and JavaScript',
        'Understanding of user experience principles',
        'Portfolio of previous work'
      ],
      responsibilities: [
        'Create user-friendly interfaces',
        'Develop UI mockups and prototypes',
        'Implement responsive designs',
        'Collaborate with the development team',
        'Gather and evaluate user requirements'
      ]
    },
    {
      id: 3,
      title: 'Full Stack Engineer',
      company: 'Tech Startup Inc.',
      location: 'Austin, TX',
      postedDate: '2023-03-28',
      salary: '$110,000 - $140,000',
      experienceLevel: 'Senior',
      jobType: 'Full-time',
      employmentType: 'On Site',
      department: 'Engineering',
      status: 'Active',
      applicationDeadline: '2023-04-15',
      description: 'We are seeking a Full Stack Engineer to join our growing team. You will work on both frontend and backend development for our main product.',
      requirements: [
        '4+ years of experience with full stack development',
        'Proficiency in React and Node.js',
        'Experience with databases (SQL and NoSQL)',
        'Knowledge of cloud services (AWS or Azure)',
        'Strong problem-solving skills'
      ],
      responsibilities: [
        'Develop and maintain both frontend and backend code',
        'Design and implement database schemas',
        'Ensure application performance and responsiveness',
        'Participate in code reviews',
        'Mentor junior developers'
      ]
    },
    {
      id: 4,
      title: 'Frontend Developer',
      company: 'E-commerce Platform',
      location: 'Chicago, IL',
      postedDate: '2023-03-20',
      salary: '$85,000 - $110,000',
      experienceLevel: 'Junior',
      jobType: 'Full-time',
      employmentType: 'Hybrid',
      department: 'Engineering',
      status: 'Active',
      applicationDeadline: '2023-04-10',
      description: 'We are looking for a Frontend Developer to help build and maintain our e-commerce platform.',
      requirements: [
        '2+ years of experience with frontend development',
        'Proficiency in JavaScript, HTML, and CSS',
        'Experience with a modern JavaScript framework (React, Vue, or Angular)',
        'Knowledge of responsive design principles',
        'Familiarity with version control systems'
      ],
      responsibilities: [
        'Implement user interfaces according to designs',
        'Ensure cross-browser compatibility',
        'Optimize application for speed and scalability',
        'Collaborate with backend developers',
        'Troubleshoot and debug issues'
      ]
    },
    {
      id: 5,
      title: 'React Developer',
      company: 'Financial Tech Company',
      location: 'Boston, MA (Remote)',
      postedDate: '2023-03-15',
      salary: '$100,000 - $130,000',
      experienceLevel: 'Mid-level',
      jobType: 'Internship',
      employmentType: 'Remote',
      department: 'Engineering',
      status: 'Active',
      applicationDeadline: '2023-04-20',
      description: 'We are looking for a React Developer to join our financial technology team. You will be responsible for developing user interfaces for our financial products.',
      requirements: [
        '3+ years of experience with React',
        'Strong JavaScript skills',
        'Experience with Redux or other state management libraries',
        'Knowledge of modern frontend build tools',
        'Understanding of financial data visualization is a plus'
      ],
      responsibilities: [
        'Develop and maintain React components',
        'Implement complex user interfaces',
        'Ensure code quality and performance',
        'Work with UX designers to implement designs',
        'Participate in agile development processes'
      ]
    }
  ];



export function FiltersProvider({ children }) {
    const [searchParams, setSearchParams] = useSearchParams();
    const location = useLocation();

    const [filters, setFilters] = useState({
        searchQuery: '',
        queryTags: [],
        selectedTime: 'Anytime',
        selectedTimeKey: ['all'],
        selectedLocations: [],
        selectedLocationKeys: [],
        selectedJobType: {},
        selectedEmploymentType: {},
        selectedExperienceLevel: {},
        filteredJobs: []
    });

    const handleTagRemove = (tag) => {
        const newTags = filters.queryTags.filter(t => t !== tag);

        setFilters(prev => ({
            ...prev,
            queryTags: newTags
        }));

        setSearchParams(prev => {
            const currentJobTypes = prev.get("jobType") || "";
            const query = newTags.length > 0 ? newTags[0] : null;

            const newParams = new URLSearchParams(prev);
            if (query) {
                newParams.set('query', query);
            } else {
                newParams.delete('query');
            }
            return newParams;
        });
    };

    useEffect(() => {
        const query = searchParams.get("query") || "";
        const jobType = searchParams.get("jobType")?.split(",") || [];
        const eType = searchParams.get("eType")?.split(",") || [];
        const time = searchParams.get("time") || "Anytime";

        const selectedJobType = jobType.reduce((acc, curr) => {
            acc[curr] = true;
            return acc;
        }, {});

        const selectedEmploymentType = eType.reduce((acc, curr) => {
            acc[curr] = true;
            return acc;
        }, {});

        const queryTags = query ? [query] : [];

        setFilters(prev => ({
            ...prev,
            queryTags,
            searchQuery: query,
            selectedJobType,
            selectedEmploymentType,
            selectedTime: time
        }));
    }, [searchParams]);

    useEffect(() => {
        const filtered = jobs.filter(job => {
          // Check if the job matches the search query
          const matchesQuery = filters.queryTags.length === 0 ||
            filters.queryTags.some(tag =>
              job.title.toLowerCase().includes(tag.toLowerCase()) ||
              job.company.toLowerCase().includes(tag.toLowerCase()) ||
              job.description.toLowerCase().includes(tag.toLowerCase())
            );
          
          // Check if the job matches the selected job type(s)
          const matchesJobType = Object.keys(filters.selectedJobType).length === 0 || 
            !Object.values(filters.selectedJobType).some(Boolean) ||
            (job.employmentType && filters.selectedJobType[job.jobType]);
          
          // Check if the job matches the selected employment type(s)
          const matchesEmploymentType = Object.keys(filters.selectedEmploymentType).length === 0 || 
            !Object.values(filters.selectedEmploymentType).some(Boolean) ||
            (job.employmentType && filters.selectedEmploymentType[job.employmentType]);
          
          // Check if the job matches the selected experience level(s)
          const matchesExperienceLevel = Object.keys(filters.selectedExperienceLevel).length === 0 || 
            !Object.values(filters.selectedExperienceLevel).some(Boolean) ||
            (job.experienceLevel && filters.selectedExperienceLevel[job.experienceLevel]);
      
          return matchesQuery && matchesJobType && matchesEmploymentType && matchesExperienceLevel;
        });
      
        // Update the filtered jobs in state
        setFilters(prev => ({ ...prev, filteredJobs: filtered }));
      }, [
        // Only depend on the filter criteria, not the filtered results
        filters.queryTags, 
        filters.selectedJobType, 
        filters.selectedEmploymentType, 
        filters.selectedExperienceLevel,
        // Include jobs as a dependency since it might change
        jobs
      ]);

    return (
        <FiltersContext.Provider value={{ filters, setFilters, setSearchParams, handleTagRemove }}>
            {children}
        </FiltersContext.Provider>
    );
}

export function useFilters() {
  const context = useContext(FiltersContext);
  if (!context) {
    throw new Error('useRoom must be used within a FiltersProvider');
  }
  return context;
}