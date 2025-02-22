import { List,Collapse, } from '@material-tailwind/react'
import { NavArrowRight } from 'iconoir-react';
import React, { useState } from 'react'

export default function SidebarCollaps({name,icon,children}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
    <List.Item onClick={() => setIsOpen((cur) => !cur)} className={`text-white ${isOpen && "bg-slate-700"} hover:bg-slate-700 hover:text-white`}>
    <List.ItemStart>
     {icon}
    </List.ItemStart>
    {name}
    <List.ItemEnd>
      <NavArrowRight
        className={`h-4 w-4 ${isOpen ? "rotate-90" : ""}`}
        />
    </List.ItemEnd>
  </List.Item>
  <Collapse open={isOpen}>
    {children}
  </Collapse>
        </>

  )
}
