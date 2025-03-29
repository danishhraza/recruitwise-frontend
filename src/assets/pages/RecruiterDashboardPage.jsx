import { DashboardHeader } from "../components/RecruiterDashboard/header"
import { JobList } from "../components/RecruiterDashboard/job-list"
import { DashboardSidebar } from "../components/RecruiterDashboard/sidebar"
import { ThemeProvider } from "../components/theme-provider";

export default function DashboardPage() {
  return (
    <ThemeProvider defaultTheme="dark">
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />
      <div className="flex-1">
        <DashboardHeader />
        <main className="container mx-auto p-4 md:p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-primary">Job Postings</h1>
            <p className="text-muted-foreground">Manage and track all your job postings and applicants.</p>
          </div>
          <JobList />
        </main>
      </div>
    </div>
    </ThemeProvider>
  )
}

