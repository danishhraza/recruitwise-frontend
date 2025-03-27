import { useState } from 'react';

export default function ResendFooterWithLogo() {
  return (
    <footer className="bg-[#000] z-10 text-white py-12 px-8 border-t border-gray-800">
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
                {/* Social icons remain the same */}
                {/* ... */}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className="h-2 w-2 bg-green-500 rounded-full"></span>
              <span className="text-gray-400 text-sm">All systems operational</span>
            </div>
          </div>
          
          {/* Other columns remain the same */}
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
        </div>
      </div>
    </footer>
  );
}