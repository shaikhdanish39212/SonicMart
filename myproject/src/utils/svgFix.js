// SVG Attribute Fix Utility
// This utility fixes SVG elements that might have invalid 'auto' width/height attributes

const fixSVGAttributes = () => {
  // Find all SVG elements with problematic attributes
  const svgsWithAutoWidth = document.querySelectorAll('svg[width="auto"]');
  const svgsWithAutoHeight = document.querySelectorAll('svg[height="auto"]');
  
  // Fix width="auto" issues
  svgsWithAutoWidth.forEach(svg => {
    console.warn('Fixed SVG with width="auto":', svg);
    svg.removeAttribute('width');
    // Preserve any existing styling, otherwise set a reasonable default
    if (!svg.style.width && !svg.classList.length) {
      svg.style.width = '1em';
    }
  });
  
  // Fix height="auto" issues
  svgsWithAutoHeight.forEach(svg => {
    console.warn('Fixed SVG with height="auto":', svg);
    svg.removeAttribute('height');
    // Preserve any existing styling, otherwise set a reasonable default
    if (!svg.style.height && !svg.classList.length) {
      svg.style.height = '1em';
    }
  });
  
  // Ensure SVG has proper viewBox if dimensions are problematic
  const allSvgs = document.querySelectorAll('svg');
  allSvgs.forEach(svg => {
    if (!svg.getAttribute('viewBox') && 
        !svg.getAttribute('width') && 
        !svg.getAttribute('height') &&
        !svg.style.width &&
        !svg.style.height &&
        !svg.classList.length) {
      svg.setAttribute('viewBox', '0 0 24 24');
      svg.style.width = '1em';
      svg.style.height = '1em';
    }
  });
};

// Enhanced mutation observer to catch dynamic SVG additions
const setupSVGObserver = () => {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Check if the added node is an SVG
            if (node.tagName === 'SVG') {
              fixSingleSVG(node);
            } else if (node.querySelectorAll) {
              // Check for SVGs within the added node
              const nestedSVGs = node.querySelectorAll('svg[width="auto"], svg[height="auto"]');
              nestedSVGs.forEach(fixSingleSVG);
            }
          }
        });
      } else if (mutation.type === 'attributes') {
        // Handle attribute changes
        if (mutation.target.tagName === 'SVG' && 
            (mutation.attributeName === 'width' || mutation.attributeName === 'height')) {
          fixSingleSVG(mutation.target);
        }
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['width', 'height']
  });

  return observer;
};

// Fix a single SVG element
const fixSingleSVG = (svg) => {
  if (svg.getAttribute('width') === 'auto') {
    console.warn('Fixed dynamically added SVG with width="auto":', svg);
    svg.removeAttribute('width');
    if (!svg.style.width && !svg.classList.length) {
      svg.style.width = '1em';
    }
  }
  if (svg.getAttribute('height') === 'auto') {
    console.warn('Fixed dynamically added SVG with height="auto":', svg);
    svg.removeAttribute('height');
    if (!svg.style.height && !svg.classList.length) {
      svg.style.height = '1em';
    }
  }
};

// Initialize the fix
const initSVGFix = () => {
  // Fix existing SVGs
  fixSVGAttributes();
  
  // Set up observer for future SVGs
  const observer = setupSVGObserver();
  
  // Store observer for cleanup if needed
  window.svgFixObserver = observer;
  
  console.log('SVG attribute fix initialized');
};

// Run the fix when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSVGFix);
} else {
  initSVGFix();
}

export default fixSVGAttributes;