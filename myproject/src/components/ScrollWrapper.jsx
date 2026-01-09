import React, { useEffect, useRef } from 'react';

const ScrollWrapper = ({ children }) => {
  const wrapperRef = useRef(null);

  useEffect(() => {
    // Multiple aggressive scroll-to-top methods
    const scrollToTop = () => {
      // Method 1: Immediate scroll to top
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      
      // Method 2: Scroll the wrapper element if it exists
      if (wrapperRef.current) {
        wrapperRef.current.scrollTop = 0;
      }
      
      // Method 3: Try to scroll all scrollable elements to top
      const scrollableElements = document.querySelectorAll('[style*="overflow"]');
      scrollableElements.forEach(element => {
        element.scrollTop = 0;
      });
      
      // Method 4: Force scroll using requestAnimationFrame
      requestAnimationFrame(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      });
    };

    // Run immediately
    scrollToTop();
    
    // Run again after a short delay
    const timer1 = setTimeout(scrollToTop, 50);
    const timer2 = setTimeout(scrollToTop, 100);
    const timer3 = setTimeout(scrollToTop, 200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, []);

  return (
    <div ref={wrapperRef} style={{ minHeight: '100vh' }}>
      {children}
    </div>
  );
};

export default ScrollWrapper;