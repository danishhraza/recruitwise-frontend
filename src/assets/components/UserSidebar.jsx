import React from 'react'
import {
    Card,
    List,
    Chip,
  } from "@material-tailwind/react";
import { Bookmark, SendDiagonal, TimeZone } from 'iconoir-react';
import { FileArchive } from 'lucide-react';
import AppliedJobs from './UserComponents/AppliedJobs';
import ListedJobs from './UserComponents/ListedJobs';

const LIST = [
  {
    icon: SendDiagonal,
    title: "Applications",
    param: "",
    component:<AppliedJobs/>
  },
  {
    icon: Bookmark,
    title: "Saved Jobs",
    param: "",
    component:<ListedJobs/>
  },
  {
    icon: FileArchive,
    title: "Resumes & Cover Letters",
    param: "",
    component:''
  },
]
export default function UserSidebar({setCurrentTab,setCurrentComponent,currentTab}) {
  return (
    <>
     <List>
              {LIST.map(({ icon: Icon, title, param,component, badge }) => (
                <List.Item key={title} onClick={()=>{setCurrentTab(title); setCurrentComponent(component)}} className={`text-white hover:bg-slate-700 hover:text-white ${currentTab == title && 'bg-slate-700'}`}>
                  <List.ItemStart>
                    <Icon className="h-[18px] w-[18px]" />
                  </List.ItemStart>
                  {title}
                  {badge && (
                    <List.ItemEnd>
                      <Chip size="sm" variant="ghost">
                        <Chip.Label>{badge}</Chip.Label>
                      </Chip>
                    </List.ItemEnd>
                  )}
                </List.Item>
              ))}
            </List>
    </>
  )
}
