import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function ApplicantList({ applicants, jobId, onApplicantSelect }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [interviewFilter, setInterviewFilter] = useState("all")

  useEffect(() => {
    console.log("Applicants:", applicants)
  }, [applicants])

  const filteredApplicants = applicants.filter((applicant) => {
    const matchesSearch =
      applicant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (applicant.email && applicant.email.toLowerCase().includes(searchQuery.toLowerCase()))

    // Use the mapped interview status for filtering
    const interviewStatusToCheck = applicant.mappedInterviewStatus || applicant.interviewStatus
    const matchesInterviewStatus = interviewFilter === "all" || 
      interviewStatusToCheck?.toLowerCase() === interviewFilter.toLowerCase()

    return matchesSearch && matchesInterviewStatus
  })

  const handleApplicantClick = (applicant) => {
    // Call the callback function instead of navigating
    onApplicantSelect(applicant)
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
          <Select value={interviewFilter} onValueChange={setInterviewFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by interview status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Interviews</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
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
              <TableHead>Interview Status</TableHead>
              <TableHead className="hidden md:table-cell">Applied Date</TableHead>
              <TableHead>Score</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplicants.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No applicants found.
                </TableCell>
              </TableRow>
            ) : (
              filteredApplicants.map((applicant) => (
                <TableRow
                  key={applicant.id}
                  className="cursor-pointer hover:bg-accent/50"
                  onClick={() => handleApplicantClick(applicant)}
                >
                  <TableCell>
                    <div>
                      <div className="font-medium">{applicant.name}</div>
                      <div className="text-sm text-muted-foreground">{applicant.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <InterviewStatusBadge 
                      status={applicant.mappedInterviewStatus || applicant.interviewStatus} 
                    />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {applicant.formattedAppliedDate || applicant.appliedDate}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span
                        className={`mr-2 font-medium ${
                          applicant.scores?.overallScore >= 8
                            ? "text-green-600 dark:text-green-400"
                            : applicant.scores?.overallScore >= 6
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-red-600 dark:text-red-400"
                        }`}
                      >
                        {applicant.scores?.overallScore || 'N/A'}
                      </span>
                      <span className="text-xs text-muted-foreground">/10</span>
                    </div>
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