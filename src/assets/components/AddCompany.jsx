import React, { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, ImagePlus } from 'lucide-react';
import { toast } from "sonner";
import axios from '../../api/axios'
import { useNavigate } from 'react-router-dom';

const AddCompanyPage = () => {
  const navigate = useNavigate()
  async function fetchData() {
    try {
      const response = await axios.get('/auth/me',{withCredentials:true});
      let role = response.data.role
      if (role !== "admin") {
        toast.error("Unauthorized", {
          description: "You are not authorized to access this page.",
        });
        navigate("/")
      } 
    } catch (error) {
      console.error('Error fetching data:', error);
      navigate("/")
  }
  }
  useEffect(() => { 
  fetchData()

  },[])
  const [companyData, setCompanyData] = useState({
    name: '',
    domain: '',
    location: '',
    website: '',
  });
  const [companyLogo, setCompanyLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCompanyData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setCompanyLogo(file);
      
      // Create a preview of the uploaded image
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create form data to send file and other details
    const formData = new FormData();
    
    // Append company details
    Object.entries(companyData).forEach(([key, value]) => {
      formData.append(key, value);
    });

    // Append logo file
    if (companyLogo) {
      formData.append('file', companyLogo);
    }

    try {
      const response = await axios.post('/company/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success("Company Added Successfully", {
        description: `Company ${response.data.name} has been created.`,
      });

      // Reset form after successful submission
      setCompanyData({
        name: '',
        domain: '',
        location: '',
        website: '',
      });
      setCompanyLogo(null);
      setLogoPreview(null);

    } catch (error) {
      toast.error("Error", {
        description: error.response?.data?.message || "Failed to create company. Please try again.",
      });
      console.error('Company creation error:', error);
    }
  };

  return (
    <div className="px-4 py-8 h-screen flex justify-center items-center">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Add New Company</CardTitle>
          <CardDescription>Enter company details and upload logo</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">Company Name</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={companyData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter company name"
              />
            </div>

            <div>
              <Label htmlFor="domain">Company Domain</Label>
              <Input
                type="text"
                id="domain"
                name="domain"
                value={companyData.domain}
                onChange={handleInputChange}
                required
                placeholder="Enter company domain"
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                type="text"
                id="location"
                name="location"
                value={companyData.location}
                onChange={handleInputChange}
                required
                placeholder="Enter company location"
              />
            </div>

            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                type="url"
                id="website"
                name="website"
                value={companyData.website}
                onChange={handleInputChange}
                required
                placeholder="Enter company website"
              />
            </div>

            <div>
              <Label htmlFor="companyLogo">Company Logo</Label>
              <div className="flex items-center mt-4">
                <Input
                  type="file"
                  id="companyLogo"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                />
                <label 
                  htmlFor="companyLogo" 
                  className="flex items-center justify-center w-32 h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-100"
                >
                  {logoPreview ? (
                    <img 
                      src={logoPreview} 
                      alt="Company Logo Preview" 
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-gray-500">
                      <ImagePlus className="w-12 h-12" />
                      <span className="text-sm mt-2">Upload Logo</span>
                    </div>
                  )}
                </label>
              </div>
            </div>

            <Button type="submit" className="w-full">
              <Upload className="mr-2 h-4 w-4" /> Create Company
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddCompanyPage;