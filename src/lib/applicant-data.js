// Mock data for applicant profiles

export function getApplicantById(id) {
  const applicants = [
    {
      id: "applicant-1",
      name: "Bryan Johnson",
      favorite: true,
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
      interviewImage:
        "https://recruitwise-frontend.vercel.app/images/pov-interview5.jpg",
      interviewScore: 87,
      skillRatings: {
        JavaScript: 9,
        CSS: 7,
        React: 8,
        Node: 8,
        "Communication Skills": 9
      }
    },
    {
      id: "applicant-2",
      name: "Sarah Miller",
      favorite: false,
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
      interviewScore: 82,
      skillRatings: {
        JavaScript: 8,
        CSS: 9,
        React: 8,
        TypeScript: 9,
        "Communication Skills": 7
      }
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