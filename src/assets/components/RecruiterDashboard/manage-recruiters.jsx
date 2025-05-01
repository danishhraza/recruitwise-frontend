import { useState, useEffect } from "react"
import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"
import useGeneral from "../../../hooks/useGeneral";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../../components/ui/alert-dialog"
import { Label } from "../../../components/ui/label"
import { Separator } from "../../../components/ui/separator"
import axios from "../../../api/axios";
import { toast } from "sonner";

// This would typically come from your API
const MOCK_RECRUITERS = [
  { id: 1, email: "john.doe@recruitwise.com", name: "John Doe", role: "recruiter" },
  { id: 2, email: "jane.smith@recruitwise.com", name: "Jane Smith", role: "admin" },
  { id: 3, email: "alex.johnson@recruitwise.com", name: "Alex Johnson", role: "recruiter" },
]

export default function ManageRecruiters() {
  const [recruiters, setRecruiters] = useState([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [newRecruiterEmail, setNewRecruiterEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loadingCompany, setLoadingCompany] = useState(false)
  const [company, setCompany] = useState(null)
  const {isLoggedIn, user, setIsLoggedIn, setUser} = useGeneral();

  const companyId = user?.company?.id || null

  // Fetch company data
  const fetchCompanyData = async () => {
    if (!companyId) {
      console.log("No company ID available");
      return;
    }
    
    setLoadingCompany(true);
    try {
      console.log("Fetching company data for ID:", companyId);
      const response = await axios.get(`/company/${companyId}`);
      console.log("Company data fetched:", response.data);
      setCompany(response.data);
      setRecruiters(response.data.whitelistedRecruiters || []); // Assuming the API returns recruiters in the company data
    } catch (error) {
      console.error("Error fetching company data:", error);
      toast("error");
    } finally {
      setLoadingCompany(false);
    }
  };


    useEffect(() => {
      
        fetchCompanyData();
      }, []);

      const handleAddRecruiter = async (e) => {
        e.preventDefault();
        setIsLoading(true);
      
        try {
          console.log("Adding recruiter with email:", newRecruiterEmail);
          
          // Use axios instead of api
          const response = await axios.post('/recruiter/whitelist-recruiter', { 
            email: newRecruiterEmail 
          });
          
          console.log("Whitelist response:", response.data);
          
          // Reset form state
          setNewRecruiterEmail("");
          setIsAddDialogOpen(false);
          
          // Refresh the data to get the latest list from the server
          await fetchCompanyData();
          
          toast.success("Recruiter added successfully");
        } catch (error) {
          console.error("Error adding recruiter:", error);
          toast.error("Error adding recruiter. Please try again.");
        } finally {
          setIsLoading(false);
        }
      }

  const handleDeleteRecruiter = async (email) => {
    try {
      console.log("Removing recruiter with email:", email);
      
      // Make the API call to remove a recruiter
      await axios.delete('/recruiter/remove-recruiter', {
        data: { email: email }
      });
      
      // Refresh the data to get the updated list
      await fetchCompanyData();
      
      toast.success("Recruiter removed successfully");
    } catch (error) {
      console.error("Error removing recruiter:", error);
      toast.error("Error removing recruiter. Please try again.");
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Recruiters</h1>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Recruiter</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Recruiter</DialogTitle>
              <DialogDescription>
                Enter the email address of the person you want to invite as a recruiter.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddRecruiter}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={newRecruiterEmail}
                    onChange={(e) => setNewRecruiterEmail(e.target.value)}
                    className="col-span-3"
                    placeholder="email@example.com"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Adding..." : "Add Recruiter"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recruiters</CardTitle>
          <CardDescription>
            Manage your organization's recruiters and their access permissions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recruiters.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              No recruiters found. Add your first recruiter to get started.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recruiters.map((recruiter) => (
                  <TableRow key={recruiter.id}>
                    <TableCell className="font-medium">{recruiter.name}</TableCell>
                    <TableCell>{recruiter.email}</TableCell>
                    <TableCell className="capitalize">{recruiter.role}</TableCell>
                    <TableCell className="text-right">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                            Remove
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently remove the
                              recruiter from your organization and revoke their access.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteRecruiter(recruiter.email)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-6">
          <div className="text-sm text-muted-foreground">
            Total recruiters: {recruiters.length}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}