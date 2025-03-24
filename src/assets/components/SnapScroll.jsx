import JobPostingForm from "./Job-Posting-Form-Home";
import VideoChat from "./ai-interview-home";
import InterviewResultDashboard from "./interview-results-home";

function SnapScroll() {
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
                        <div className="w-12 h-12 rounded-full flex items-center justify-center z-10 bg-gray-100 text-gray-700">{num}</div>
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
        <div className="w-1/2 snap-y snap-mandatory flex flex-col ">
            <div className="h-screen p-8 flex items-center justify-center" style={{ scrollSnapAlign: 'start' }}>
                    <JobPostingForm/>
            </div>
            <div className="h-screen p-8 flex items-center justify-center" style={{ scrollSnapAlign: 'start' }}>
                    <VideoChat/>
            </div>
            <div className="h-screen p-8 flex items-center justify-center" style={{ scrollSnapAlign: 'start' }}>
                   <InterviewResultDashboard/>
                </div>
        </div>
      </div>
    )
  }
  
  export default SnapScroll
  