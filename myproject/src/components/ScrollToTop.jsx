import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Multiple approaches to ensure scroll to top works
    
    // Method 1: Immediate scroll (instant)
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    // Method 2: Small delay for content to load, then smooth scroll
    const timer = setTimeout(() => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
      });
      
      // Additional fallback
      if (window.pageYOffset > 0) {
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }
    }, 100);

    // Method 3: Longer delay for lazy-loaded components
    const longerTimer = setTimeout(() => {
      if (window.pageYOffset > 0) {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'auto' // Instant scroll as fallback
        });
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      clearTimeout(longerTimer);
    };
  }, [pathname, search]); // Now also listen to search parameter changes

  return null;
};

export default ScrollToTop;