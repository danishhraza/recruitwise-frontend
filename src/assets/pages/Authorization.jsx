import React from 'react'
import { Outlet} from 'react-router-dom'
export default function Authorization() {
  return (
    <div className='w-full px-4 py-2'>
        <img src='/images/logo-white.webp' className='w-56' alt='logo' />
        <div className='w-full mt-16 flex justify-center'>
          <Outlet/>
        </div>
    </div>
  )
}
