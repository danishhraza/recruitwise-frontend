import React from 'react'
import { Outlet } from 'react-router-dom'
import MultiLevelSidebar from '../components/Sidebar'

export default function DashboardLayout() {
  return (
    <div className='w-full h-screen bg-black'>
      <MultiLevelSidebar/>
        <Outlet/>
    </div>
)
}
