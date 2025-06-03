import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

export default function ApplicantProfilePage({ applicant, jobId, onBack }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    console.log("Selected applicant:", applicant)
  }, [applicant])

  if (!applicant) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-12">
        <h2 className="text-2xl font-bold">Applicant not found</h2>
        <p className="text-muted-foreground">
          The applicant profile you're looking for doesn't exist.
        </p>
        <Button onClick={onBack}>
          Back to Applicants
        </Button>
      </div>
    )
  }

  const handleViewResume = () => {
    if (applicant.ResumeUrl) {
      window.open(applicant.ResumeUrl, '_blank')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={onBack}>
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
              <path d="m15 18-6-6 6-6" />
            </svg>
            Back to Applicants
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{applicant.name}</h1>
            <p className="text-muted-foreground">{applicant.email}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {applicant.ResumeUrl && (
            <Button variant="outline" onClick={handleViewResume}>
              View Resume
            </Button>
          )}
          <Button>Schedule Interview</Button>
          <Button variant="outline">Send Message</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Applicant Information */}
        <Card>
          <CardHeader>
            <CardTitle>Applicant Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="mb-1 text-sm font-medium text-muted-foreground">Name</h3>
              <p className="text-base">{applicant.name}</p>
            </div>
            <div>
              <h3 className="mb-1 text-sm font-medium text-muted-foreground">Email</h3>
              <p className="text-base">{applicant.email}</p>
            </div>
            <div>
              <h3 className="mb-1 text-sm font-medium text-muted-foreground">Applied Date</h3>
              <p className="text-base">{applicant.formattedAppliedDate || applicant.appliedDate}</p>
            </div>
            <div>
              <h3 className="mb-1 text-sm font-medium text-muted-foreground">Interview Status</h3>
              <InterviewStatusBadge 
                status={applicant.mappedInterviewStatus || applicant.interviewStatus} 
              />
            </div>
            {applicant.skills && applicant.skills.length > 0 && (
              <div>
                <h3 className="mb-2 text-sm font-medium text-muted-foreground">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {applicant.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="rounded-md bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Overall Score */}
        {applicant.scores && (
          <Card>
            <CardHeader>
              <CardTitle>Assessment Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="mb-2">
                  <span
                    className={`text-4xl font-bold ${
                      applicant.scores.overallScore >= 8
                        ? "text-green-600 dark:text-green-400"
                        : applicant.scores.overallScore >= 6
                          ? "text-amber-600 dark:text-amber-400"
                          : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {applicant.scores.overallScore}
                  </span>
                  <span className="text-xl text-muted-foreground">/10</span>
                </div>
                <p className="text-sm text-muted-foreground">Overall Score</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Skill Scores */}
      {applicant.scores && applicant.scores.skillScores && applicant.scores.skillScores.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Skill Assessment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {applicant.scores.skillScores.map((skillScore, index) => (
                <div key={skillScore._id || index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{skillScore.skill}</h4>
                    <span
                      className={`font-semibold ${
                        skillScore.score >= 8
                          ? "text-green-600 dark:text-green-400"
                          : skillScore.score >= 6
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {skillScore.score}/10
                    </span>
                  </div>
                  {skillScore.remarks && (
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {skillScore.remarks}
                    </p>
                  )}
                  {index < applicant.scores.skillScores.length - 1 && (
                    <Separator className="mt-4" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Evaluation Summary */}
      {applicant.evaluationSummary && (
        <Card>
          <CardHeader>
            <CardTitle>Evaluation Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">
              {applicant.evaluationSummary}
            </p>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline">Update Interview Status</Button>
            <Button variant="outline">Schedule Follow-up</Button>
            <Button variant="outline">Add Notes</Button>
            <Button variant="outline">Send Feedback</Button>
            {applicant.ResumeUrl && (
              <Button variant="outline" onClick={handleViewResume}>
                Download Resume
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function InterviewStatusBadge({ status }) {
  const getVariant = () => {
    if (!status) return "secondary";
    
    switch (status.toLowerCase()) {
      case "pending":
        return "secondary"
      case "completed":
        return "primary"
      default:
        return "secondary"
    }
  }

  return (
    <Badge variant={getVariant()} className="capitalize">
      {status || "Not Scheduled"}
    </Badge>
  )
}