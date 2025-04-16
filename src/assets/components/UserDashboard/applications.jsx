import { useState } from "react"
import { Search } from "lucide-react"

import { Badge } from "../../../components/ui/badge"
import { Button } from "../../../components/ui/button"
import { Card } from "../../../components/ui/card"
import { Input } from "../../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { getUserApplications } from "../../../lib/user-data"

export function UserApplications() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const applications = getUserApplications()

  const filteredApplications = applications.filter((application) => {
    const matchesSearch =
      application.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      application.company.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = statusFilter === "all" || application.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="flex flex-1 items-center space-x-2">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search applications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="applied">Applied</SelectItem>
              <SelectItem value="interview-pending">Interview Pending</SelectItem>
              <SelectItem value="interview-completed">Interview Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredApplications.length === 0 ? (
        <Card className="flex flex-col items-center justify-center p-8 text-center">
          <h3 className="mb-2 text-xl font-medium">No applications found</h3>
          <p className="text-muted-foreground">
            {searchQuery || statusFilter !== "all"
              ? "No applications match your search criteria."
              : "You haven't applied to any jobs yet."}
          </p>
        </Card>
      ) : (
        <div className="rounded-md border">
          <Table className="bg-primary-foreground text-foreground">
            <TableHeader>
              <TableRow>
                <TableHead>Job</TableHead>
                <TableHead>Company</TableHead>
                <TableHead className="hidden md:table-cell">Applied Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell>
                    <div className="font-medium">{application.jobTitle}</div>
                    <div className="text-sm text-muted-foreground md:hidden">{application.company}</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{application.company}</TableCell>
                  <TableCell className="hidden md:table-cell">{application.appliedDate}</TableCell>
                  <TableCell>
                    <ApplicationStatusBadge status={application.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}

function ApplicationStatusBadge({ status }) {
  const getVariant = () => {
    switch (status) {
      case "applied":
        return "secondary"
      case "interview-pending":
        return "primary"
      case "intervie-completed":
        return "default"
      default:
        return "secondary"
    }
  }

  const getLabel = () => {
    switch (status) {
      case "applied":
        return "Applied"
      case "interview-pending":
        return "Interview Pending"
      case "interview-completed":
        return "Interview Completed"
      default:
        return status
    }
  }

  return (
    <Badge variant={getVariant()} className="capitalize">
      {getLabel()}
    </Badge>
  )
}

