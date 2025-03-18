import { GoogleOutlined, LinkedinFilled, LockFilled, WindowsFilled } from '@ant-design/icons'
import { Button, Divider, Input } from 'antd'
import { User2 } from 'lucide-react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function RegisterComponent() {
  const [step,setStep] = useState(1)
  return (
    <div>
    <div className='flex flex-col gap-3 text-center'>
    <h1 className='text-3xl font-outfit'>Create your account</h1>   
    <Input disabled={step == 1 ? false:true} prefix={<User2 size={18} color='grey'/>} placeholder='Email Address' className='w-80 h-10' />
   {step == 2 && <Input prefix={<LockFilled size={18} color='grey'/>} placeholder='Password' className='w-80 h-10' />}
    
    <Button type='primary' className='w-80 mt-3' onClick={()=>setStep(2)}>Continue</Button>
{step == 1 && <p className='text-[0.9rem]'>Already have an account? <Link className='text-blue-600' to={'/auth/login'}>Login</Link></p>}
  {step == 2 && <Link className='text-blue-600' onClick={()=>setStep(1)}>Go back</Link>}
  </div>
</div>
  )
}
