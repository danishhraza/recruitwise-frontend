import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import RWloading from '../components/RWloading'

export default function PublicLayout() {
      const [loading,setLoading] = useState(false)

      useEffect(()=>{
        setLoading(true)
        setTimeout(()=>{
          setLoading(false)
        },3000)
      },[])

  return (
    <div className='bg-black w-full flex justify-center items-center overflow-auto  py-32'>
{loading ? <RWloading /> : <>
<Navbar/>
      <div className="w-full">
        <Outlet context={{loading}}/> {/* This will render the correct page */}
      </div>
      </>
  }
  </div>
  )
}
