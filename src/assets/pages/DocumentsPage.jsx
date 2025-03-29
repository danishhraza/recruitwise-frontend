import { UserDocuments } from "../components/UserDashboard/documents"
import { UserDashboardHeader } from "../components/UserDashboard/header"
import { UserSidebar } from "../components/UserDashboard/sidebar"
import { ThemeProvider } from "../components/theme-provider";

export default function DocumentsPage() {
  return (
    <ThemeProvider defaultTheme="dark">
    <div className="flex min-h-screen bg-background">
      <UserSidebar />
      <div className="flex-1">
        <UserDashboardHeader />
        <main className="container mx-auto p-4 md:p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-primary">Resumes & Cover Letters</h1>
            <p className="text-muted-foreground">Manage your resumes and cover letters for job applications.</p>
          </div>
          <UserDocuments />
        </main>
      </div>
    </div>
    </ThemeProvider>
  )
}

