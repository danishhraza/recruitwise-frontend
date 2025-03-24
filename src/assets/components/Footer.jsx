import { useState } from 'react';

export default function ResendFooterWithLogo() {
  const [isOperational, setIsOperational] = useState(true);
  
  return (
    <div className="relative bg-[#000] text-white min-h-screen">
      {/* Logo positioned to be partially hidden by footer */}
      <div className="absolute bottom-[110px] left-0 right-0 px-8">
        <img src="../../images/footer.jpg" alt="" />
      </div>
      
      {/* Footer container */}
      <footer className="absolute bottom-0 w-full bg-[#000] py-12 px-8 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
            {/* Column 1: Address and Socials */}
            <div className="space-y-6">
              <div>
                <p className="text-gray-400 text-sm">2261 Market Street #5039</p>
                <p className="text-gray-400 text-sm">San Francisco, CA 94114</p>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400 text-sm">Backed by</span>
                  <span className="bg-gray-800 p-1 text-white text-xs">Y</span>
                  <span className="text-gray-400 text-sm">Combinator</span>
                </div>
                
                <div className="flex space-x-3">
                  <div className="bg-gray-800 p-2 rounded-full w-8 h-8 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                    </svg>
                  </div>
                  <div className="bg-gray-800 p-2 rounded-full w-8 h-8 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                      <rect x="2" y="9" width="4" height="12"></rect>
                      <circle cx="4" cy="4" r="2"></circle>
                    </svg>
                  </div>
                  <div className="bg-gray-800 p-2 rounded-full w-8 h-8 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                  </div>
                  <div className="bg-gray-800 p-2 rounded-full w-8 h-8 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                <span className="text-gray-400 text-sm">All systems operational</span>
              </div>
            </div>
            
            {/* Column 2: Documentation */}
            <div>
              <h3 className="font-medium text-white mb-4">Documentation</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">Getting Started</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">API Reference</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">Integrations</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">Examples</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">SDKs</a></li>
              </ul>
            </div>
            
            {/* Column 3: Resources */}
            <div>
              <h3 className="font-medium text-white mb-4">Resources</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">Changelog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">Security</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">SOC 2</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">GDPR</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">Status</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">Brand</a></li>
              </ul>
            </div>
            
            {/* Column 4: Company */}
            <div>
              <h3 className="font-medium text-white mb-4">Company</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">About</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">Customers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-sm">Philosophy</a></li>
              </ul>
            </div>
            
            {/* Column 5: Handbook & Legal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-medium text-white mb-4">Handbook</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="text-gray-400 hover:text-white text-sm">Why we exist</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white text-sm">How we work</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white text-sm">Engineering</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white text-sm">Design</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white text-sm">Support</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white text-sm">Marketing</a></li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-white mb-4">Legal</h3>
                <ul className="space-y-3">
                  <li><a href="#" className="text-gray-400 hover:text-white text-sm">Acceptable Use</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white text-sm">Cookie Policy</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white text-sm">Privacy Policy</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white text-sm">Terms of Service</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white text-sm">Subprocessors</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white text-sm">DPA</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}