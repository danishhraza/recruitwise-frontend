import { useEffect, useState } from "react"
import RWloading from "../components/RWloading"
import { Button, ConfigProvider } from "antd"
import VideoCall from "../components/VideoCall"
import { useNavigate } from "react-router-dom"
import { v4 as uuidV4 } from 'uuid';
import Navbar from "../components/Navbar"
function Home() {
  const [loading,setLoading] = useState(false)
  const [capture,setCapture] = useState(false)
  const navigate = useNavigate();
  useEffect(()=>{
    setLoading(true)
    setTimeout(()=>{
      setLoading(false)
    },3000)
  },[])
  const generateUniqueId = () => {
    return `${uuidV4()}-${Date.now()}`;
  };
  function openCallPage(){
    const uniqueId = generateUniqueId();
    navigate(`/room/${uniqueId}`)
  }
  return (
    <>
    <div className="bg-black w-full h-screen flex justify-center items-center overflow-auto">
    {loading ? <RWloading /> : 
    <><Navbar/>
        <div className="flex-col "> 
          <div className="title">
            <div className="text-center flex flex-col gap-6">
        <h1 className="gabarito-400 text-center text-white text-7xl md:text-9xl">
        <span className="bg-gradient-to-r from-blue-400 to-blue-200 text-transparent bg-clip-text">
  AI Recruitment engine
</span><br/> to hire top global talent
    </h1>
    <p className="text-slate-300">Source, vet, and hire top talent in less than 24h</p>
            </div>
    <div className="w-full  flex justify-center gap-5 mt-5">
    <Button color="primary" variant="solid">Create an account</Button>
        <Button onClick={()=> openCallPage()} className="bg-white hover:bg-slate-200 w-[100px] gabarito-400 py-1 px-2 rounded-[8px] hover:cursor-pointer ">
           Book a demo
        </Button>
    </div>
    </div>
    </div>
  
    </>
    }
    </div>
    </>
  )
}

export default Home
