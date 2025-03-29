import { SavedJobs } from "../components/UserDashboard/saved-jobs"
import { UserDashboardHeader } from "../components/UserDashboard/header"
import { UserSidebar } from "../components/UserDashboard/sidebar"
import { ThemeProvider } from "../components/theme-provider";

export default function SavedJobsPage() {
  return (
    <ThemeProvider defaultTheme="dark">
    <div className="flex min-h-screen bg-background">
      <UserSidebar />
      <div className="flex-1">
        <UserDashboardHeader />
        <main className="container mx-auto p-4 md:p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-primary">Saved Jobs</h1>
            <p className="text-muted-foreground">View and manage your saved job listings.</p>
          </div>
          <SavedJobs />
        </main>
      </div>
    </div>
    </ThemeProvider>
  )
}

