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
import useGeneral from "../../hooks/useGeneral";
import axios from "../../api/axios";

const LINKS = [
  // {
  //   icon: MultiplePages,
  //   title: "Pages",
  //   href: "#",
  // },
  // {
  //   icon: ProfileCircle,
  //   title: "Account",
  //   href: "#",
  // },
  // {
  //   icon: SelectFace3d,
  //   title: "Blocks",
  //   href: "#",
  // },
  // {
  //   icon: Archive,
  //   title: "Docs",
  //   href: "#",
  // },
];

function NavList() {
  const {isLoggedIn} = useGeneral()

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
  const navigate = useNavigate()
  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false),
    );
  }, []);

  return (
    <Navbar className="z-10 fixed lg:top-5 left-0 right-0 md:mx-auto w-full rounded-none border-b-2 border-x-0 border-t-0 border-blue-500 lg:rounded-lg max-w-screen-xl text-white bg-[#3f3f3f89] dark:bg-surface-dark backdrop-blur-xl px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex">

          <Typography
            as="a"
            href="/"
            type="small"
            className="ml-2 mr-2 block py-1 font-semibold"
          >
            <img src="/images/logo-white.webp" alt="logo" className="w-36"/>
          </Typography>
          <div className="hidden lg:block">
            <NavList />
          </div>
            </div>
          <div className="flex gap-4 items-center">

          <Link className="hidden lg:inline-block text-[1rem]" to='/jobs'>Apply as talent</Link>
          <Link to='/recruiter-dashboard'>
          <Button isPill size="md" className="hidden lg:inline-block bg-blue-700 text-white border-none hover:bg-blue-800">
            Post a Job
          </Button>
          </Link>
          <Button isPill variant="outline" size="md" className="hidden lg:inline-block border-none bg-green-500 text-white hover:bg-green-700" onClick={()=>navigate('/auth/login')}>
            Login
          </Button>
          </div>
          <IconButton
            size="sm"
            variant="ghost"
            color="secondary"
            onClick={() => setOpenNav(!openNav)}
            className="ml-auto grid lg:hidden border-slate-700"
          >
            {openNav ? (
              <Xmark className="h-4 w-4" color="white" />
            ) : (
              <Menu className="h-4 w-4" color="white" />
            )}
          </IconButton>
        </div>
        <Collapse open={openNav}>
          <NavList />
          <div className="flex flex-col justify-start items-center px-2 pb-3 gap-3">
          <Link className="text-sm border-[1px] w-full text-center p-3 rounded-sm hover:bg-white hover:text-black" to='/jobs'>Apply as talent</Link>
 
          <Button className="text-sm border-[1px] w-full text-center p-3 rounded-sm border-none bg-blue-700 text-white  hover:bg-blue-800" onClick={()=>navigate('/recruiter-dashboard')}>
            Post a Job
          </Button>

          <Button variant="outline" size="sm" className="text-sm border-[1px] w-full text-center p-3 rounded-sm border-none bg-green-500 text-white hover:bg-green-700" onClick={()=>navigate('/auth/login')}>
            Login
          </Button>
          </div>
        </Collapse>
      </Navbar>
  );
}
