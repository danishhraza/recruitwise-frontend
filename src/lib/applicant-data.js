// Mock data for applicant profiles

export function getApplicantById(id) {
    const applicants = [
      {
        id: "applicant-1",
        name: "Bryan Johnson",
        favorite: true,
        views: 326,
        expiresIn: "4 days",
        role: "Senior Full Stack",
        experience: 8,
        rate: 80,
        location: "Boca Raton, FL • USA",
        skills: ["React", "Node"],
        certifications: [
          { name: "AI Certified", primary: false },
          { name: "React", primary: true },
        ],
        hiringSignals: [
          "Over 8 years of experience, 6 years w/ React",
          "He spent a significant amount of time as a university professor, which reflects his deep knowledge.",
        ],
        email: "bryan.johnson@example.com",
        phone: "+1 (555) 123-4567",
        links: [
          { type: "Resume", url: "#" },
          { type: "GitHub", url: "https://github.com/bryanjohnson" },
          { type: "Portfolio", url: "https://bryanjohnson.dev" },
        ],
        reviews: [
          {
            reviewer: "Jane Smith",
            date: "2 months ago",
            rating: 5,
            comment:
              "Bryan was an excellent candidate. His technical knowledge is impressive and he communicates clearly.",
          },
          {
            reviewer: "Michael Wong",
            date: "3 months ago",
            rating: 4,
            comment: "Strong technical skills and good cultural fit.",
          },
        ],
        interviewImage:
          "https://recruitwise-frontend.vercel.app/images/pov-interview5.jpg",
        currentQuestion:
          "Can you describe your experience with building cloud-based, streaming microservices at scale? Please provide specific examples, including the technologies and architectures used.",
        questions: [
          {
            title: "Cloud based microservices",
            duration: "02:12",
            time: "48 × 48",
          },
          {
            title: "How have you used KafkaStreams or Flink?",
            duration: "03:05",
            time: "48 × 48",
          },
          {
            title: "How have you used Flink?",
            duration: "03:08",
            time: "48 × 48",
          },
          {
            title: "Why Bryan?",
            duration: "02:21",
            time: "48 × 48",
          },
        ],
      },
      {
        id: "applicant-2",
        name: "Sarah Miller",
        favorite: false,
        views: 215,
        expiresIn: "6 days",
        role: "Frontend Developer",
        experience: 5,
        rate: 65,
        location: "Austin, TX • USA",
        skills: ["React", "TypeScript", "CSS"],
        certifications: [
          { name: "AWS Certified", primary: false },
          { name: "React", primary: true },
        ],
        hiringSignals: [
          "5 years of experience with modern frontend frameworks",
          "Strong portfolio of responsive and accessible web applications",
        ],
        email: "sarah.miller@example.com",
        phone: "+1 (555) 987-6543",
        links: [
          { type: "Resume", url: "#" },
          { type: "GitHub", url: "https://github.com/sarahmiller" },
          { type: "Portfolio", url: "https://sarahmiller.dev" },
        ],
        reviews: [
          {
            reviewer: "David Chen",
            date: "1 month ago",
            rating: 4,
            comment: "Sarah has excellent frontend skills and a good eye for design.",
          },
        ],
        questions: [
          {
            title: "React performance optimization",
            duration: "02:45",
            time: "48 × 48",
          },
          {
            title: "CSS architecture experience",
            duration: "03:12",
            time: "48 × 48",
          },
          {
            title: "TypeScript best practices",
            duration: "02:58",
            time: "48 × 48",
          },
        ],
      },
    ]
  
    return applicants.find((applicant) => applicant.id === id)
  }
  
  export function getAllApplicants() {
    return [
      {
        id: "applicant-1",
        name: "Bryan Johnson",
        role: "Senior Full Stack",
        appliedDate: "2023-04-10",
        status: "interview",
        score: 9.2,
      },
      {
        id: "applicant-2",
        name: "Sarah Miller",
        role: "Frontend Developer",
        appliedDate: "2023-04-08",
        status: "screening",
        score: 8.5,
      },
      {
        id: "applicant-3",
        name: "Michael Wong",
        role: "Full Stack Developer",
        appliedDate: "2023-04-05",
        status: "assessment",
        score: 7.8,
      },
      {
        id: "applicant-4",
        name: "Emily Davis",
        role: "React Developer",
        appliedDate: "2023-04-03",
        status: "pending",
        score: 6.5,
      },
      {
        id: "applicant-5",
        name: "James Wilson",
        role: "Senior Developer",
        appliedDate: "2023-04-01",
        status: "rejected",
        score: 5.2,
      },
    ]
  }
  
  