import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Check, Upload, File, X } from 'lucide-react';

const JobApplicationDrawer = ({ isOpen, onClose, job }) => {
  const [coverLetterOption, setCoverLetterOption] = useState("write");
  const [resumeOption, setResumeOption] = useState("upload");
  const [uploadedCV, setUploadedCV] = useState(null);
  
  // Mock existing CVs for demonstration
  const existingCVs = [
    { id: 1, name: "Professional_Resume_2024.pdf", date: "2024-03-15" },
    { id: 2, name: "Technical_CV_Developer.pdf", date: "2024-02-20" },
  ];

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      coverLetter: "",
      resumeId: "",
    },
  });

  const onSubmit = (data) => {
    // Include the file or selected resume reference
    const formData = {
      ...data,
      jobId: job?.id,
      jobTitle: job?.title,
      uploadedCV: resumeOption === "upload" ? uploadedCV : null,
      useExistingCV: resumeOption === "existing" ? data.resumeId : null,
    };
    
    console.log("Form submitted:", formData);
    onClose();
    // Here you would typically send the data to your API
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadedCV(file);
    }
  };

  const removeFile = () => {
    setUploadedCV(null);
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md md:max-w-lg overflow-y-auto">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="text-xl font-bold">Apply for: {job?.title}</SheetTitle>
          <SheetDescription>
            Complete the application form to apply for this position at {job?.company}
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-4 overflow-y-auto">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                rules={{ required: "Name is required" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                rules={{ 
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="youremail@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="space-y-3">
                <h3 className="text-lg font-medium">Cover Letter</h3>
                <RadioGroup 
                  defaultValue="write" 
                  value={coverLetterOption}
                  onValueChange={setCoverLetterOption}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="write" id="write-letter" />
                    <Label htmlFor="write-letter">Write a Cover Letter</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="upload" id="upload-letter" />
                    <Label htmlFor="upload-letter">Upload a Cover Letter</Label>
                  </div>
                </RadioGroup>
                
                {coverLetterOption === "write" ? (
                  <FormField
                    control={form.control}
                    name="coverLetter"
                    rules={{ required: "Cover letter is required" }}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea 
                            placeholder="Write your cover letter here..." 
                            className="min-h-[200px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ) : (
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Upload className="h-8 w-8 text-gray-400" />
                      <p className="text-sm text-gray-500">
                        Drag and drop your cover letter, or click to browse
                      </p>
                      <Input 
                        type="file" 
                        accept=".pdf,.doc,.docx" 
                        className="hidden" 
                        id="cover-letter-upload"
                      />
                      <label htmlFor="cover-letter-upload">
                        <Button type="button" variant="outline" size="sm">
                          Select File
                        </Button>
                      </label>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                <h3 className="text-lg font-medium">Resume / CV</h3>
                <RadioGroup 
                  defaultValue="upload" 
                  value={resumeOption}
                  onValueChange={setResumeOption}
                  className="flex flex-col space-y-1"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="upload" id="upload-resume" />
                    <Label htmlFor="upload-resume">Upload a new Resume/CV</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="existing" id="existing-resume" />
                    <Label htmlFor="existing-resume">Select from existing Resumes/CVs</Label>
                  </div>
                </RadioGroup>
                
                {resumeOption === "upload" ? (
                  <div>
                    {!uploadedCV ? (
                      <div className="border-2 border-dashed rounded-lg p-6 text-center">
                        <div className="flex flex-col items-center justify-center space-y-2">
                          <Upload className="h-8 w-8 text-gray-400" />
                          <p className="text-sm text-gray-500">
                            Drag and drop your resume, or click to browse
                          </p>
                          <Input 
                            type="file" 
                            accept=".pdf,.doc,.docx" 
                            className="hidden" 
                            id="resume-upload"
                            onChange={handleFileUpload}
                          />
                          <label htmlFor="resume-upload">
                            <Button type="button" variant="outline" size="sm">
                              Select File
                            </Button>
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <File className="h-5 w-5 text-blue-500" />
                            <span className="text-sm font-medium">{uploadedCV.name}</span>
                          </div>
                          <Button 
                            type="button" 
                            variant="ghost" 
                            size="sm" 
                            onClick={removeFile}
                            className="h-8 w-8 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <FormField
                    control={form.control}
                    name="resumeId"
                    rules={{ required: "Please select a resume" }}
                    render={({ field }) => (
                      <FormItem>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a resume" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {existingCVs.map(cv => (
                              <SelectItem key={cv.id} value={cv.id.toString()}>
                                <div className="flex items-center space-x-2">
                                  <File className="h-4 w-4" />
                                  <span>{cv.name}</span>
                                  <span className="text-xs text-gray-500">
                                    (Uploaded: {cv.date})
                                  </span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
              
              <SheetFooter className="mt-6 flex justify-between gap-4">
                <SheetClose asChild>
                  <Button variant="outline" className="flex-1">Cancel</Button>
                </SheetClose>
                <Button type="submit" className="flex-1">Submit Application</Button>
              </SheetFooter>
            </form>
          </Form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default JobApplicationDrawer;