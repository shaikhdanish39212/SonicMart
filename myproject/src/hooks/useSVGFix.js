import { useEffect } from 'react';

// Custom hook to fix SVG attributes
export const useSVGFix = () => {
  useEffect(() => {
    const fixSVGElements = () => {
      const svgs = document.querySelectorAll('svg[width="auto"], svg[height="auto"]');
      
      svgs.forEach(svg => {
        if (svg.getAttribute('width') === 'auto') {
          svg.removeAttribute('width');
          if (!svg.style.width) {
            svg.style.width = '1em'; // Default fallback
          }
        }
        
        if (svg.getAttribute('height') === 'auto') {
          svg.removeAttribute('height');
          if (!svg.style.height) {
            svg.style.height = '1em'; // Default fallback
          }
        }
      });
    };

    // Fix existing SVGs
    fixSVGElements();
    
    // Set up observer for dynamically added SVGs
    const observer = new MutationObserver(fixSVGElements);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['width', 'height']
    });

    return () => observer.disconnect();
  }, []);
};

// Also export a utility function
export const fixSVGAttributes = (element = document) => {
  const svgs = element.querySelectorAll('svg[width="auto"], svg[height="auto"]');
  
  svgs.forEach(svg => {
    if (svg.getAttribute('width') === 'auto') {
      console.warn('Fixing SVG with width="auto":', svg);
      svg.removeAttribute('width');
      svg.style.width = svg.style.width || '1em';
    }
    
    if (svg.getAttribute('height') === 'auto') {
      console.warn('Fixing SVG with height="auto":', svg);
      svg.removeAttribute('height');
      svg.style.height = svg.style.height || '1em';
    }
  });
};