import React, { useState } from "react";
import { Search, Plus, Link, Filter, MoreVertical } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";

const InterviewResultDashboard = () => {
  const [candidates, setCandidates] = useState([
    {
      id: 1,
      name: "Michael B",
      verified: true,
      dateTaken: "May 08, 2023",
      interviewStatus: "Completed",
      score: "80",
    },
    {
      id: 2,
      name: "Danish R",
      verified: false,
      dateTaken: "Jan 29, 2023",
      interviewStatus: "Terminated",
      score: "0",
    },
    {
      id: 3,
      name: "Shayan S",
      verified: false,
      dateTaken: "Feb 08, 2023",
      interviewStatus: "Pending",
      score: "",
    },
  ]);

  const [contacted, setContacted] = useState(true);

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
        return "bg-slate-600 hover:bg-[#151B23]";
    }
  };

  return (
    <div className="bg-[#0e0e0e] border-[1px] border-slate-400/50 rounded-lg text-gray-200 p-4 w-full">
      {/* Mobile-friendly Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-4">
        <h1 className="text-lg md:text-xl font-bold mb-4 md:mb-0">Your Job Post</h1>
        <div className="flex flex-wrap justify-center gap-2">
          <Button className="bg-[#3c50e6] hover:bg-indigo-700 flex items-center">
            <Plus size={16} className="mr-2" />
            <span className="text-sm">Invite</span>
          </Button>
          <Button variant="outline" className="text-gray-800 flex items-center">
            <Link size={16} className="mr-1" />
            <span className="text-sm">Copy link</span>
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4 mb-4">
        <div className="relative w-full md:w-60">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search"
            className="pl-8 bg-[#0e0e0e] border-gray-700"
          />
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            className="bg-[#0e0e0e] border-gray-700 flex items-center"
          >
            <Filter size={16} className="mr-2" />
            <span>Filters</span>
          </Button>
          <div className="flex items-center space-x-2">
            <Switch
              id="contacted"
              checked={contacted}
              onCheckedChange={setContacted}
              className="border-gray-500"
            />
            <label htmlFor="contacted" className="text-sm">
              Contacted
            </label>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border border-gray-700 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-[#151B23]">
              <TableHead className="text-gray-300">Name</TableHead>
              <TableHead className="text-gray-300 hidden md:table-cell">Date</TableHead>
              <TableHead className="text-gray-300">Interview Status</TableHead>
              <TableHead className="text-gray-300">Score</TableHead>
              <TableHead className="w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {candidates.map((candidate) => (
              <TableRow
                key={candidate.id}
                className="border-t border-gray-700 hover:bg-[#151B23]"
              >
                <TableCell className="font-medium">{candidate.name}</TableCell>
                <TableCell className="hidden md:table-cell">{candidate.dateTaken}</TableCell>
                <TableCell>
                  {candidate.interviewStatus}
                </TableCell>
                <TableCell className={candidate.score >= 80 ? "text-green-500" : (candidate.score < 50 ? "text-red-500" : "text-yellow-500")}>
  <span className={candidate.score >= 80 ? "text-green-500" : (candidate.score < 50 ? "text-red-500" : "text-yellow-500")}>
    {candidate.score}
  </span>
</TableCell>
                <TableCell className='hidden md:table-cell'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-8 w-8 p-0 text-gray-400"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-[#0e0e0e] text-gray-200 border-gray-700">
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