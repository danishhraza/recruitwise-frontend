import { Github, Linkedin, Twitter, Globe, Mail, MapPin, Phone, Calendar, Briefcase, Bookmark } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { getUserData } from "../../../lib/user-data"

export function UserProfile() {
  const userData = getUserData()

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Left column - Profile card */}
      <div className="space-y-6">
        <Card className="bg-primary-foreground rounded-lg">
          <CardHeader className="relative pb-0">
            <div className="absolute right-4 top-4">
              <Button variant="ghost" size="icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-4 w-4"
                >
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                </svg>
                <span className="sr-only">Edit Profile</span>
              </Button>
            </div>
            <div className="flex flex-col items-center">
              <Avatar className="h-24 w-24">
                <AvatarImage src={userData.profilePicture} alt={userData.name} />
                <AvatarFallback className="text-2xl">{userData.initials}</AvatarFallback>
              </Avatar>
              <CardTitle className="mt-4 text-center text-xl">{userData.name}</CardTitle>
              <CardDescription className="text-center">{userData.title}</CardDescription>

              <div className="mt-2 flex items-center text-sm text-muted-foreground">
                <MapPin className="mr-1 h-4 w-4" />
                {userData.location}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex justify-center space-x-2">
                {userData.socialLinks.linkedin && (
                  <Button variant="outline" size="icon" asChild>
                    <a href={userData.socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="h-4 w-4" />
                      <span className="sr-only">LinkedIn</span>
                    </a>
                  </Button>
                )}
                {userData.socialLinks.github && (
                  <Button variant="outline" size="icon" asChild>
                    <a href={userData.socialLinks.github} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4" />
                      <span className="sr-only">GitHub</span>
                    </a>
                  </Button>
                )}
                {userData.socialLinks.twitter && (
                  <Button variant="outline" size="icon" asChild>
                    <a href={userData.socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                      <Twitter className="h-4 w-4" />
                      <span className="sr-only">Twitter</span>
                    </a>
                  </Button>
                )}
                {userData.socialLinks.website && (
                  <Button variant="outline" size="icon" asChild>
                    <a href={userData.socialLinks.website} target="_blank" rel="noopener noreferrer">
                      <Globe className="h-4 w-4" />
                      <span className="sr-only">Website</span>
                    </a>
                  </Button>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{userData.email}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{userData.phone}</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="border-t pt-4">
            <div className="w-full flex justify-center gap-6 text-center">
              <div className="flex flex-col">
                <div className="flex items-center justify-center mb-1">
                  <Briefcase className="h-4 w-4 text-primary" />
                </div>
                <div className="text-xl font-bold">{userData.stats.jobsApplied}</div>
                <div className="text-xs text-muted-foreground">Applications</div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center justify-center mb-1">
                  <Bookmark className="h-4 w-4 text-primary" />
                </div>
                <div className="text-xl font-bold">{userData.stats.savedJobs}</div>
                <div className="text-xs text-muted-foreground">Saved Jobs</div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>

    <div className="space-y-6 md:flex md:flex-col md:justify-start">
      
      <Card className="bg-primary-foreground rounded-md">
          <CardHeader>
            <CardTitle className="text-lg">Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {userData.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="bg-primary text-white">
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
      </Card>

        {/* Right column - About, Education, Experience */}

        <Card className="bg-primary-foreground rounded-md">
          <CardHeader>
            <CardTitle className="text-lg">About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{userData.about}</p>
          </CardContent>
        </Card>

      </div>

    </div>
  )
}

