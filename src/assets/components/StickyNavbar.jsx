import * as React from "react";
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
import { Link } from "react-router-dom";

const LINKS = [
  {
    icon: MultiplePages,
    title: "Pages",
    href: "#",
  },
  {
    icon: ProfileCircle,
    title: "Account",
    href: "#",
  },
  {
    icon: SelectFace3d,
    title: "Blocks",
    href: "#",
  },
  {
    icon: Archive,
    title: "Docs",
    href: "#",
  },
];

function NavList() {
  return (
    <ul className="mt-4 flex flex-col gap-x-3 gap-y-1.5 lg:mt-0 lg:flex-row text-white lg:items-center">
      {LINKS.map(({ icon: Icon, title, href }) => (
        <li key={title}>
          <Typography
            as="a"
            href={href}
            type="small"
            className="flex items-center gap-x-2 p-1 hover:text-primary"
          >
            <Icon className="h-4 w-4" />
            {title}
          </Typography>
        </li>
      ))}
    </ul>
  );
}

export default function StickyNavbar() {
  const [openNav, setOpenNav] = React.useState(false);

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false),
    );
  }, []);

  return (
      <Navbar className="z-10 sticky top-0 mx-auto w-full max-w-screen-xl text-white bg-black dark:bg-surface-dark border-slate-800 px-2">
        <div className="flex items-center justify-between">
          <div className="flex">

          <Typography
            as="a"
            href="#"
            type="small"
            className="ml-2 mr-2 block py-1 font-semibold"
          >
            <img src="/images/logo2-white.webp" alt="logo" className="w-32"/>
          </Typography>
          <div className="hidden lg:block">
            <NavList />
          </div>
            </div>
          <div className="flex gap-3 items-center">

          <Link className="hidden lg:inline-block text-[0.8rem]">Apply as talent</Link>
          <Button isPill size="sm" className="hidden lg:inline-block bg-blue-700 text-white  hover:bg-blue-800">
            Book a demo
          </Button>
          <Button isPill variant="outline" size="sm" className="hidden lg:inline-block bg-blue-950 text-white hover:bg-blue-900">
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
          <div className="flex justify-end items-center px-2 gap-2">
          <Link className="text-[0.8rem]">Apply as talent</Link>
          <Button isPill size="sm" className="bg-blue-700 text-white  hover:bg-blue-800">
            Book a demo
          </Button>
          <Button isPill variant="outline" size="sm" className="bg-blue-950 text-white hover:bg-blue-900">
            Login
          </Button>
          </div>
        </Collapse>
      </Navbar>
  );
}
