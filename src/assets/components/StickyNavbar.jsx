import React, { useEffect } from "react";
import {
  Button,
  IconButton,
  Typography,
  Collapse,
  Navbar,
} from "@material-tailwind/react";
import {
  Archive,
  Menu,
  MultiplePages,
  ProfileCircle,
  SelectFace3d,
  Xmark,
  MediaImage,
} from "iconoir-react";
import { Link, useNavigate } from "react-router-dom";
import { message } from 'antd'
import useGeneral from "../../hooks/useGeneral";
import axios from "../../api/axios";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"

const LINKS = [
  // Commented out links as in original
];

function NavList() {
  return (
    <ul className="mt-4 flex flex-col gap-x-3 px-2 gap-y-1.5 lg:mt-0 lg:flex-row text-white lg:items-center">
      {LINKS.map(({ icon: Icon, title, href }) => (
        <li key={title}>
          <Typography
            as="a"
            href={href}
            type="small"
            className="flex items-center gap-x-2 p-1 hover:text-primary"
          >
            <Icon className="h-6 w-6" />
            {title}
          </Typography>
        </li>
      ))}
    </ul>
  );
}

export default function StickyNavbar() {
  const [openNav, setOpenNav] = React.useState(false);
  const navigate = useNavigate();
  const {isLoggedIn, user, setIsLoggedIn, setUser} = useGeneral();
  
  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false),
    );
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.post('/auth/logout');
      message.success('Logout successful!');
      setIsLoggedIn(false)
      setUser(null)
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Determine user roles
  const isAdmin = user && user.role === 'admin';
  const isCandidate = user && user.role === 'candidate';
  const isRecruiter = user && user.role === 'recruiter';
  
  // Determine which links to show based on auth state and role
  const showApplyAsTalent = !isLoggedIn || isCandidate;
  const showPostJob = !isLoggedIn || isRecruiter;
  const showAddCompany = isAdmin;
  
  return (
    <div className="fixed top-5 left-0 right-0 px-4 z-20">
      <Navbar className="border-[#ffffff1a] rounded-2xl max-w-screen-xl mx-auto text-white bg-[#00000066] backdrop-blur-xl px-6 py-4">
        <div className="flex items-center">
          {/* Logo section - left aligned */}
          <div className="flex-shrink-0 z-10">
            <Typography
              as="a"
              href="/"
              type="small"
              className="block"
            >
              <img src="/images/logo-white.webp" alt="logo" className="w-36"/>
            </Typography>
          </div>
          
          {/* Navigation links - center aligned with flex-1 and justify-center */}
          <div className="flex-1 flex justify-center -ml-20">
            <div className="flex items-center gap-2">
              {/* Apply as talent - shown when not logged in OR candidate */}
              {!isAdmin && showApplyAsTalent && (
                <Link className="hidden lg:inline-block" to='/jobs'>
                  <Button variant="ghost" size="md" className="text-[#c5c5c5] border-none">
                    Apply as talent
                  </Button>
                </Link>
              )}
              
              {/* Divider line that fades at top and bottom */}
              {!isAdmin && showApplyAsTalent && showPostJob && (
                <div className="hidden lg:block h-8 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent mx-1"></div>
              )}
              
              {/* Post a Job - shown when not logged in OR recruiter */}
              {!isAdmin && showPostJob && (
                <Link className="hidden lg:inline-block" to='/dashboard'>
                  <Button variant="ghost" size="md" className="text-[#c5c5c5] border-none">
                    Post a Job
                  </Button>
                </Link>
              )}
              
              {/* Show "Add Company" only when admin */}
              {showAddCompany && (
                <Link className="hidden lg:inline-block" to='/add-company'>
                  <Button variant="ghost" size="md" className="text-[#c5c5c5] border-none">
                    Add Company
                  </Button>
                </Link>
              )}
            </div>
          </div>
          
          {/* User actions - right aligned */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div className="relative">
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg" alt="User" />
                        <AvatarFallback>
                          {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    className="w-56 text-gray-200 bg-black border-[#ffffff1a] p-3" 
                    align="end" 
                    forceMount
                    sideOffset={5}
                    side="bottom"
                    avoidCollisions={true}
                    collisionPadding={{ top: 10, right: 10, bottom: 10, left: 10 }}
                  >
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuGroup>
                      <Link to="/dashboard"> 
                        <DropdownMenuItem className="mt-2 cursor-pointer">
                          {isCandidate ? 'Profile' : 'Dashboard'}
                        </DropdownMenuItem>
                      </Link>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator className="bg-[#ffffff2a] mx-1"/>
                    <DropdownMenuItem className="text-red-500 cursor-pointer" onClick={handleLogout}>
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Button 
                variant="outline" 
                size="md" 
                className="hidden lg:inline-block border-none bg-green-500 text-white hover:bg-green-700 hover:text-white transition-none" 
                onClick={()=>navigate('/auth/login')}
              >
                Login
              </Button>
            )}
            
            <IconButton
              size="sm"
              variant="ghost"
              color="secondary"
              onClick={() => setOpenNav(!openNav)}
              className="grid lg:hidden border-slate-700"
            >
              {openNav ? (
                <Xmark className="h-4 w-4" color="white" />
              ) : (
                <Menu className="h-4 w-4" color="white" />
              )}
            </IconButton>
          </div>
        </div>
        
        <Collapse open={openNav}>
          <NavList />
          <div className="flex flex-col justify-start items-center px-2 pb-3 gap-3">
            {/* Mobile menu items - also conditionally rendered based on role */}

              {/* Show profile/dashboard link in mobile view when logged in */}
              {isLoggedIn && !isAdmin && (
              <Link className="w-full" to='/dashboard'>
                <Button 
                  className="text-sm w-full text-center p-3 rounded-sm border-none hover:border-none bg-blue-700 text-white hover:bg-blue-800"
                >
                  {isCandidate ? 'Profile' : 'Dashboard'}
                </Button>
              </Link>
            )}

            {/* Apply as talent in mobile view */}
            {!isAdmin && showApplyAsTalent && (
              <Link className="w-full" to='/jobs'>
                <Button 
                  className="text-sm w-full border-none text-center p-3 rounded-sm hover:border-none bg-blue-700 text-white hover:bg-blue-800"
                >
                  Apply as talent
                </Button>
              </Link>
            )}
            
            {/* Post a Job in mobile view */}
            {!isAdmin && showPostJob && (
              <Link className="w-full" to='/dashboard'>
                <Button 
                  className="text-sm w-full text-center p-3 rounded-sm hover:border-none border-none bg-blue-700 text-white hover:bg-blue-800"
                >
                  Post a Job
                </Button>
              </Link>
            )}
            
            {/* Add Company in mobile view */}
            {showAddCompany && (
              <Link className="w-full" to='/add-company'>
                <Button 
                  className="text-sm border-none w-full text-center p-3 rounded-sm hover:border-none bg-blue-700 text-white hover:bg-blue-800"
                >
                  Add Company
                </Button>
              </Link>
            )}
            
            {/* Show logout button in mobile view when logged in */}
            {isLoggedIn && (
              <Button 
                variant="outline" 
                size="md" 
                className="text-sm w-full text-center p-3 rounded-sm hover:text-white border-none bg-red-500 text-white hover:bg-red-700" 
                onClick={handleLogout}
              >
                Log out
              </Button>
            )}
            
            {/* Login button in mobile view when not logged in */}
            {!isLoggedIn && (
              <Button 
                variant="outline" 
                size="md" 
                className="text-sm w-full text-center p-3 hover:text-white rounded-sm border-none bg-green-500 text-white hover:bg-green-700" 
                onClick={()=>navigate('/auth/login')}
              >
                Login
              </Button>
            )}
          </div>
        </Collapse>
      </Navbar>
    </div>
  );
}