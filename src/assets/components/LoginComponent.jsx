import { GoogleOutlined, LinkedinFilled, WindowsFilled } from '@ant-design/icons'
import { Button, Divider, Input } from 'antd'
import { User2 } from 'lucide-react'
import React from 'react'
import { Link } from 'react-router-dom'

export default function LoginComponent() {
  return (
    <div>
    <div className='flex flex-col gap-3 text-center'>
    <h1 className='text-3xl font-gabarito'>Welcome Back</h1>   
    <Input prefix={<User2 size={18} color='grey'/>} placeholder='Email Address' className='w-80 h-10' />
    <Button type='primary' className='w-80 mt-3'>Continue</Button>
    <p className='text-[0.9rem]'>Don't have an account? <Link className='text-blue-600' to={'/auth/register'}>Sign Up</Link></p>
    </div>
    <Divider style={{ borderColor: 'grey',color:'white' }}>OR</Divider>
    <div className='flex flex-col gap-3'>

    <Button type='primary' className='w-80' icon={<GoogleOutlined/>}>Google</Button>
    <Button type='primary' className='w-80' icon={<LinkedinFilled/>}>LinkedIn</Button>
    <Button type='primary' className='w-80' icon={<WindowsFilled/>}>Outlook</Button>
    </div>
</div>
  )
}
