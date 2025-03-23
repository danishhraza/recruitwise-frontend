import { useEffect, useState, useRef } from "react"
import RWloading from "../components/RWloading"
import { Button, ConfigProvider } from "antd"
import VideoCall from "../components/VideoCall"
import { useNavigate, useOutletContext } from "react-router-dom"
import { v4 as uuidV4 } from 'uuid';
import bannerImage from "../../images/banner.webp";
import Profiles from "../components/ProfilesBanner";
import InterviewPlatform from "../components/candidate-profile-home";
import SnapScroll from "../components/SnapScroll"

function Home() {
  const {loading} = useOutletContext();
  const [capture, setCapture] = useState(false);
  const navigate = useNavigate();
  const interviewRef = useRef(null);
  const stickyTextRef = useRef(null);
  const stickyContainerRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  
  // Use Intersection Observer directly
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    
    if (interviewRef.current) {
      observer.observe(interviewRef.current);
    }
    
    return () => {
      if (interviewRef.current) {
        observer.unobserve(interviewRef.current);
      }
    };
  }, []);

  const generateUniqueId = () => {
    return `${uuidV4()}-${Date.now()}`;
  };
  
  function openCallPage(){
    const uniqueId = generateUniqueId();
    navigate(`/room/${uniqueId}`)
  }

  return (
    <>
      <div className="h-[40rem] mx-[3rem] rounded-[15px] pt-20 relative overflow-hidden">
        {/* Background image with blur */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bannerImage})`, opacity: 0.6 }}
        ></div>
        <div className="text-center flex flex-col gap-6 relative"> 
          <h1 className="outfit-600 text-center text-white text-6xl md:text-8xl">
            <span className="bg-gradient-to-r from-[#1f2154] text-transparent to-[#5656a7] bg-clip-text">AI Recruitment engine</span><br/> to hire top global talent
          </h1>
          <p className="text-slate-300 mt-10 text-xl">Source, vet, and hire top talent in less than 24h</p>
        </div>
        <div className="w-full flex justify-center gap-5 mt-5 relative">
          <Button color="primary" variant="solid" onClick={() => navigate('/jobs')}>View Jobs</Button>
          <Button onClick={() => openCallPage()} className="bg-white hover:bg-slate-200 w-[100px] outfit-400 py-1 px-2 rounded-[8px] hover:cursor-pointer">
            Hire Talents
          </Button>
        </div>
      </div>

      <div>
        <Profiles/>
      </div>

      <div 
        ref={interviewRef}
        className="mt-[17rem] flex flex-col justify-center items-center relative"
      >
        {/* Title with animation */}
        <h1 
          className={`text-6xl font-outfit font-bold text-white mb-14 relative transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Quality matches, quickly.
        </h1>
        
        {/* Background pattern div with animation */}
        <div className="absolute h-full w-full">
          <div 
            className={`h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] transition-all duration-700 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
          ></div>
        </div>
        
        {/* Interview Platform with animation */}
        <div 
          className={`w-full flex justify-center transition-all duration-700 delay-200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <InterviewPlatform />
        </div>
      </div>

      <div>
        <SnapScroll/>
      </div>

    </>
  )
}

export default Home