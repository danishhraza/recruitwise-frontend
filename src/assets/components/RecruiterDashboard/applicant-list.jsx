import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Badge } from "../../../components/ui/badge"
import { Button } from "../../../components/ui/button"
import { Card } from "../../../components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../components/ui/dropdown-menu"
import { Input } from "../../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { getAllApplicants } from "../../../lib/applicant-data"

export function ApplicantList({ applicants: propApplicants }) {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Use either provided applicants or fetch all applicants
  const applicants = propApplicants || getAllApplicants()

  const filteredApplicants = applicants.filter((applicant) => {
    const matchesSearch =
      applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (applicant.email && applicant.email.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus = statusFilter === "all" || applicant.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleApplicantClick = (applicantId) => {
    navigate(`/applicants/${applicantId}`)
  }

  if (applicants.length === 0) {
    return (
      <Card className="flex flex-col items-center justify-center p-8 text-center">
        <h3 className="mb-2 text-xl font-medium">No applicants yet</h3>
        <p className="text-muted-foreground">There are no applicants for this job posting yet.</p>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex flex-1 items-center space-x-2">
          <Input
            placeholder="Search applicants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="screening">Screening</SelectItem>
              <SelectItem value="interview">Interview</SelectItem>
              <SelectItem value="assessment">Assessment</SelectItem>
              <SelectItem value="hired">Hired</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button>Export to CSV</Button>
      </div>

      <div className="rounded-md border bg-primary-foreground">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Applied Date</TableHead>
              <TableHead className="hidden md:table-cell">Interview</TableHead>
              <TableHead>Score</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplicants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No applicants found.
                </TableCell>
              </TableRow>
            ) : (
              filteredApplicants.map((applicant) => (
                <TableRow
                  key={applicant.id}
                  className="cursor-pointer hover:bg-accent/50"
                  onClick={() => handleApplicantClick(applicant.id)}
                >
                  <TableCell>
                    <div>
                      <div className="font-medium">{applicant.name}</div>
                      <div className="text-sm text-muted-foreground">{applicant.role}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <ApplicantStatusBadge status={applicant.status} />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{applicant.appliedDate}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge
                      variant={
                        applicant.interviewStatus === "completed"
                          ? "success"
                          : applicant.interviewStatus === "scheduled"
                            ? "outline"
                            : "secondary"
                      }
                      className="capitalize"
                    >
                      {applicant.interviewStatus || "Not scheduled"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span
                        className={`mr-2 font-medium ${
                          applicant.score >= 8
                            ? "text-green-600 dark:text-green-400"
                            : applicant.score >= 6
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {applicant.score}
                      </span>
                      <span className="text-xs text-muted-foreground">/10</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm">
                          <span className="sr-only">Open menu</span>
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
                            <circle cx="12" cy="12" r="1" />
                            <circle cx="12" cy="5" r="1" />
                            <circle cx="12" cy="19" r="1" />
                          </svg>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation()
                            handleApplicantClick(applicant.id)
                          }}
                        >
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>Schedule Interview</DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>Send Email</DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => e.stopPropagation()}>Update Status</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function ApplicantStatusBadge({ status }) {
  const getVariant = () => {
    switch (status.toLowerCase()) {
      case "pending":
        return "secondary"
      case "screening":
        return "outline"
      case "interview":
        return "default"
      case "assessment":
        return "default"
      case "hired":
        return "success"
      case "rejected":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <Badge variant={getVariant()} className="capitalize">
      {status}
    </Badge>
  )
}

