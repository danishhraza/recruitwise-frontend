import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import MultiLevelSidebar from '../components/Sidebar'
import Profile from '../components/Profile'

export default function DashboardLayout() {
  const [currentTab,setCurrentTab] = useState('Profile')
  const [currentComponent,setCurrentComponent] = useState(<Profile/>)
  return (
    <div className='w-full flex bg-black'>
      <MultiLevelSidebar setCurrentTab={setCurrentTab} currentTab={currentTab} setCurrentComponent={setCurrentComponent}/>
      <div className='py-2 px-6'>
      {currentComponent}
      </div>
        <Outlet/>
    </div>
)
}
