import { useState } from "react"
import { Search, Bookmark, MapPin, Building, Calendar, DollarSign } from "lucide-react"

import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card"
import { Input } from "../../../components/ui/input"
import { getUserSavedJobs } from "../../../lib/user-data"

export function SavedJobs() {
  const [searchQuery, setSearchQuery] = useState("")
  const savedJobs = getUserSavedJobs()

  const filteredJobs = savedJobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex w-full items-center space-x-2">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search saved jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8"
          />
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-8 text-center">
          <div className="rounded-full bg-primary/10 p-3 mb-4">
            <Bookmark className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mb-2 text-xl font-medium">No saved jobs found</h3>
          <p className="text-muted-foreground">
            {searchQuery ? `No jobs match your search for "${searchQuery}"` : "You haven't saved any jobs yet."}
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredJobs.map((job) => (
            <Card key={job.id} className="flex flex-col rounded-lg bg-primary-foreground">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="line-clamp-2 text-xl">{job.title}</CardTitle>
                  <Button variant="ghost" size="icon" className="text-primary">
                    <Bookmark className="h-5 w-5 fill-current" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="flex-1 pb-2">
                <div className="mb-4 space-y-2 text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <Building className="mr-1 h-4 w-4" />
                    {job.company}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <MapPin className="mr-1 h-4 w-4" />
                    {job.location}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <DollarSign className="mr-1 h-4 w-4" />
                    {job.salary}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Calendar className="mr-1 h-4 w-4" />
                    Posted: {job.postedDate}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{job.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <div className="text-sm text-muted-foreground">Saved: {job.savedDate}</div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                  <Button size="sm">Apply</Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

