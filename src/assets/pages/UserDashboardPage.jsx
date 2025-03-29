import { UserDashboardHeader } from "../components/UserDashboard/header"
import { UserProfile } from "../components/UserDashboard/profile"
import { UserSidebar } from "../components/UserDashboard/sidebar"
import { ThemeProvider } from "../components/theme-provider";

export default function UserDashboardPage() {
  return (
    <ThemeProvider defaultTheme="dark">
    <div className="flex min-h-screen bg-background">
      <UserSidebar />
      <div className="flex-1">
        <UserDashboardHeader />
        <main className="container mx-auto p-4 md:p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
            <p className="text-muted-foreground">Manage your profile information and track your job search progress.</p>
          </div>
          <UserProfile />
        </main>
      </div>
    </div>
    </ThemeProvider>
  )
}

