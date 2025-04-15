import { GalleryVerticalEnd } from "lucide-react"
import RegisterComponent from "../components/RegisterComponent"
import { ThemeProvider } from "../components/theme-provider";

export default function LoginPage() {
  return (
    <ThemeProvider defaultTheme="dark">
    <div className="grid h-screen lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="/" className="flex items-center gap-2 font-medium text-foreground">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            RecruitWise
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <RegisterComponent />
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <img
          src="https://login.epidemicsound.com/auth/resources/x14jy/login/epidemicsound/img/login.webp"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
    </ThemeProvider>
  )
}
