import { useEffect, useState } from "react"
import { Search } from "lucide-react"

import { Badge } from "../../../components/ui/badge"
import { Input } from "../../../components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { Card } from "../../../components/ui/card"
import axios from "../../../api/axios"

export function UserApplications() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [companyNames, setCompanyNames] = useState({}) // Store company names by ID

  // Format the date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Fetch company details by ID
  const fetchCompanyDetails = async (companyId) => {
    try {
      const response = await axios.get(`/company/${companyId}`, { withCredentials: true });
      if (response.data && response.data.name) {
        setCompanyNames(prev => ({
          ...prev,
          [companyId]: response.data.name
        }));
      }
    } catch (error) {
      console.error(`Error fetching company details for ID ${companyId}:`, error);
      // Set a placeholder in case of error
      setCompanyNames(prev => ({
        ...prev,
        [companyId]: 'Unknown Company'
      }));
    }
  };

  // Fetch applications from the API
  async function fetchApplications() {
    try {
      setLoading(true);
      const response = await axios.get('/jobs/me', { withCredentials: true })
      console.log("Fetched applications:", response.data)
      setApplications(response.data);
      
      // Fetch company details for each unique company ID
      const uniqueCompanyIds = [...new Set(
        response.data
          .map(app => app.job.company)
          .filter(id => id && typeof id === 'string')
      )];
      
      // Fetch company details for each unique company ID
      uniqueCompanyIds.forEach(companyId => {
        fetchCompanyDetails(companyId);
      });
      
      setError(null)
    } catch (error) {
      console.error("Error fetching applications:", error)
      setError("Failed to load applications. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  // Get company name for a job
  const getCompanyName = (job) => {
    if (job.company && companyNames[job.company]) {
      return companyNames[job.company];
    }
    return job.location || 'Unknown Company';
  };

  // Filter applications based on search query and status filter
  const filteredApplications = applications.filter((application) => {
    const companyName = getCompanyName(application.job);
    
    const matchesSearch =
      application.job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      companyName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || application.status === statusFilter;

    return matchesSearch && matchesStatus;
  });
  
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
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="reviewed">Reviewed</SelectItem>
              <SelectItem value="shortlisted">Shortlisted</SelectItem>
              <SelectItem value="interviewed">Interviewed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="hired">Hired</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {loading ? (
        <Card className="flex flex-col items-center justify-center p-8 text-center">
          <p>Loading applications...</p>
        </Card>
      ) : error ? (
        <Card className="flex flex-col items-center justify-center p-8 text-center">
          <p className="text-red-500">{error}</p>
        </Card>
      ) : filteredApplications.length === 0 ? (
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredApplications.map((application) => {
                const companyName = getCompanyName(application.job);
                
                return (
                  <TableRow key={application._id}>
                    <TableCell>
                      <div className="font-medium">{application.job.title}</div>
                      <div className="text-sm text-muted-foreground md:hidden">{companyName}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{companyName}</TableCell>
                    <TableCell className="hidden md:table-cell">{formatDate(application.createdAt)}</TableCell>
                    <TableCell>
                      <ApplicationStatusBadge status={application.status} />
                    </TableCell>
                  </TableRow>
                );
              })}
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
      case "pending":
        return "secondary"
      case "reviewed":
        return "default"
      case "shortlisted":
        return "primary"
      case "interviewed":
        return "success"
      case "rejected":
        return "destructive"
      case "hired":
        return "success"
      default:
        return "secondary"
    }
  }

  const getLabel = () => {
    // Capitalize first letter
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  return (
    <Badge variant={getVariant()} className="capitalize">
      {getLabel()}
    </Badge>
  )
}