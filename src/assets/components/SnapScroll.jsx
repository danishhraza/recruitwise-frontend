import React, { useRef, useEffect, useState } from 'react';
import JobPostingForm from "./Job-Posting-Form-Home";
import VideoChat from "./ai-interview-home";
import InterviewResultDashboard from "./interview-results-home";

function SnapScroll() {
    const section1Ref = useRef(null);
    const section2Ref = useRef(null);
    const section3Ref = useRef(null);
    const [visibleSection, setVisibleSection] = useState(0);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        if (entry.target === section1Ref.current) setVisibleSection(0);
                        if (entry.target === section2Ref.current) setVisibleSection(1);
                        if (entry.target === section3Ref.current) setVisibleSection(2);
                    }
                });
            },
            { 
                threshold: 0.5 // Trigger when at least 50% of the section is visible
            }
        );

        const currentSection1 = section1Ref.current;
        const currentSection2 = section2Ref.current;
        const currentSection3 = section3Ref.current;

        if (currentSection1) observer.observe(currentSection1);
        if (currentSection2) observer.observe(currentSection2);
        if (currentSection3) observer.observe(currentSection3);

        return () => {
            if (currentSection1) observer.unobserve(currentSection1);
            if (currentSection2) observer.unobserve(currentSection2);
            if (currentSection3) observer.unobserve(currentSection3);
        };
    }, []);

    return (
      <div className="flex w-full mt-60">
        {/* Sticky Left Side */}
        <div className="w-1/2 h-screen sticky top-0 bg-[#3c50e6] text-white p-8 flex flex-col text-left justify-left md:justify-center lg:pl-60">
            <h1 className="text-4xl font-bold mb-12">How it works</h1>
            <div className="relative">
                <div className="absolute left-6 top-0 w-0.5 h-full bg-gray-200"></div>
                <div className="space-y-16">
                    {[1, 2, 3].map((num) => (
                    <div className="flex items-start cursor-pointer" key={num}>
                        <div 
                            className={`w-12 h-12 rounded-full flex items-center justify-center z-10 
                                ${visibleSection >= num - 1 
                                    ? 'bg-green-500 text-white' 
                                    : 'bg-gray-100 text-gray-700'}`}
                        >
                            {num}
                        </div>
                        <div className="ml-4">
                        <p className="font-medium text-lg">
                            {num === 1 && 'Input your hiring requirements'}
                            {num === 2 && 'Use AI Recruiter to interview 1000s of candidates'}
                            {num === 3 && 'Let AI find you the best talent'}
                        </p>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        </div>
  
        {/* Scrollable Right Side with Snap Sections */}
        <div className="w-1/2 snap-y snap-mandatory flex flex-col">
            <div 
                ref={section1Ref}
                className="h-screen p-8 flex items-center justify-center" 
                style={{ scrollSnapAlign: 'start' }}
            >
                <JobPostingForm/>
            </div>
            <div 
                ref={section2Ref}
                className="h-screen p-8 flex items-center justify-center" 
                style={{ scrollSnapAlign: 'start' }}
            >
                <VideoChat/>
            </div>
            <div 
                ref={section3Ref}
                className="h-screen p-8 flex items-center justify-center" 
                style={{ scrollSnapAlign: 'start' }}
            >
               <InterviewResultDashboard/>
            </div>
        </div>
      </div>
    )
  }
  
  export default SnapScroll