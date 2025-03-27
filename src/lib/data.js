// Mock data for the recruiter dashboard

// Generate a random date in the past few months
function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split("T")[0]
  }
  
  // Generate a random score between 1 and 10
  function randomScore() {
    return Math.floor(Math.random() * 10) + 1
  }
  
  // Generate random applicants
  function generateApplicants(count) {
    const statuses = ["pending", "screening", "interview", "assessment", "hired", "rejected"]
    const interviewStatuses = ["pending", "scheduled", "completed", "cancelled"]
  
    return Array.from({ length: count }, (_, i) => ({
      id: `applicant-${i + 1}`,
      name: `Applicant ${i + 1}`,
      email: `applicant${i + 1}@example.com`,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      appliedDate: randomDate(new Date(2023, 0, 1), new Date()),
      interviewStatus: interviewStatuses[Math.floor(Math.random() * interviewStatuses.length)],
      score: randomScore(),
    }))
  }
  
  // Mock jobs data
  const jobs = [
    {
      id: "job-1",
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "San Francisco, CA (Remote)",
      employmentType: "Full-time",
      experienceLevel: "Senior",
      salaryRange: "$120,000 - $150,000",
      status: "Active",
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
      applicants: generateApplicants(12),
    },
    {
      id: "job-2",
      title: "Product Manager",
      department: "Product",
      location: "New York, NY",
      employmentType: "Full-time",
      experienceLevel: "Mid-Senior",
      salaryRange: "$110,000 - $140,000",
      status: "Active",
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
      applicants: generateApplicants(8),
    },
    {
      id: "job-3",
      title: "DevOps Engineer",
      department: "Engineering",
      location: "Austin, TX (Remote)",
      employmentType: "Full-time",
      experienceLevel: "Mid-Senior",
      salaryRange: "$100,000 - $130,000",
      status: "Active",
      postedDate: "2023-03-05",
      applicationDeadline: "2023-04-05",
      description:
        "We are looking for a DevOps Engineer to join our team. You will be responsible for building and maintaining our infrastructure.",
      requirements: [
        "3+ years of experience with AWS or similar cloud platforms",
        "Experience with containerization technologies",
        "Experience with CI/CD pipelines",
        "Experience with infrastructure as code",
        "Experience with monitoring and logging tools",
      ],
      responsibilities: [
        "Build and maintain infrastructure",
        "Automate deployment processes",
        "Monitor and optimize system performance",
        "Implement security best practices",
        "Collaborate with development teams",
      ],
      applicants: generateApplicants(5),
    },
    {
      id: "job-4",
      title: "UX/UI Designer",
      department: "Design",
      location: "Seattle, WA",
      employmentType: "Full-time",
      experienceLevel: "Mid-level",
      salaryRange: "$90,000 - $120,000",
      status: "Active",
      postedDate: "2023-02-28",
      applicationDeadline: "2023-03-28",
      description:
        "We are looking for a UX/UI Designer to join our team. You will be responsible for creating user-centered designs for our products.",
      requirements: [
        "3+ years of experience in UX/UI design",
        "Experience with design tools like Figma or Sketch",
        "Understanding of user-centered design principles",
        "Experience with design systems",
        "Portfolio showcasing your work",
      ],
      responsibilities: [
        "Create user-centered designs",
        "Conduct user research and testing",
        "Create wireframes, prototypes, and high-fidelity designs",
        "Collaborate with product and engineering teams",
        "Maintain and evolve design systems",
      ],
      applicants: generateApplicants(10),
    },
    {
      id: "job-5",
      title: "Data Scientist",
      department: "Data",
      location: "Chicago, IL (Hybrid)",
      employmentType: "Full-time",
      experienceLevel: "Senior",
      salaryRange: "$130,000 - $160,000",
      status: "Active",
      postedDate: "2023-02-20",
      applicationDeadline: "2023-03-20",
      description:
        "We are looking for a Data Scientist to join our team. You will be responsible for analyzing data and building machine learning models.",
      requirements: [
        "5+ years of experience in data science",
        "Strong understanding of machine learning algorithms",
        "Experience with Python and data science libraries",
        "Experience with big data technologies",
        "Strong analytical and problem-solving skills",
      ],
      responsibilities: [
        "Analyze data and extract insights",
        "Build and deploy machine learning models",
        "Collaborate with product and engineering teams",
        "Communicate findings to stakeholders",
        "Stay up-to-date with emerging trends and technologies",
      ],
      applicants: generateApplicants(7),
    },
    {
      id: "job-6",
      title: "Backend Developer",
      department: "Engineering",
      location: "Remote",
      employmentType: "Full-time",
      experienceLevel: "Mid-level",
      salaryRange: "$100,000 - $130,000",
      status: "Closed",
      postedDate: "2023-01-15",
      applicationDeadline: "2023-02-15",
      description:
        "We are looking for a Backend Developer to join our team. You will be responsible for building and maintaining our backend services.",
      requirements: [
        "3+ years of experience with Node.js or similar technologies",
        "Experience with databases like MongoDB or PostgreSQL",
        "Experience with RESTful APIs",
        "Experience with microservices architecture",
        "Strong problem-solving skills",
      ],
      responsibilities: [
        "Build and maintain backend services",
        "Design and implement APIs",
        "Optimize database performance",
        "Collaborate with frontend developers",
        "Write clean, maintainable code",
      ],
      applicants: generateApplicants(15),
    },
  ]
  
  // Function to get all jobs
  export async function getAllJobs() {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(jobs)
      }, 500)
    })
  }
  
  // Function to get a job by ID
  export async function getJobById(id) {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        const job = jobs.find((job) => job.id === id)
        resolve(job || null)
      }, 500)
    })
  }
  
  