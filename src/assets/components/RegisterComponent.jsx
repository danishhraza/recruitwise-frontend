import { LockFilled } from '@ant-design/icons'
import { Button, Divider, Input, notification } from 'antd'
import { User2, Mail } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import axios from '../../api/axios'

export default function RegisterComponent() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [resendDisabled, setResendDisabled] = useState(false)
  const navigate = useNavigate()

  const { control, handleSubmit, formState: { errors }, watch, getValues } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: ''
    }
  })

  const onNextStep = () => {
    const { name, email } = getValues();
    if (name && email) {
      setStep(2);
    }
  }

  const onSubmitRegister = async (data) => {
    setIsLoading(true)
    try {
      const response = await axios.post('/auth/signup-candidate', data)
      setEmail(data.email)
      setStep(3) // Move to OTP verification step
      notification.success({
        message: 'Registration Successful',
        description: 'Please verify your account with the OTP sent to your email'
      })
    } catch (error) {
      notification.error({
        message: 'Registration Failed',
        description: error.response?.data?.message || 'Something went wrong'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleOtpChange = (index, value) => {
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newOtpValues = [...otpValues]
      newOtpValues[index] = value
      setOtpValues(newOtpValues)
      
      // Auto focus to next input
      if (value && index < 5) {
        document.getElementById(`otp-${index + 1}`).focus()
      }
    }
  }

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus()
    }
  }

  const verifyOtp = async () => {
    const otp = otpValues.join('')
    if (otp.length !== 6) {
      notification.error({
        message: 'Invalid OTP',
        description: 'Please enter a valid 6-digit OTP'
      })
      return
    }

    setIsLoading(true)
    try {
      await axios.post('/auth/verify-otp', { email, otp })
      notification.success({
        message: 'Account Verified',
        description: 'Your account has been verified successfully'
      })
      navigate('/')
    } catch (error) {
      notification.error({
        message: 'Verification Failed',
        description: error.response?.data?.message || 'Invalid OTP'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resendOtp = async () => {
    setResendDisabled(true)
    try {
      await axios.get(`/auth/request-otp?email=${email}`)
      notification.success({
        message: 'OTP Resent',
        description: 'A new OTP has been sent to your email'
      })
      
      // Enable resend after 60 seconds
      setTimeout(() => {
        setResendDisabled(false)
      }, 60000)
    } catch (error) {
      notification.error({
        message: 'Failed to resend OTP',
        description: error.response?.data?.message || 'Something went wrong'
      })
      setResendDisabled(false)
    }
  }

  return (
    <div>
      <div className='flex flex-col gap-3 text-center'>
        <h1 className='text-3xl font-outfit'>Create your account</h1>

        {step === 1 && (
          <form onSubmit={handleSubmit(onNextStep)} className='flex flex-col gap-3'>
            <Controller
              name="name"
              control={control}
              rules={{ required: 'Name is required' }}
              render={({ field }) => (
                <Input 
                  {...field}
                  prefix={<User2 size={18} color='grey'/>} 
                  placeholder='Full Name'
                  className='w-80 h-10'
                  status={errors.name ? 'error' : ''}
                />
              )}
            />
            {errors.name && <p className='text-red-500 text-xs'>{errors.name.message}</p>}
            
            <Controller
              name="email"
              control={control}
              rules={{ 
                required: 'Email is required', 
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              }}
              render={({ field }) => (
                <Input 
                  {...field}
                  prefix={<Mail size={18} color='grey'/>} 
                  placeholder='Email Address'
                  className='w-80 h-10'
                  status={errors.email ? 'error' : ''}
                />
              )}
            />
            {errors.email && <p className='text-red-500 text-xs'>{errors.email.message}</p>}
            
            <Button type='primary' htmlType='submit' className='w-80 mt-3'>Continue</Button>
            <p className='text-[0.9rem]'>Already have an account? <Link className='text-blue-600' to={'/auth/login'}>Login</Link></p>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSubmit(onSubmitRegister)} className='flex flex-col gap-3'>
            <Input 
              prefix={<Mail size={18} color='grey'/>} 
              placeholder='Email Address'
              className='w-80 h-10'
              value={watch('email')}
            />
            
            <Controller
              name="password"
              control={control}
              rules={{ 
                required: 'Password is required',
                minLength: {
                  value: 8,
                  message: 'Password must be at least 8 characters'
                },
                validate: (value) => {
                  const hasUpperCase = /[A-Z]/.test(value);
                  const hasLowerCase = /[a-z]/.test(value);
                  const hasNumber = /[0-9]/.test(value);
                  // Updated regex to explicitly include # character
                  const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
                  
                  if (!hasUpperCase) return 'Password must contain an uppercase letter';
                  if (!hasLowerCase) return 'Password must contain a lowercase letter';
                  if (!hasNumber) return 'Password must contain a number';
                  if (!hasSpecial) return 'Password must contain a special character';
                  
                  return true;
                }
              }}
              render={({ field }) => (
                <Input.Password 
                  {...field}
                  prefix={<LockFilled />} 
                  placeholder='Password'
                  className='w-80 h-10'
                  status={errors.password ? 'error' : ''}
                />
              )}
            />
            {errors.password && (
              <p className='text-red-500 text-xs max-w-xs mx-auto break-words'>
                {errors.password.message}
              </p>
            )}
            
            <Button type='primary' htmlType='submit' className='w-80 mt-3' loading={isLoading}>
              Register
            </Button>
            <Link className='text-blue-600' onClick={() => setStep(1)}>Go back</Link>
          </form>
        )}

        {step === 3 && (
          <div className='flex flex-col gap-3 items-center'>
            <p className='text-gray-600'>
              We've sent a verification code to <span className='font-semibold'>{email}</span>
            </p>
            
            <div className='flex gap-2 mt-3'>
              {otpValues.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className='w-10 h-12 text-center border border-gray-300 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-black'
                  maxLength={1}
                />
              ))}
            </div>

            <Button 
              type='primary' 
              onClick={verifyOtp} 
              className='w-80 mt-3'
              loading={isLoading}
            >
              Verify Account
            </Button>
            
            <p className='text-[0.9rem] mt-2'>
              Didn't receive code?{' '}
              <Button 
                type='link' 
                onClick={resendOtp} 
                disabled={resendDisabled}
                className='p-0'
              >
                Resend
              </Button>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
