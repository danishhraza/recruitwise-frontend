import { useParams } from "react-router-dom";
import { Badge } from "../../../components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { useEffect } from "react";
import axios from "../../../api/axios";

export function JobDetails({job}) {

  return (
    <div className="space-y-6">
      <Card className="rounded-md bg-primary-foreground">
        <CardHeader>
          <CardTitle>Job Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="mb-1 text-sm font-medium text-muted-foreground">Location</h3>
              <p>{job.location}</p>
            </div>
            <div>
              <h3 className="mb-1 text-sm font-medium text-muted-foreground">Employment Type</h3>
              <p>{job.employmentType}</p>
            </div>
            <div>
              <h3 className="mb-1 text-sm font-medium text-muted-foreground">Experience Level</h3>
              <p>{job.experience}</p>
            </div>
            <div>
              <h3 className="mb-1 text-sm font-medium text-muted-foreground">Job Type</h3>
              <p>{job.jobType}</p>
            </div>
            <div>
              <h3 className="mb-1 text-sm font-medium text-muted-foreground">Salary Range</h3>
              <p>PKR{job.salary.toLocaleString()}</p>
            </div>
            <div>
              <h3 className="mb-1 text-sm font-medium text-muted-foreground">Status</h3>
              <Badge variant={job.isActive ? "default" : "secondary"}>{job.isActive ? "Active" : "Closed"}</Badge>
            </div>
            <div>
              <h3 className="mb-1 text-sm font-medium text-muted-foreground">Posted Date</h3>
              <p>{job.createdAt}</p>
            </div>
            <div>
              <h3 className="mb-1 text-sm font-medium text-muted-foreground">Application Deadline</h3>
              <p>{job.deadline}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-md bg-primary-foreground">
        <CardHeader>
          <CardTitle>Job Description</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none dark:prose-invert">
            <p>{job.description}</p>
          </div>
        </CardContent>
      </Card>
      <Card className="rounded-md bg-primary-foreground">
        <CardHeader>
          <CardTitle>Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none dark:prose-invert">
            <p>{job.requirements}</p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-md bg-primary-foreground">
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="prose max-w-none dark:prose-invert">
            <ul className="list-disc pl-5">
              {job?.skills?.map((requirement, index) => (
                <li key={index}>{requirement}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

