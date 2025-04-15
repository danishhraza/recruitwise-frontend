import { Bell, Search } from "lucide-react"
import useGeneral from "../../../hooks/useGeneral";
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


export function DashboardHeader() {
  const {isLoggedIn, user, setIsLoggedIn, setUser} = useGeneral();

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

  
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6 text-muted-foreground">
      <SidebarTrigger />

      <div className="hidden w-full max-w-sm md:flex">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search..."
            className="w-full rounded-lg bg-background pl-8 md:w-[300px] lg:w-[400px]"
          />
        </div>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <ModeToggle className="md:hidden" />
        <Button variant="outline" size="icon" className="relative">
          <Bell className="h-4 w-4" />
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
            3
          </span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" alt="User" />
                <AvatarFallback>{user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                <p className="text-xs leading-none text-primary">{user.role}</p>
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

