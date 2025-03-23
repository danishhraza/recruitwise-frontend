import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import RWloading from '../components/RWloading'
import StickyNavbar from '../components/StickyNavbar'

export default function PublicLayout() {
      const [loading,setLoading] = useState(false)
      useEffect(()=>{
        setLoading(true)
        setTimeout(()=>{
          setLoading(false)
        },3000)
      },[])

  return (
    <div className=' bg-black w-full overflow-auto'>
{loading ? <RWloading /> : <>
      <StickyNavbar/>
      <div className="w-full py-28">
        <Outlet context={{loading}}/> {/* This will render the correct page */}
      </div>
      </>
  }
  </div>
  )
}
