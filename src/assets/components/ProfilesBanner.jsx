import React from 'react';

function Profiles() {
  return (
    <div className="absolute inset-x-0 top-[70%] p-6 flex justify-center gap-5 overflow-hidden">
      <div className="flex bg-white shadow-lg rounded-lg p-4 gap-4 max-w-lg">
        <div className="flex-shrink-0">
          <img
            className="w-24 h-24 rounded-full"
            src="https://randomuser.me/api/portraits/men/15.jpg"
            alt="User"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h3 className="font-semibold text-xl">Danish</h3>
          <p className="text-gray-500">Software Engineer</p>
          <div className="flex gap-2 mt-2">
            <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full">Typescript</span>
            <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full">AWS</span>
            <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full">Full Stack</span>
          </div>
          <p className="mt-3 text-gray-700">$16,401/month</p>
        </div>
        
      </div>
      <div className="flex bg-white shadow-lg rounded-lg p-4 gap-4 max-w-lg">
        <div className="flex-shrink-0">
          <img
            className="w-24 h-24 rounded-full"
            src="https://randomuser.me/api/portraits/women/8.jpg"
            alt="User"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h3 className="font-semibold text-xl">Grace</h3>
          <p className="text-gray-500">Talent Recruiter</p>
          <div className="flex gap-2 mt-2">
            <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full">Dance</span>
            <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full">Social Media</span>
            <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full">Eating</span>
          </div>
          <p className="mt-3 text-gray-700">$2,401/month</p>
        </div>
        
      </div>
      <div className="flex bg-white shadow-lg rounded-lg p-4 gap-4 max-w-lg">
        <div className="flex-shrink-0">
          <img
            className="w-24 h-24 rounded-full"
            src="https://randomuser.me/api/portraits/men/3.jpg"
            alt="User"
          />
        </div>
        <div className="flex flex-col justify-center">
          <h3 className="font-semibold text-xl">Shaheer</h3>
          <p className="text-gray-500">Data Engineer</p>
          <div className="flex gap-2 mt-2">
            <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full">Python</span>
            <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full">Azure</span>
            <span className="bg-blue-200 text-blue-800 px-2 py-1 rounded-full">Databricks</span>
          </div>
          <p className="mt-3 text-gray-700">$6,401/month</p>
        </div>
        
      </div>
    </div>
    
  );
}

export default Profiles;
