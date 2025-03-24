import JobPostingForm from "./Job-Posting-Form-Home";
import VideoChat from "./ai-interview-home";
import InterviewResultDashboard from "./interview-results-home";

function MobileSnapScroll() {
    return (
        <div className="w-full bg-[#3c50e6] py-6 mt-20 rounded-md">
            <div className="p-4 text-white flex flex-col justify-center items-center">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold my-8 text-center">Input Your Hiring Requirements</h2>
                    <JobPostingForm />
                </div>

                <div className="mb-8">
                    <h2 className="text-3xl font-bold my-8 text-center">AI Interview Process</h2>
                    <VideoChat />
                </div>

                <div className="mb-8">
                    <h2 className="text-3xl font-bold my-8 text-center">Interview Results Dashboard</h2>
                    <InterviewResultDashboard />
                </div>
            </div>
        </div>
    )
}

export default MobileSnapScroll;