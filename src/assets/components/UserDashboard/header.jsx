import { Bell, Search } from "lucide-react"
import { Link } from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "../../../components/ui/avatar"
import { Button } from "../../../components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu"
import { Input } from "../../../components/ui/input"
import { SidebarTrigger } from "../../../components/ui/sidebar"
import { ModeToggle } from "../mode-toggle"
import axios from "../../../api/axios";
import { message } from 'antd'
import useGeneral from "../../../hooks/useGeneral";
import { useNavigate } from "react-router-dom";

export function UserDashboardHeader() {
  const {isLoggedIn, user, setIsLoggedIn, setUser} = useGeneral();
  const navigate = useNavigate();

    const handleLogout = async () => {
      try {
        const response = await axios.post('/auth/logout');
        message.success('Logout successful!');
        setIsLoggedIn(false)
        setUser(null)
        navigate("/auth/login")
      } catch (error) {
        console.error('Logout failed:', error);
      }
    };


  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6 text-muted-foreground">
      <SidebarTrigger />

      <div className="ml-auto flex items-center gap-2">
        <ModeToggle className="md:hidden" />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.profilePicture} alt={user.name} />
                <AvatarFallback>{user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500 cursor-pointer" onClick={handleLogout}>
                      Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

