import { GoogleOutlined, LinkedinFilled, WindowsFilled } from '@ant-design/icons'
import { Button, Divider, Input, message } from 'antd'
import { User2, Lock } from 'lucide-react'
import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import axios from '../../api/axios'
import useGeneral from '../../hooks/useGeneral'

export default function LoginComponent() {
  const { control, handleSubmit } = useForm();
  const location = useLocation();
  const from = location.state?.from || "/";
  const {isLoggedIn,setIsLoggedIn,setUser} = useGeneral()
  const navigate = useNavigate();


  const onSubmit = async (data,event) => {
    event.preventDefault();
    try {
      const response = await axios.post('/auth/login', {
        email: data.email,
        password: data.password,
      });
      message.success('Login successful!');
     getUserData()
    } catch (error) {
      message.error('Login failed. Please try again.');
      console.error(error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // For OAuth, you typically redirect to the provider's auth page rather than making a direct POST
      // This assumes your backend has a proper endpoint that initiates OAuth flow
      window.location.href = `${axios.defaults.baseURL}/auth/google`;
      // Alternatively, if your backend expects a direct POST:
      // const response = await axios.post('/auth/google', {});
      // message.success('Login successful!');
      // getUserData();
    } catch (error) {
      message.error('Google login failed. Please try again.');
      console.error(error);
    }
  };

  const navigateToRecruiterLogin = () => {
    navigate('/auth/recruiter-login');
  };


  async function getUserData() {
    try {
      const response = await axios.get('/auth/me', { withCredentials: true });
      setIsLoggedIn(true);
      setUser(response.data);
      navigate(from, { replace: true });
    } catch (error) {
        console.error('Error fetching data:', error);
        setUser(null);
        setIsLoggedIn(false);
    }
  }
  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-3 text-center'>
        <h1 className='text-3xl font-outfit text-foreground'>Welcome Back</h1>
        
        <Controller
          name="email"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Input
              {...field}
              prefix={<User2 size={18} color='grey' />}
              placeholder='Email Address'
              className='w-80 h-10'
            />
          )}
        />
        
        <Controller
          name="password"
          control={control}
          defaultValue=""
          render={({ field }) => (
            <Input.Password
              {...field}
              prefix={<Lock size={18} color='grey' />}
              placeholder='Password'
              className='w-80 h-10'
            />
          )}
        />
        
        <Button htmlType='submit' type='primary' className='w-80 mt-3'>Sign In</Button>
        <p className='text-[0.9rem] text-muted-foreground'>
          Don't have an account? <Link className='text-blue-600' to={'/auth/register'}>Sign Up</Link>
        </p>
      </form>
      <Divider style={{ borderColor: 'grey', color: 'white' }}><span className='text-muted-foreground'>OR</span></Divider>

      <div className='flex flex-col gap-3'>
        <Button onClick={handleGoogleLogin} type='primary' className='w-80' icon={<GoogleOutlined />}>Google</Button>
        <Button type='primary' className='w-80' icon={<LinkedinFilled />}>LinkedIn</Button>
        <Button type='primary' className='w-80' icon={<WindowsFilled />}>Outlook</Button>
      </div>

      <div className="mt-6 text-center">
        <p className='text-muted-foreground cursor-pointer hover:text-blue-600' onClick={navigateToRecruiterLogin}>
          Are you a recruiter? Log In here
        </p>
      </div>

    </div>
  );
}
