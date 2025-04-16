import { useState } from "react";
import { Globe, Mail, MapPin } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { Label } from "../../../components/ui/label";
import useGeneral from "../../../hooks/useGeneral";
import axios from '../../../api/axios'
import { useNavigate } from "react-router-dom";

export function UserProfile() {
  const { user, setUser } = useGeneral();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    bio: user?.bio || "",
    avatarUrl: user?.avatarUrl || "",
    location: user?.location || "",
    skills: user?.skills || [],
    website: user?.website || "",
    ResumeUrl: user?.ResumeUrl || ""
  });
  const [skillInput, setSkillInput] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddSkill = () => {
    if (skillInput.trim() !== "" && !formData.skills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()]
      });
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    });
  };

const handleSubmit = async () => {
  try {
    const response = await axios.put('/auth/update', formData);
    
    if (response.status === 200) {
      console.log('Profile updated successfully:', response.data);
      // Update the user state with the response data
      setUser({ ...user, ...formData }); // Use formData or response.data based on what your API returns
      setIsEditing(false);
      // Remove the navigation line
      // navigate("/dashboard");
    }
  } catch (error) {
    console.error('Error updating profile:', error);
  }
};

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <Card className="bg-primary-foreground rounded-lg overflow-hidden">
        <CardHeader className="relative pb-0">
          <div className="absolute right-4 top-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                if (isEditing) {
                  handleSubmit();
                } else {
                  setIsEditing(true);
                }
              }}
            >
              {isEditing ? (
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
                  <path d="M5 12h14" />
                  <path d="M12 5v14" />
                </svg>
              ) : (
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
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                </svg>
              )}
              <span className="sr-only">
                {isEditing ? "Save Profile" : "Edit Profile"}
              </span>
            </Button>
          </div>

          <div className="flex flex-col md:flex-row w-full">
            <div className="flex flex-col items-center md:w-1/3">
              {isEditing ? (
                <div className="space-y-2 w-full max-w-xs">
                  <Label htmlFor="avatarUrl">Avatar URL</Label>
                  <Input
                    id="avatarUrl"
                    name="avatarUrl"
                    value={formData.avatarUrl}
                    onChange={handleInputChange}
                    placeholder="Enter avatar URL"
                  />
                </div>
              ) : (
                <Avatar className="h-24 w-24">
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                  <AvatarFallback>
                    {user.name
                      ? user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)
                      : "U"}
                  </AvatarFallback>
                </Avatar>
              )}
              <CardTitle className="mt-4 text-center text-xl">
                {user.name || "Welcome, New User!"}
              </CardTitle>

              {isEditing ? (
                <div className="space-y-2 w-full max-w-xs mt-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Where are you based?"
                  />
                </div>
              ) : (
                <div className="mt-2 flex items-center text-sm text-muted-foreground">
                  <MapPin className="mr-1 h-4 w-4" />
                  {user.location || "Location not set"}
                </div>
              )}

              {isEditing ? (
                <div className="space-y-2 w-full max-w-xs mt-4">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    placeholder="Your website URL"
                  />
                </div>
              ) : (
                <div className="flex justify-center space-x-2 mt-4">
                  {user.website ? (
                    <Button variant="outline" size="icon" asChild>
                      <a
                        href={user.website}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Globe className="h-4 w-4" />
                        <span className="sr-only">Website</span>
                      </a>
                    </Button>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      No website set
                    </div>
                  )}
                </div>
              )}

              {!isEditing && (
                <div className="space-y-2 mt-4">
                  <div className="flex items-center">
                    <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{user.email || "Email not set"}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="md:w-2/3 mt-6 md:mt-0 md:pl-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">About</h3>
                  {isEditing ? (
                    <Textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Tell us about yourself"
                      className="mt-2 min-h-24"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground mt-2">
                      {user.bio || "No bio available. Edit your profile to add information about yourself."}
                    </p>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-medium">Skills</h3>
                  {isEditing ? (
                    <div className="mt-2 space-y-2">
                      <div className="flex gap-2">
                        <Input
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          placeholder="Add a skill"
                        />
                        <Button
                          type="button"
                          onClick={handleAddSkill}
                          variant="outline"
                        >
                          Add
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.skills.map((skill, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-primary text-white flex items-center gap-1"
                          >
                            {skill}
                            <button
                              onClick={() => handleRemoveSkill(skill)}
                              className="ml-1 h-4 w-4 rounded-full flex items-center justify-center hover:bg-red-500"
                            >
                              ×
                            </button>
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {user.skills && user.skills.length > 0 ? (
                        user.skills.map((skill, index) => (
                          <Badge
                            key={index}
                            variant="secondary"
                            className="bg-primary text-white"
                          >
                            {skill}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">
                          No skills added yet. Edit your profile to add your skills.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {isEditing && (
                  <div>
                    <h3 className="text-lg font-medium">Resume</h3>
                    <div className="space-y-2 w-full mt-2">
                      <Label htmlFor="ResumeUrl">Resume URL</Label>
                      <Input
                        id="ResumeUrl"
                        name="ResumeUrl"
                        value={formData.ResumeUrl}
                        onChange={handleInputChange}
                        placeholder="Link to your resume"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          {isEditing && (
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsEditing(false);
                  setFormData({
                    bio: user.bio || "",
                    avatarUrl: user.avatarUrl || "",
                    location: user.location || "",
                    skills: user.skills || [],
                    website: user.website || "",
                    ResumeUrl: user.ResumeUrl || ""
                  });
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSubmit}>Save Changes</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}