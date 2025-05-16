import { UserProfile } from "../components/UserDashboard/profile"

export default function UserDashboardPage() {
  return (
        <main className="container mx-auto p-4 md:p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-primary">My Profile</h1>
            <p className="text-muted-foreground">Manage your profile information and track your job search progress.</p>
          </div>
          <UserProfile />
        </main>
  )
}

