import { useEffect, useState, useRef } from "react"
import { Button, ConfigProvider } from "antd"
import VideoCall from "../components/VideoCall"
import { useNavigate, useOutletContext } from "react-router-dom"
import { v4 as uuidV4 } from 'uuid';
import bannerImage from "../../images/banner.webp";
import Profiles from "../components/ProfilesBanner";
import InterviewPlatform from "../components/candidate-profile-home";
import SnapScroll from "../components/SnapScroll"
import MobileSnapScroll from "../components/MobileSnapScroll"
import Spline from '@splinetool/react-spline';

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
    <div className="absolute top-0 h-screen w-full">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#000] pointer-events-none"></div>
      <Spline
        scene="https://prod.spline.design/mn2BmX-VXN0j9MpG/scene.splinecode"
        className="z-0"
      />
    </div>
      <div className="h-[35rem] border-white/20 border shadow-lg backdrop-filter backdrop-blur-lg mx-[2rem] md:mx-[3rem] rounded-[15px] mt-10 justify-center flex flex-col relative overflow-hidden">
        {/* <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${bannerImage})`, opacity: 0.9 }}
        ></div> */}
        
        <div className="text-center flex flex-col gap-6 relative"> 
          <h1 className="outfit-600 text-center text-white text-4xl md:text-8xl">
            <span className="bg-gradient-to-r from-[#484cb2] text-transparent to-[rgb(64,64,246)] bg-clip-text">AI </span>Recruitment engine<br/> to hire top global talent
          </h1>
          <p className="text-slate-100 mt-10 text-lg md:text-xl">Source, vet, and hire top talent in less than 24h</p>
        </div>
        <div className="w-full flex justify-center gap-5 mt-5 relative">
          <Button color="primary" variant="solid" onClick={() => navigate('/jobs')}>View Jobs</Button>
          <Button onClick={() => openCallPage()} className="bg-white hover:bg-slate-200 w-[200px] outfit-400 py-1 px-2 rounded-[8px] hover:cursor-pointer">
            Start Interview Practice
          </Button>
        </div>
  
      </div>

      <div>
        <Profiles/>
      </div>

      <div 
        ref={interviewRef}
        className="md:mt-[17rem] mt-[10rem] flex flex-col justify-center items-center relative"
      >
        {/* Title with animation */}
        <h1 
          className={`text-4xl md:text-6xl font-outfit font-bold text-white mb-14 relative transition-all duration-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          Quality hires, quickly.
        </h1>
        
        {/* Background pattern div with animation */}
        <div className="absolute h-full w-full">
          <div 
            className={`h-full w-full bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-[size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] transition-all duration-700 ${
              isVisible ? 'opacity-40' : 'opacity-0'
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

      <div className="hidden md:block">
        <SnapScroll/>
      </div>
      <div className="md:hidden">
        <MobileSnapScroll/>
      </div>
      
{/* Image above footer */}
<div className="relative md:block hidden mt-28">
  <div className="absolute bottom-[-200px] md:bottom-[-250px] lg:bottom-[-280px] left-0 w-full">
    <div className="mx-auto px-8">
      <img 
        src="/images/footer.jpg" 
        alt="Footer Logo" 
        className="w-full object-contain mb-10" 
      />
    </div>
  </div>
</div>

  </>
  )
}

export default Home