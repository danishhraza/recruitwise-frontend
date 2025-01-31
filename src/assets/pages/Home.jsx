import { useEffect, useState } from "react"
import RWloading from "../components/RWloading"
import { Button, ConfigProvider } from "antd"
import WebcamComp from "../components/WebcamComp"
import VideoCall from "../components/VideoCall"
import { useNavigate } from "react-router-dom"
import { v4 as uuidV4 } from 'uuid';
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
      {loading ? <RWloading />: <div className="flex-col "> <div className="title">
        <h1 className="gabarito-400 text-white text-7xl md:text-9xl">
      Recruit Wise
    </h1>
    <div className="w-full  flex justify-center gap-5 mt-5">
        <button className="bg-purple-600 hover:bg-purple-900 w-[100px] gabarito-400 py-1 px-2 rounded-[8px] hover:cursor-pointer text-white ">
           Start Demo
        </button>
        <button onClick={()=> openCallPage()} className="bg-white hover:bg-slate-200 w-[100px] gabarito-400 py-1 px-2 rounded-[8px] hover:cursor-pointer ">
           Capture
        </button>
    </div>
    </div>
    </div>}
  
    </div>
    </>
  )
}

export default Home
