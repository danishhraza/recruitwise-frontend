import JobPostingForm from "./Job-Posting-Form-Home"

function SnapScroll() {
    return (
      <div className="flex w-full mt-60">
        {/* Sticky Left Side */}
        <div className="w-1/2 h-screen sticky top-0 bg-[#3c50e6] text-white p-8 flex flex-col text-left justify-center pl-60">
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
                            {num === 2 && 'Use AI Recruiter to source and interview 1000s of candidates'}
                            {num === 3 && 'Let AI match you with the best talent'}
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
                        <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xl">
                        <div className="flex items-center mb-4">
                            <div className="bg-blue-100 rounded-md p-2">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                            </div>
                            <span className="ml-2">AI Recruiter</span>
                        </div>
                        <div className="flex items-center justify-center p-8">
                            <div className="relative w-full">
                            <div className="flex items-center justify-center">
                                <div className="relative w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center border-4 border-blue-300">
                                <div className="absolute inset-0 rounded-full animate-pulse bg-blue-400 opacity-30"></div>
                                <div className="text-2xl font-bold text-blue-800">Rw.</div>
                                </div>
                            </div>
                            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                                <p className="text-sm">Great! I'm here to help you with getting to know your job?</p>
                                <p className="text-sm mt-1">Tell me more about what you're looking for, so I can find the perfect match.</p>
                                <div className="mt-4 flex">
                                <button className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs">Record</button>
                                <button className="ml-4 bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs">Clear messaging? Continue</button>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    <div className="h-screen p-8 flex items-center justify-center" style={{ scrollSnapAlign: 'start' }}>
                    <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-xl">
                    <div className="flex items-center mb-6">
                        <div className="bg-green-100 rounded-full p-1">
                        <svg className="w-4 h-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        </div>
                        <span className="ml-2 text-green-600 text-sm">AI Match Found</span>
                    </div>
                    <div className="flex">
                        <div className="mr-4">
                        <img src="/api/placeholder/60/60" alt="Profile" className="rounded-full" />
                        </div>
                        <div>
                        <div className="flex items-center">
                            <h3 className="font-medium">Candidate</h3>
                            <div className="ml-2 text-green-500">
                            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            </div>
                        </div>
                        <p className="text-sm text-gray-600">Software Engineer</p>
                        <div className="flex items-center mt-1">
                            <svg className="w-4 h-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-xs text-gray-500 ml-1">Location</span>
                        </div>
                        </div>
                    </div>
                    <div className="mt-6">
                        <p className="text-center text-lg font-medium">Perfect match for your requirements</p>
                    </div>
                    </div>
                </div>
        </div>
      </div>
    )
  }
  
  export default SnapScroll
  