import React, { memo, useMemo, useCallback, lazy, Suspense } from 'react';

/**
 * Performance optimization utilities for React components
 */

// Loading spinner component for lazy loading
export const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen w-full bg-white">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      <p className="text-gray-600 text-sm font-medium">Loading...</p>
    </div>
  </div>
);

// Error fallback for lazy loaded components
export const LazyLoadError = ({ error, retry }) => (
  <div className="flex flex-col items-center justify-center min-h-[200px] p-4">
    <p className="text-red-600 mb-4">Failed to load component</p>
    <button 
      onClick={retry}
      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
    >
      Try Again
    </button>
  </div>
);

// Higher-order component for memoization with custom comparison
export const withMemo = (Component, areEqual) => {
  const MemoizedComponent = memo(Component, areEqual);
  MemoizedComponent.displayName = `Memo(${Component.displayName || Component.name})`;
  return MemoizedComponent;
};

// Hook for memoizing expensive calculations
export const useExpensiveCalculation = (calculation, dependencies) => {
  return useMemo(calculation, dependencies);
};

// Hook for memoizing callback functions
export const useStableCallback = (callback, dependencies) => {
  return useCallback(callback, dependencies);
};

// Custom hook for performance monitoring
export const usePerformanceMonitor = (componentName) => {
  React.useEffect(() => {
    const startTime = performance.now();
    
    return () => {
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      if (renderTime > 16) { // Longer than 1 frame at 60fps
        console.warn(`Slow render detected in ${componentName}: ${renderTime.toFixed(2)}ms`);
      }
    };
  });
};

// Lazy loading wrapper with error boundary
export const LazyWrapper = ({ children, fallback = <LoadingSpinner /> }) => (
  <Suspense fallback={fallback}>
    {children}
  </Suspense>
);

// Virtual scrolling hook for large lists
export const useVirtualScroll = (items, itemHeight, containerHeight) => {
  const [scrollTop, setScrollTop] = React.useState(0);
  
  const visibleItems = useMemo(() => {
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
      startIndex + Math.ceil(containerHeight / itemHeight) + 1,
      items.length
    );
    
    return items.slice(startIndex, endIndex).map((item, index) => ({
      ...item,
      index: startIndex + index
    }));
  }, [items, itemHeight, containerHeight, scrollTop]);
  
  return {
    visibleItems,
    totalHeight: items.length * itemHeight,
    setScrollTop
  };
};

// Debounced value hook
export const useDebouncedValue = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = React.useState(value);
  
  React.useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);
  
  return debouncedValue;
};

// Throttled callback hook
export const useThrottledCallback = (callback, delay) => {
  const lastRun = React.useRef(Date.now());
  
  return useCallback((...args) => {
    if (Date.now() - lastRun.current >= delay) {
      callback(...args);
      lastRun.current = Date.now();
    }
  }, [callback, delay]);
};

// Image lazy loading hook
export const useImageLazyLoad = () => {
  const [loadedImages, setLoadedImages] = React.useState(new Set());
  
  const loadImage = useCallback((src) => {
    if (loadedImages.has(src)) return Promise.resolve();
    
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        setLoadedImages(prev => new Set([...prev, src]));
        resolve();
      };
      img.onerror = reject;
      img.src = src;
    });
  }, [loadedImages]);
  
  const isImageLoaded = useCallback((src) => {
    return loadedImages.has(src);
  }, [loadedImages]);
  
  return { loadImage, isImageLoaded };
};

// Intersection Observer hook for lazy loading
export const useIntersectionObserver = (options = {}) => {
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  const [entry, setEntry] = React.useState(null);
  const elementRef = React.useRef(null);
  
  React.useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
      setEntry(entry);
    }, options);
    
    observer.observe(element);
    
    return () => observer.disconnect();
  }, [options]);
  
  return { elementRef, isIntersecting, entry };
};

// Memory usage monitor hook (development only)
export const useMemoryMonitor = (componentName) => {
  React.useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;
    
    const checkMemory = () => {
      if (performance.memory) {
        const { usedJSHeapSize, totalJSHeapSize, jsHeapSizeLimit } = performance.memory;
        const usagePercent = (usedJSHeapSize / jsHeapSizeLimit) * 100;
        
        if (usagePercent > 80) {
          console.warn(`High memory usage in ${componentName}: ${usagePercent.toFixed(2)}%`);
        }
      }
    };
    
    const interval = setInterval(checkMemory, 5000);
    return () => clearInterval(interval);
  }, [componentName]);
};

// Bundle analyzer utility (development only)
export const analyzeBundleSize = (componentName, dependencies = []) => {
  if (process.env.NODE_ENV !== 'development') return;
  
  React.useEffect(() => {
    console.log(`Component ${componentName} dependencies:`, dependencies.length);
  }, [componentName, dependencies]);
};

export default {
  LoadingSpinner,
  LazyLoadError,
  withMemo,
  useExpensiveCalculation,
  useStableCallback,
  usePerformanceMonitor,
  LazyWrapper,
  useVirtualScroll,
  useDebouncedValue,
  useThrottledCallback,
  useImageLazyLoad,
  useIntersectionObserver,
  useMemoryMonitor,
  analyzeBundleSize
};