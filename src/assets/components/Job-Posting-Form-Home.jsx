import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';

export default function JobPostingForm() {
  const [hiresCount, setHiresCount] = useState(1);

  const incrementHires = () => {
    setHiresCount(prev => prev + 1);
  };

  const decrementHires = () => {
    if (hiresCount > 1) {
      setHiresCount(prev => prev - 1);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-[#0e0e0e] text-white rounded-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Create Job Posting</CardTitle>
        <CardDescription>Fill out the details for your new job posting</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="jobTitle">Job title*</Label>
          <Input 
            id="jobTitle" 
            placeholder="e.g. Frontend developer" 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="skills">What skills should they have?*</Label>
          <Input 
            id="skills" 
            placeholder='e.g. "React" and "JavaScript"' 
          />
        </div>

        <div className="space-y-2">
          <Label>How many hires do you need?*</Label>
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="icon"
              type="button"
              onClick={decrementHires}
              className="h-8 w-8 hover:bg-gray-300"
            >
              <Minus className="h-4 w-4 text-black" />
            </Button>
            <div className="w-8 text-center">{hiresCount}</div>
            <Button 
              variant="outline" 
              size="icon"
              type="button"
              onClick={incrementHires}
              className="h-8 w-8 hover:bg-gray-300"
            >
              <Plus className="h-4 w-4 text-black" />
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Job location*</Label>
          <RadioGroup defaultValue="hybrid" className="flex space-x-4 ">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="remote" id="remote" className="border-gray-300 data-[state=checked]:bg-white data-[state=checked]:text-white"/>
              <Label htmlFor="remote" className="cursor-pointer">It's fully remote</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="hybrid" id="hybrid" className="border-gray-300 data-[state=checked]:bg-white data-[state=checked]:text-white"/>
              <Label htmlFor="hybrid" className="cursor-pointer">It's hybrid</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="onsite" id="onsite" className="border-gray-300 data-[state=checked]:bg-white data-[state=checked]:text-white"/>
              <Label htmlFor="onsite" className="cursor-pointer">It's on-site</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input 
            id="location" 
            placeholder='e.g. "California" or "San Francisco"' 
          />
        </div>

        <div className="space-y-2">
          <Label>Employment type*</Label>
          <RadioGroup defaultValue="fulltime" className="flex space-x-6">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="fulltime" id="fulltime" className="border-gray-300 data-[state=checked]:bg-white data-[state=checked]:text-white"/>
              <Label htmlFor="fulltime" className="cursor-pointer">Full time</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="parttime" id="parttime" className="border-gray-300 data-[state=checked]:bg-white data-[state=checked]:text-white"/>
              <Label htmlFor="parttime" className="cursor-pointer">Part time</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
}