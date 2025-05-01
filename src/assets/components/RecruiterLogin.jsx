import { GoogleOutlined, WindowsFilled } from '@ant-design/icons'
import { Button, message } from 'antd'
import React from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import axios from '../../api/axios'
import useGeneral from '../../hooks/useGeneral'

export default function RecruiterLoginComponent() {
  const location = useLocation();
  const from = location.state?.from || "/";
  const { setIsLoggedIn, setUser } = useGeneral();
  const navigate = useNavigate();

  const handleGoogleLogin = async () => {
    try {
      window.location.href = `${axios.defaults.baseURL}/recruiter/google`;
    } catch (error) {
      message.error('Google login failed. Please try again.');
      console.error(error);
    }
  };

  const handleOutlookLogin = async () => {
    try {
      window.location.href = `${axios.defaults.baseURL}/recruiter/outlook`;
    } catch (error) {
      message.error('Outlook login failed. Please try again.');
      console.error(error);
    }
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
      <div className='flex flex-col gap-3 text-center'>
        <h1 className='text-3xl font-outfit text-foreground'>Recruiter Login</h1>
        <p className='text-muted-foreground mb-4'>Sign in with your professional account</p>
      </div>
      
      <div className='flex flex-col gap-3'>
        <Button onClick={handleGoogleLogin} type='primary' className='w-80' icon={<GoogleOutlined />}>Google</Button>
        <Button onClick={handleOutlookLogin} type='primary' className='w-80' icon={<WindowsFilled />}>Outlook</Button>
      </div>

      <div className="mt-6 text-center">
        <Link to="/auth/login" className='text-muted-foreground hover:text-blue-600'>
          Back to Regular Login
        </Link>
      </div>
    </div>
  );
}