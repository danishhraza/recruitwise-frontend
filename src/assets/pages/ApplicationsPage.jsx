import { UserApplications } from "../components/UserDashboard/applications"

export default function ApplicationsPage() {
  return (
        <main className="container mx-auto p-4 md:p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-primary">My Applications</h1>
            <p className="text-muted-foreground">Track and manage your job applications.</p>
          </div>
          <UserApplications />
        </main>
  )
}

