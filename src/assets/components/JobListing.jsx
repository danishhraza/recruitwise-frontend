import { Avatar, Button, Col, Row, Tag } from 'antd'
import { Bookmark, LucideSave, SaveIcon, User2Icon } from 'lucide-react'
import React from 'react'

const skillColors = {
    "c++": "#00599C",
    "c#": "#68217A",
    "java": "#ED8B00",
    "python": "#FFD43B",
    "javascript": "#F7DF1E",
    "typescript": "#3178C6",
    "ruby": "#CC342D",
    "php": "#777BB4",
    "swift": "#FA7343",
    "go": "#00ADD8",
    "rust": "#DEA584",
    "kotlin": "#F18E33",
    "dart": "#0175C2",
    "scala": "#DC322F",
    "r": "#276DC3",
    "sql": "#336791",
    "html": "#E34F26",
    "css": "#1572B6",
    "sass": "#CC6699",
    "less": "#1D365D",
    "bash": "#4EAA25",
    "shell": "#89E051",
    "powershell": "#5391FE",
    "perl": "#39457E",
    "lua": "#000080",
    "haskell": "#5D4F85",
    "clojure": "#5881D8",
    "elixir": "#6E4A7E",
    "erlang": "#A90533",
    "f#": "#B845FC",
    "groovy": "#4298B8",
    "objective-c": "#438EFF",
    "matlab": "#E16737",
    "julia": "#9558B2",
    "assembly": "#6E6E6E",
    "fortran": "#734F96",
    "cobol": "#DFAF37",
    "ada": "#02A4D3",
    "vhdl": "#B2B7F8",
    "verilog": "#848589",
    "pl/sql": "#E48E00",
    "t-sql": "#00758F",
    "graphql": "#E10098",
    "json": "#CB3837",
    "xml": "#F66A0A",
    "yaml": "#CB171E",
    "docker": "#2496ED",
    "kubernetes": "#326CE5",
    "ansible": "#EE0000",
    "terraform": "#623CE4",
    "puppet": "#FFA500",
    "chef": "#F09820",
    "jenkins": "#D24939",
    "git": "#F05032",
    "github": "#181717",
    "gitlab": "#FC6D26",
    "bitbucket": "#0052CC",
    "aws": "#FF9900",
    "azure": "#0089D6",
    "gcp": "#4285F4",
    "firebase": "#FFCA28",
    "linux": "#FCC624",
    "windows": "#0078D6",
    "macos": "#999999",
    "react": "#61DAFB",
    "vue": "#4FC08D",
    "angular": "#DD0031",
    "svelte": "#FF3E00",
    "node.js": "#339933",
    "mongodb": "#47A248",
    "redis": "#DC382D",
    "pandas": "#150458", 
    "tensorflow": "#FF6F00",
    "networking": "#007CFF",
    "firewalls": "#FF0000",
    "siem": "#00FF00",
    "selenium": "#43B02A",
    "junit": "#25A162",
    "pytorch": "#EE4C2C",
    "gpt": "#4B4B4B",
    "tailwind": "#38B2AC",
    "redux": "#764ABC",
    "postman": "#FF6C37",
    "next.js": "#000000",
    "nuxt.js": "#00DC82",
    "astro": "#FF5D01",
    "express": "#404D59",
    "nestjs": "#E0234E",
    "django": "#092E20",
    "flask": "#000000",
    "fastapi": "#009688",
    "spring": "#6DB33F",
    "rails": "#CC0000",
    "laravel": "#FF2D20",
    "asp.net": "#512BD4",
    "electron": "#47848F",
    "flutter": "#02569B",
    "unity": "#000000",
    "unreal engine": "#0E1128",
    "godot": "#478CBF"
  };
  
const jobType ={
    "full-time": "#800080",
    "part-time": "#FFD700",
    "contract": "#0000FF",
    "intern": "#008000"
  }

const getTimeDifference = (createdAt) => {
    const now = new Date();
    const createdTime = new Date(createdAt);
    const diffMinutes = Math.floor((now - createdTime) / 60000); // Convert to minutes
  
    if (diffMinutes < 1) return "Just Now";
    if (diffMinutes < 60) return `${diffMinutes} minutes ago`;
  
    const diffHours = Math.floor(diffMinutes / 60); // Convert to hours
    if (diffHours < 24) return `${diffHours} hours ago`;
    const diffDays = Math.floor(diffHours / 24); // Convert to days
    return `${diffDays} days ago`;
  };

function JobListing({data}) {

      

  return (
<div className="relative w-full md:w-[70dvw] p-4 rounded-lg bg-gradient-to-r from-blue-400 to-blue-200 text-white border-2 border-transparent">
<div className="absolute inset-0 rounded-lg bg-slate-900 "></div>
<div className="relative">

     <Row gutter={[16, 16]}>
  {/* Avatar */}
  <Col
    xs={{ span: 4,order:1 }}
    sm={{ span: 6 }}
    md={{ span: 4 }}
    lg={{ span: 2 }}
    >
    <Avatar shape="square" size={64} icon={<User2Icon />} />
  </Col>

  {/* Job Title & Company */}
  <Col
    xs={{ span: 18,order:2 }}
    sm={{ span: 18 }}
    md={{ span: 8 }}
    lg={{ span: 5 }}
    >
    <div className="flex flex-col gap-2 px-6">
      <h1 className="text-2xl font-bold">{data.title}</h1>
      <p>{data.company}</p>
    </div>
  </Col>

  {/* Job Type (Full-time, Contract, etc.) */}
  <Col xs={{span:24,order:4}} sm={{span:12,order:3}} md={{span:3}}>
    <div className="flex w-full h-full items-center">
      <Tag bordered={false} color={jobType[data.jobType]} className="text-md">
        {data.jobType}
      </Tag>
    </div>
  </Col>

  {/* Requirements */}
  <Col xs={{span:24,order:5}} sm={12} md={6}>
    <div className="flex h-full items-center flex-wrap">
      {data.requirements.map((req, idx) => (
        <Tag bordered={false} color={skillColors[req.toLowerCase()]} key={idx}>
          {req}
        </Tag>
      ))}
    </div>
  </Col>

  {/* Location */}
  <Col xs={{span:12,order:6}} sm={{span:8,order:5}} md={{span:4}} className="flex items-center">
    <p className="text-lg">{data.location}</p>
  </Col>

  {/* Date Posted */}
  <Col xs={{span:12,order:7}} sm={{span:8,order:6}} md={{span:3}} className="flex items-center">
    <p className="text-lg text-slate-300">{getTimeDifference(data.createdAt)}</p>
  </Col>

  {/* Bookmark Button */}
  <Col xs={{span:1,order:3}} sm={{span:8,order:7}} md={{span:1}}>
    <div className="flex h-full w-full justify-center items-center">
      <Button type="link" size="large" icon={<Bookmark size={35} color="white" />} />
    </div>
  </Col>
</Row>

      </div>
    </div>
  )
}

export default JobListing