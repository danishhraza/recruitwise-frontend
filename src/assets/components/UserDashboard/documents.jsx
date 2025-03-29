import { useState } from "react"
import { File, FileText, Plus, Trash, Edit, Download } from "lucide-react"

import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Textarea } from "../../../components/ui/textarea"
import { getUserDocuments } from "../../../lib/user-data"

export function UserDocuments() {
  const [activeTab, setActiveTab] = useState("resumes")
  const { resumes, coverLetters } = getUserDocuments()

  return (
    <Tabs defaultValue="resumes" className="w-full" onValueChange={setActiveTab}>
      <div className="flex items-center justify-between mb-4">
        <TabsList>
          <TabsTrigger value="resumes">Resumes</TabsTrigger>
          <TabsTrigger value="coverLetters">Cover Letters</TabsTrigger>
        </TabsList>

        <AddDocumentDialog type={activeTab} />
      </div>

      <TabsContent value="resumes" className="mt-0">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {resumes.length === 0 ? (
            <EmptyState type="resume" />
          ) : (
            resumes.map((resume) => (
              <DocumentCard
                key={resume.id}
                document={resume}
                icon={<File className="h-8 w-8 text-primary" />}
                type="resume"
              />
            ))
          )}
        </div>
      </TabsContent>

      <TabsContent value="coverLetters" className="mt-0">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {coverLetters.length === 0 ? (
            <EmptyState type="cover letter" />
          ) : (
            coverLetters.map((letter) => (
              <DocumentCard
                key={letter.id}
                document={letter}
                icon={<FileText className="h-8 w-8 text-primary" />}
                type="cover letter"
              />
            ))
          )}
        </div>
      </TabsContent>
    </Tabs>
  )
}

function DocumentCard({ document, icon, type }) {
  return (
    <Card className="rounded-lg bg-primary-foreground">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            {icon}
            <div>
              <CardTitle className="text-lg">{document.name}</CardTitle>
              <CardDescription>Last updated: {document.updatedAt}</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground line-clamp-3">{document.description}</p>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Edit className="mr-1 h-4 w-4" />
            Edit
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-1 h-4 w-4" />
            Download
          </Button>
        </div>
        <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
          <Trash className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}

function EmptyState({ type }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
      <div className="rounded-full bg-primary/10 p-3 mb-4">
        {type === "resume" ? <File className="h-6 w-6 text-primary" /> : <FileText className="h-6 w-6 text-primary" />}
      </div>
      <h3 className="mb-2 text-xl font-medium">No {type}s found</h3>
      <p className="mb-6 text-muted-foreground max-w-md">
        {type === "resume"
          ? "Upload or create a resume to apply for jobs more efficiently."
          : "Create cover letters to personalize your job applications."}
      </p>
      <AddDocumentDialog type={type === "resume" ? "resumes" : "coverLetters"}>
        <Button>
          <Plus className="mr-1 h-4 w-4" />
          Add {type}
        </Button>
      </AddDocumentDialog>
    </div>
  )
}

function AddDocumentDialog({ children, type }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <Button>
            <Plus className="mr-1 h-4 w-4" />
            Add {type === "resumes" ? "Resume" : "Cover Letter"}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add {type === "resumes" ? "Resume" : "Cover Letter"}</DialogTitle>
          <DialogDescription>
            {type === "resumes"
              ? "Upload a new resume or create one from scratch."
              : "Create a new cover letter for your job applications."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder={`${type === "resumes" ? "Resume" : "Cover Letter"} name`} />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Brief description of this document" className="min-h-[100px]" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="file">Upload File (Optional)</Label>
            <Input id="file" type="file" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

