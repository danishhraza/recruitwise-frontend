import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import StickyNavbar from '../components/StickyNavbar'
import ResendFooterWithLogo from '../components/Footer'

export default function PublicLayout() {
      const [loading,setLoading] = useState(false)
      useEffect(()=>{
        setLoading(true)
        setTimeout(()=>{
          setLoading(false)
        },3000)
      },[])

  return (
    <div className='bg-[#000] w-full scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-800 flex flex-col min-h-screen"'>
   
      <StickyNavbar/>
      <div className="w-full py-28 flex-grow">
        <Outlet context={{loading}}/> {/* This will render the correct page */}
      </div>
      <ResendFooterWithLogo/>
   
  </div>
  )
}
