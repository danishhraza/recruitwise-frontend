import React, { useState } from "react";
import { Search } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { MoreVertical, Filter, Archive, Plus, Link } from "lucide-react";

const InterviewResultDashboard = () => {
  const [candidates, setCandidates] = useState([
    {
      id: 1,
      name: "Michael B",
      verified: true,
      dateTaken: "May 08, 2023",
      hardSkills: [
        { name: "React", level: "Senior" },
        { name: "Javascript", level: "Junior" },
        { name: "Html", level: "Mid-level" },
      ],
      softSkills: "Average",
      codingExercise: "Senior",
      proctoring: "100%",
    },
    {
      id: 2,
      name: "Niall K",
      verified: false,
      dateTaken: "Apr 08, 2023",
      hardSkills: [
        { name: "Java", level: "Mid-level" },
        { name: "Spring boot", level: "Mid-level" },
        { name: "Data structure", level: "Mid-level" },
        { name: "SQL", level: "Junior" },
      ],
      softSkills: "Good",
      codingExercise: "Junior",
      proctoring: "100%",
    },
    {
      id: 3,
      name: "Shayan S",
      verified: false,
      dateTaken: "Feb 08, 2023",
      hardSkills: [
        { name: "ReactJS", level: "Junior" },
        { name: "Javascript", level: "Mid-level" },
        { name: "Redux", level: "Not experienced" },
      ],
      softSkills: "Average",
      codingExercise: "Not experienced",
      proctoring: "92%",
    },
    {
      id: 4,
      name: "Danish R",
      verified: false,
      dateTaken: "Jan 29, 2023",
      hardSkills: [
        { name: "React", level: "Senior" },
        { name: "Javascript", level: "Senior" },
        { name: "Bootstrap", level: "Senior" },
        { name: "MongoDB", level: "Senior" },
      ],
      softSkills: "Excellent",
      codingExercise: "Senior",
      proctoring: "98%",
    },
  ]);

  const [contacted, setContacted] = useState(false);

  const getBadgeColor = (level) => {
    switch (level) {
      case "Senior":
        return "bg-green-600 hover:bg-green-700";
      case "Mid-level":
        return "bg-blue-600 hover:bg-blue-700";
      case "Junior":
        return "bg-purple-600 hover:bg-purple-700";
      case "Not experienced":
        return "bg-red-600 hover:bg-red-700";
      default:
        return "bg-slate-600 hover:bg-slate-700";
    }
  };

  const getResultColor = (result) => {
    if (result === "Not experienced") return "text-red-500";
    return "";
  };

  return (
    <div className="bg-[#0e0e0e] border-[1px] border-white rounded-lg text-gray-200 p-4 w-[85%] -translate-y-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold">Your Job Post</h1>
        </div>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" className="text-gray-300">
            Manage saved tests
          </Button>
          <Button className="bg-[#3c50e6] hover:bg-indigo-700 flex items-center">
            <Plus size={16} className="mr-2" />
            <span>Invite a candidate</span>
          </Button>
          <Button variant="ghost" className="text-gray-300 flex items-center">
            <Link size={16} className="mr-1" />
            <span>Copy link instead</span>
          </Button>
        </div>
      </div>

      {/* Search and filters */}
      <div className="flex space-x-4 mb-4">
        <div className="relative w-60">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search"
            className="pl-8 bg-gray-800 border-gray-700"
          />
        </div>
        <Button
          variant="outline"
          className="bg-gray-800 border-gray-700 flex items-center"
        >
          <Filter size={16} className="mr-2" />
          <span>Filters</span>
        </Button>
        <div className="flex items-center space-x-2">
          <Switch
            id="contacted"
            checked={contacted}
            onCheckedChange={setContacted}
          />
          <label htmlFor="contacted" className="text-sm">
            Contacted only
          </label>
        </div>
        <Button
          variant="ghost"
          className="text-gray-300 flex items-center"
        >
          <Archive size={16} className="mr-2" />
          <span>View archive</span>
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border border-gray-700 overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-800">
            <TableRow>
              <TableHead className="text-gray-300">Name</TableHead>
              <TableHead className="text-gray-300">Date Taken</TableHead>
              <TableHead className="text-gray-300">Hard skills</TableHead>
              <TableHead className="text-gray-300">Soft skills</TableHead>
              <TableHead className="text-gray-300">Coding exercise</TableHead>
              <TableHead className="text-gray-300">Proctoring result</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {candidates.map((candidate) => (
              <TableRow
                key={candidate.id}
                className="border-t border-gray-700 hover:bg-gray-800"
              >
                <TableCell className="font-medium flex items-center space-x-2">
                  <span>{candidate.name}</span>
                </TableCell>
                <TableCell>{candidate.dateTaken}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {candidate.hardSkills.map((skill, idx) => (
                      <Badge
                        key={idx}
                        className={`${getBadgeColor(skill.level)} text-xs font-normal`}
                      >
                        {skill.name} {skill.level !== "Not experienced" && skill.level}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  {candidate.softSkills ? candidate.softSkills : "—"}
                </TableCell>
                <TableCell className={getResultColor(candidate.codingExercise)}>
                  {candidate.codingExercise}
                </TableCell>
                <TableCell>{candidate.proctoring}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 text-gray-400"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-gray-800 text-gray-200 border-gray-700">
                      <DropdownMenuItem>View details</DropdownMenuItem>
                      <DropdownMenuItem>Export results</DropdownMenuItem>
                      <DropdownMenuItem>Archive</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default InterviewResultDashboard;