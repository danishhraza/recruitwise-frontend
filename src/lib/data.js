// Mock jobs data for simulating MongoDB fetch
const jobs = [
  {
    id: "job-1",
    title: "Senior Frontend Developer",
    company: "TechVision Inc.",
    location: "San Francisco, CA (Remote)",
    employmentType: "remote",
    experience: "5+ years",
    salary: 135000,
    isActive: true,
    jobType: "full-time",
    tags: ["React", "JavaScript", "CSS", "Redux", "TypeScript"],
    postedDate: "2023-03-15",
    applicationDeadline: "2023-04-15",
    description:
      "We are looking for a Senior Frontend Developer to join our team. You will be responsible for building and maintaining our web applications.",
    requirements: [
      "5+ years of experience with React",
      "Strong understanding of JavaScript, HTML, and CSS",
      "Experience with modern frontend frameworks",
      "Experience with state management libraries",
      "Experience with responsive design",
    ],
    responsibilities: [
      "Build and maintain web applications",
      "Collaborate with designers and backend developers",
      "Write clean, maintainable code",
      "Optimize applications for maximum speed and scalability",
      "Stay up-to-date with emerging trends and technologies",
    ],
    recruiter: "Sarah Johnson",
    applicants: [
      {
        id: "applicant-1",
        name: "Alex Rivera",
        email: "alex.rivera@example.com",
        status: "interview",
        appliedDate: "2023-03-20",
        interviewStatus: "completed",
        score: 8,
      }
    ],
  },
  {
    id: "job-2",
    title: "Product Manager",
    company: "InnovateCorp",
    location: "New York, NY",
    employmentType: "on-site",
    experience: "3-5 years",
    salary: 125000,
    isActive: true,
    jobType: "full-time",
    tags: ["Product Management", "Agile", "UX", "Strategy", "Analytics"],
    postedDate: "2023-03-10",
    applicationDeadline: "2023-04-10",
    description:
      "We are looking for a Product Manager to join our team. You will be responsible for defining product strategy and roadmap.",
    requirements: [
      "3+ years of experience in product management",
      "Experience with agile methodologies",
      "Strong analytical skills",
      "Excellent communication skills",
      "Experience with product lifecycle management",
    ],
    responsibilities: [
      "Define product strategy and roadmap",
      "Gather and prioritize product requirements",
      "Work closely with engineering teams",
      "Analyze market trends and competition",
      "Communicate product vision to stakeholders",
    ],
    recruiter: "Michael Chen",
    applicants: [
      {
        id: "applicant-2",
        name: "Jordan Smith",
        email: "jordan.smith@example.com",
        status: "screening",
        appliedDate: "2023-03-15",
        interviewStatus: "completed",
        score: 7,
      }
    ],
  },
];

// API functions

// Function to simulate API fetch for all jobs
// Replace 'yourApiEndpoint/jobs' with your actual API endpoint when ready
export async function fetchAllJobs() {
  // When ready to use real API, replace this with:
  // return fetch('yourApiEndpoint/jobs').then(response => response.json())
  
  // For now, simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(jobs);
    }, 500);
  });
}

// Function to simulate API fetch for a specific job
// Replace 'yourApiEndpoint/jobs/' with your actual API endpoint when ready
export async function fetchJobById(id) {
  // When ready to use real API, replace this with:
  // return fetch(`yourApiEndpoint/jobs/${id}`).then(response => response.json())
  
  // For now, simulate network delay and finding a job
  return new Promise((resolve) => {
    setTimeout(() => {
      const job = jobs.find((job) => job.id === id);
      resolve(job || null);
    }, 500);
  });
}