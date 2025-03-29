import { Github, Linkedin, Twitter, Globe, Mail, MapPin, Phone, Calendar, Briefcase, Bookmark } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card"
import { Badge } from "../../../components/ui/badge"
import { getUserData } from "../../../lib/user-data"

export function UserProfile() {
  const userData = getUserData()

  return (
    <div className="grid gap-6 md:grid-cols-12">
      {/* Left column - Profile card */}
      <div className="md:col-span-4 space-y-6">
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
          <CardFooter className="flex justify-between border-t pt-4">
            <div className="grid grid-cols-3 w-full gap-2 text-center">
              <div className="flex flex-col">
                <div className="flex items-center justify-center mb-1">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <div className="text-xl font-bold">{userData.stats.upcomingAssessments}</div>
                <div className="text-xs text-muted-foreground">Assessments</div>
              </div>
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
      </div>

      {/* Right column - About, Education, Experience */}
      <div className="md:col-span-8 space-y-6">
        <Card className="bg-primary-foreground rounded-md">
          <CardHeader>
            <CardTitle className="text-lg">About</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{userData.about}</p>
          </CardContent>
        </Card>

        <Card className="bg-primary-foreground rounded-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Education</CardTitle>
            <Button variant="ghost" size="sm">
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
                className="mr-1 h-4 w-4"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
              Add
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userData.education.map((edu, index) => (
                <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-medium">{edu.degree}</h4>
                      <p className="text-sm">{edu.institution}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {edu.startDate} - {edu.endDate || "Present"}
                    </div>
                  </div>
                  {edu.description && <p className="mt-2 text-sm text-muted-foreground">{edu.description}</p>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary-foreground rounded-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Experience</CardTitle>
            <Button variant="ghost" size="sm">
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
                className="mr-1 h-4 w-4"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
              Add
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {userData.experience.map((exp, index) => (
                <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-medium">{exp.title}</h4>
                      <p className="text-sm">{exp.company}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {exp.startDate} - {exp.endDate || "Present"}
                    </div>
                  </div>
                  {exp.description && <p className="mt-2 text-sm text-muted-foreground">{exp.description}</p>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

