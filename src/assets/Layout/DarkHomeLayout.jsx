import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import StickyNavbar from '../components/StickyNavbar';
import ResendFooterWithLogo from '../components/Footer';
import useGeneral from '../../hooks/useGeneral';
import { toast, Toaster } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import axios from '../../api/axios';

export default function DarkHomeLayout() {
  const [loading, setLoading] = useState(false);
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const { user, isLoggedIn, setUser } = useGeneral();
  
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  useEffect(() => {
    if (user?.Verified == false && isLoggedIn) {
      toast.error('Please verify your email address.', {
        id: 'verification-toast',
        duration: Infinity,
        action: {
          label: 'Verify',
          onClick: () => handleVerifyEmail()
        }
      });
    }
  }, [isLoggedIn, user]);
  
  const handleVerifyEmail = () => {
    setIsVerificationModalOpen(true);
    // Also request a new OTP
    handleResendOtp();
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      value = value.slice(0, 1);
    }
    
    const newOtpValues = [...otpValues];
    newOtpValues[index] = value;
    setOtpValues(newOtpValues);
    
    // Auto-focus next input
    if (value !== '' && index < 5) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace to focus previous input
    if (e.key === 'Backspace' && index > 0 && !otpValues[index]) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };
  
  const handleVerifyOtp = async () => {
    const otp = otpValues.join('');
    if (otp.length !== 6) {
      toast.error('Please enter a valid 6-digit OTP');
      return;
    }
    
    setIsVerifying(true);
    try {
      const response = await axios.post('/auth/verify-otp', { otp });
      toast.success('Email verified successfully!');
      const r = await axios.get('/auth/me');
      setUser(r.data);
      setIsVerificationModalOpen(false);
      toast.dismiss('verification-toast');
      // Refresh user data or update verification status
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to verify OTP');
    } finally {
      setIsVerifying(false);
    }
  };
  
  const handleResendOtp = async () => {
    setIsResending(true);
    try {
      await axios.get('/auth/request-otp', { withCredentials: true });
      toast.info('A new verification code has been sent to your email');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend verification code');
    } finally {
      setIsResending(false);
    }
  };
  
  return (
    <div className='bg-[#000] text-white w-full scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-800 flex flex-col min-h-screen'>
      <StickyNavbar />
      <div className="w-full py-28 flex-grow">
        <Outlet context={{ loading }} /> {/* This will render the correct page */}
      </div>
      <ResendFooterWithLogo />
      <Toaster richColors position="top-center" /> 

      <Dialog open={isVerificationModalOpen} onOpenChange={setIsVerificationModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Email Verification</DialogTitle>
            <DialogDescription>
              Enter the 6-digit code sent to your email address
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex items-center justify-center space-x-2 py-4">
            {otpValues.map((digit, index) => (
              <Input
                key={index}
                id={`otp-input-${index}`}
                type="text"
                inputMode="numeric"
                className="h-12 w-12 text-center text-lg"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                maxLength={1}
                pattern="[0-9]*"
                autoFocus={index === 0}
              />
            ))}
          </div>
          
          <DialogFooter className="flex flex-col sm:flex-col gap-2">
            <Button 
              onClick={handleVerifyOtp} 
              disabled={isVerifying || otpValues.some(val => val === '')}
              className="w-full"
            >
              {isVerifying ? 'Verifying...' : 'Verify Email'}
            </Button>
            <div className="flex justify-center items-center w-full">
              <Button 
                variant="link" 
                onClick={handleResendOtp}
                disabled={isResending}
              >
                {isResending ? 'Sending...' : "Didn't receive a code? Resend"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}