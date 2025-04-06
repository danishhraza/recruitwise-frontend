export default function Profiles() {
  return (
    <div className="relative hidden mt-20 md:-mt-16 md:mb-16 lg:flex flex-col md:flex-row justify-center items-center gap-5 md:gap-10 px-10">
      <div className="flex bg-[#151B23] shadow-lg rounded-lg p-4 gap-4 max-w-lg w-full md:w-auto">
        <div className="flex-shrink-0">
          <img
            className="w-24 h-24 rounded-full"
            src="https://randomuser.me/api/portraits/men/15.jpg"
            alt="User"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h3 className="font-semibold text-xl text-white">Danish</h3>
          <p className="text-gray-100">Software Engineer</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-sm">Typescript</span>
            <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-sm">AWS</span>
            <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-sm">Full Stack</span>
          </div>
          <p className="mt-3 text-gray-200">$16,401/month</p>
        </div>
      </div>
      
      <div className="flex bg-[#3c50e6] shadow-lg rounded-lg p-4 gap-4 max-w-lg w-full md:w-auto mt-4 md:mt-0">
        <div className="flex-shrink-0">
          <img
            className="w-24 h-24 rounded-full"
            src="https://randomuser.me/api/portraits/women/8.jpg"
            alt="User"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h3 className="font-semibold text-xl text-white">Grace</h3>
          <p className="text-gray-100">Talent Recruiter</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-sm">Onboarding</span>
            <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-sm">Interviewing</span>
            <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-sm">CRM</span>
          </div>
          <p className="mt-3 text-gray-200">$2,401/month</p>
        </div>
      </div>
      
      <div className="flex bg-[#151B23] shadow-lg rounded-lg p-4 gap-4 max-w-lg w-full md:w-auto mt-4 md:mt-0">
        <div className="flex-shrink-0">
          <img
            className="w-24 h-24 rounded-full"
            src="https://randomuser.me/api/portraits/men/3.jpg"
            alt="User"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h3 className="font-semibold text-xl text-white">Shaheer</h3>
          <p className="text-gray-100">Data Engineer</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-sm">Python</span>
            <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-sm">Azure</span>
            <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full text-sm">Databricks</span>
          </div>
          <p className="mt-3 text-gray-200">$6,401/month</p>
        </div>
      </div>
    </div>
  );
}