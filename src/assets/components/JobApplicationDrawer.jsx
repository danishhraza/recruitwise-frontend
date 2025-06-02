import React, { useState, useEffect } from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check, Upload, File, X, Loader } from 'lucide-react';
import { toast } from 'sonner';
import axios from '../../api/axios';

const JobApplicationDrawer = ({ isOpen, onClose, job }) => {
  const [uploadedCV, setUploadedCV] = useState(null);
  const [resumeUrl, setResumeUrl] = useState("");
  const [existingResumeUrl, setExistingResumeUrl] = useState("");
  const [existingResumeFileName, setExistingResumeFileName] = useState("");
  const [resumeOption, setResumeOption] = useState("existing"); // "existing" or "upload"
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingExistingResume, setIsLoadingExistingResume] = useState(false);

  // Function to extract filename from URL
  const getFileNameFromUrl = (url) => {
    try {
      const urlParts = url.split('/');
      const fileName = urlParts[urlParts.length - 1];
      // Remove any query parameters
      return fileName.split('?')[0];
    } catch (error) {
      return 'Resume.pdf';
    }
  };

  // Function to fetch user's existing resume
  const fetchExistingResume = async () => {
    setIsLoadingExistingResume(true);
    try {
      const response = await axios.get('/auth/me', {
        withCredentials: true,
      });
      
      if (response.data.ResumeUrl) {
        setExistingResumeUrl(response.data.ResumeUrl);
        setExistingResumeFileName(getFileNameFromUrl(response.data.ResumeUrl));
        setResumeUrl(response.data.ResumeUrl); // Set this as the default resume URL
      } else {
        // If no existing resume, default to upload option
        setResumeOption("upload");
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load existing resume');
      setResumeOption("upload");
    } finally {
      setIsLoadingExistingResume(false);
    }
  };

  // Fetch existing resume when component mounts or when drawer opens
  useEffect(() => {
    if (isOpen) {
      fetchExistingResume();
    }
  }, [isOpen]);

  // Update resumeUrl based on selected option
  useEffect(() => {
    if (resumeOption === "existing") {
      setResumeUrl(existingResumeUrl);
    } else if (resumeOption === "upload") {
      setResumeUrl(""); // Clear resume URL when switching to upload
    }
  }, [resumeOption, existingResumeUrl]);

  // Reset state when drawer closes
  useEffect(() => {
    if (!isOpen) {
      setUploadedCV(null);
      setResumeUrl("");
      setExistingResumeUrl("");
      setExistingResumeFileName("");
      setResumeOption("existing");
      setIsUploading(false);
      setIsSubmitting(false);
      setIsLoadingExistingResume(false);
    }
  }, [isOpen]);
  
  // Function to upload resume to S3
  const uploadResumeToS3 = async (file) => {
    if (!file) return null;
    
    setIsUploading(true);
    
    try {
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('file', file);
      
      // Send the file to the S3 upload endpoint
      const response = await axios.post('/s3/upload-resume', formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Get the S3 URL from the response
      const s3Url = response.data.url;
      setResumeUrl(s3Url);
      
      toast.success('Resume uploaded successfully');
      return s3Url;
    } catch (error) {
      console.error('Error uploading resume:', error);
      toast.error('Failed to upload resume');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!resumeUrl) {
      toast.error('Please select or upload a resume');
      return;
    }
    console.log("job", job)
    if (!job?._id) {
      toast.error('Job information is missing');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Prepare the data for submission
      const applicationData = {
        resumeUrl: resumeUrl,
      };
      
      // Submit the application to the correct endpoint with jobId in the URL
      const response = await axios.post(
        `/jobs/${job._id}/apply`, 
        applicationData, 
        { withCredentials: true }
      );
      
      console.log("Application submitted:", response.data);
      toast.success('Application submitted successfully');
      onClose();
    } catch (error) {
      console.error('Error submitting application:', error);
      
      if (error.response?.status === 400 && error.response?.data?.message === 'User has already applied for this job') {
        toast.error('You have already applied for this job');
      } else {
        toast.error('Failed to submit application');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      const fileType = file.type;
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      
      if (!validTypes.includes(fileType)) {
        toast.error('Please upload a PDF or Word document (.pdf, .doc, .docx)');
        return;
      }
      
      // Check file size (optional, limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size exceeds 5MB limit');
        return;
      }
      
      setUploadedCV(file);
      // Automatically upload the file to S3 when selected
      await uploadResumeToS3(file);
    }
  };

  const removeFile = () => {
    setUploadedCV(null);
    setResumeUrl(""); // Clear the S3 URL when removing the file
  };

  const handleResumeOptionChange = (option) => {
    setResumeOption(option);
    if (option === "upload") {
      // Clear uploaded file when switching to upload option
      setUploadedCV(null);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-full sm:max-w-md md:max-w-lg overflow-y-auto">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="text-xl font-bold">Apply for: {job?.title}</SheetTitle>
          <SheetDescription>
            Select your resume to apply for this position at {job?.company}
          </SheetDescription>
        </SheetHeader>
        
        <div className="py-4 overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Resume / CV</h3>
              
              {isLoadingExistingResume ? (
                <div className="flex items-center justify-center py-8">
                  <Loader className="h-6 w-6 animate-spin mr-2" />
                  <span>Loading your resume...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Radio button options */}
                  <div className="space-y-3">
                    {/* Existing Resume Option - Always show this option */}
                    <div className="flex items-start space-x-3">
                      <input
                        type="radio"
                        id="existing-resume"
                        name="resume-option"
                        value="existing"
                        checked={resumeOption === "existing"}
                        onChange={() => handleResumeOptionChange("existing")}
                        className="mt-1"
                        disabled={!existingResumeUrl}
                      />
                      <div className="flex-1">
                        <Label htmlFor="existing-resume" className={`cursor-pointer ${!existingResumeUrl ? 'opacity-50' : ''}`}>
                          <div className="font-medium">Use existing resume</div>
                          {existingResumeUrl ? (
                            <div className={`border rounded-lg p-3 mt-2 transition-colors ${
                              resumeOption === "existing" 
                                ? 'bg-slate-700 text-white border-slate-600' 
                                : 'bg-gray-50 hover:bg-gray-100'
                            }`}>
                              <div className="flex items-center space-x-2" onClick={() => window.open(existingResumeUrl, '_blank')}>
                                <File className={`h-5 w-5 ${
                                  resumeOption === "existing" ? 'text-blue-400' : 'text-blue-500'
                                }`} />
                                <span className="text-sm font-medium">{existingResumeFileName}</span>
                                <div className={`flex items-center ${
                                  resumeOption === "existing" ? 'text-green-400' : 'text-green-500'
                                }`}>
                                  <Check className="h-4 w-4 mr-1" />
                                  <span className="text-xs">Available</span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-sm text-gray-500 mt-1">
                              No existing resume found
                            </div>
                          )}
                        </Label>
                      </div>
                    </div>
                    
                    {/* Upload New Resume Option */}
                    <div className="flex items-start space-x-3">
                      <input
                        type="radio"
                        id="upload-resume"
                        name="resume-option"
                        value="upload"
                        checked={resumeOption === "upload"}
                        onChange={() => handleResumeOptionChange("upload")}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <Label htmlFor="upload-resume" className="cursor-pointer">
                          <div className="font-medium">Upload new resume</div>
                          {resumeOption === "upload" && (
                            <div className="mt-2">
                              {!uploadedCV ? (
                                <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer" 
                                  onClick={() => document.getElementById('resume-upload').click()}>
                                  <div className="flex flex-col items-center justify-center space-y-2">
                                    <Upload className="h-8 w-8 text-gray-400" />
                                    <p className="text-sm text-gray-500">
                                      Drag and drop your resume, or click to browse
                                    </p>
                                    <p className="text-xs text-gray-400">
                                      Accepted formats: .pdf, .doc, .docx
                                    </p>
                                    <Input 
                                      type="file" 
                                      accept=".pdf,.doc,.docx" 
                                      className="hidden" 
                                      id="resume-upload"
                                      onChange={handleFileUpload}
                                    />
                                    <Button 
                                      type="button" 
                                      variant="outline" 
                                      size="sm" 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        document.getElementById('resume-upload').click();
                                      }}
                                    >
                                      Select File
                                    </Button>
                                  </div>
                                </div>
                              ) : (
                                <div className="border rounded-lg p-4">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                      <File className="h-5 w-5 text-blue-500" />
                                      <span className="text-sm font-medium">{uploadedCV.name}</span>
                                      {isUploading ? (
                                        <div className="flex items-center text-blue-500">
                                          <Loader className="h-4 w-4 animate-spin mr-1" />
                                          <span className="text-xs">Uploading...</span>
                                        </div>
                                      ) : resumeUrl ? (
                                        <div className="flex items-center text-green-500">
                                          <Check className="h-4 w-4 mr-1" />
                                          <span className="text-xs">Uploaded</span>
                                        </div>
                                      ) : null}
                                    </div>
                                    <Button 
                                      type="button" 
                                      variant="ghost" 
                                      size="sm" 
                                      onClick={removeFile}
                                      className="h-8 w-8 p-0"
                                      disabled={isUploading}
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <SheetFooter className="mt-6 flex justify-between gap-4">
              <SheetClose asChild>
                <Button type="button" variant="outline" className="flex-1">Cancel</Button>
              </SheetClose>
              <Button 
                type="submit" 
                className="flex-1"
                disabled={isUploading || isSubmitting || !resumeUrl || isLoadingExistingResume}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  isUploading ? (
                    <>
                      <Loader className="h-4 w-4 animate-spin mr-2" />
                      Uploading...
                    </>
                  ) : "Submit Application"
                )}
              </Button>
            </SheetFooter>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default JobApplicationDrawer;