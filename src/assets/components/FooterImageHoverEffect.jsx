import React, { useState, useRef, useEffect } from 'react';

const FooterImageWithLightEffect = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  // Handle mouse movement
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  return (
    <div className="relative md:block hidden mt-28">
      <div className="absolute bottom-[-200px] md:bottom-[-210px] lg:bottom-[-250px] left-0 w-full">
        <div 
          ref={containerRef}
          className="mx-auto px-8 relative"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <img 
            src="/images/footer.jpg" 
            alt="Footer Logo" 
            className="w-full object-contain mb-10 relative" 
          />
          
          {/* Light effect overlay */}
          <div 
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{ top: 0, left: 0, width: '100%', height: '100%' }}
          >
            {isHovering && (
              <div 
                className="absolute pointer-events-none rounded-full"
                style={{
                  top: 0,
                  left: 0,
                  width: '200px',
                  height: '200px',
                  transform: `translate(${mousePos.x - 100}px, ${mousePos.y - 100}px)`,
                  background: 'radial-gradient(circle 100px, rgba(255, 255, 255, 0.95), transparent)',
                  mixBlendMode: 'soft-light',
                  willChange: 'transform',
                  zIndex: 2
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterImageWithLightEffect;