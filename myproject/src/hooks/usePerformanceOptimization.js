import { useCallback, useMemo, useRef, useEffect } from 'react'; /** * Custom hook for performance optimization with large datasets * Provides debouncing, memoization, and performance monitoring */
export const usePerformanceOptimization = ({ data = [], searchQuery = '', filters = {}, sortBy = 'name', debounceMs = 300 }) => {
  const debounceRef = useRef(null);
const performanceRef = useRef({ renderCount: 0, lastRenderTime: 0 }); // Debounced search function const debouncedSearch = useCallback((query, callback) => { if (debounceRef.current) { clearTimeout(debounceRef.current); } debounceRef.current = setTimeout(() => { callback(query); }, debounceMs); }, [debounceMs]); // Memoized filtering function const filteredData = useMemo(() => {
const startTime = performance.now();
let filtered = [...data]; // Apply search filter if (searchQuery.trim()) { const query = searchQuery.toLowerCase(); filtered = filtered.filter(item => item.name?.toLowerCase().includes(query) || item.description?.toLowerCase().includes(query) || item.category?.toLowerCase().includes(query) ); } // Apply other filters Object.entries(filters).forEach(([key, value]) => { if (value !== null && value !== undefined && value !== '') { switch (key) { case 'category': if (value !== 'all') { filtered = filtered.filter(item => item.category === value); } break; case 'priceRange': if (Array.isArray(value) && value.length === 2) { filtered = filtered.filter(item => item.price >= value[0] && item.price <= value[1] ); } break; case 'discount': if (value > 0) { filtered = filtered.filter(item => (item.discount || 0) >= value); } break; case 'inStock': if (value) { filtered = filtered.filter(item => item.inStock !== false); } break; case 'featured': if (value) { filtered = filtered.filter(item => item.featured === true); } break; default: break; } } });
const endTime = performance.now(); performanceRef.current.lastFilterTime = endTime - startTime;
return filtered; }, [data, searchQuery, filters]); // Memoized sorting function const sortedData = useMemo(() => {
    const startTime = performance.now();
const sorted = [...filteredData].sort((a, b) => { switch (sortBy) { case 'price-low': return a.price - b.price; case 'price-high': return b.price - a.price; case 'name': return a.name.localeCompare(b.name); case 'discount': return (b.discount || 0) - (a.discount || 0); case 'featured': return (b.featured ? 1 : 0) - (a.featured ? 1 : 0); case 'newest': return new Date(b.createdAt || 0) - new Date(a.createdAt || 0); default: return 0; } });
const endTime = performance.now(); performanceRef.current.lastSortTime = endTime - startTime;
return sorted; }, [filteredData, sortBy]); // Performance monitoring useEffect(() => { performanceRef.current.renderCount += 1; performanceRef.current.lastRenderTime = performance.now(); // Log performance metrics in development if (process.env.NODE_ENV === 'development' && performanceRef.current.renderCount % 10 === 0) { console.log('Performance Metrics:', { renderCount: performanceRef.current.renderCount, dataSize: data.length, filteredSize: filteredData.length, lastFilterTime: performanceRef.current.lastFilterTime, lastSortTime: performanceRef.current.lastSortTime }
  );
}
const observer = new PerformanceObserver((list) => { for (const entry of list.getEntries()) { if (entry.entryType === 'longtask') { ;
const duration = entry.duration;
const attribution = entry.attribution;
const task = { duration, name: entry.name, attribution: attribution.map(task => ({ name: task.name, containerType: task.containerType, containerSrc: task.containerSrc, containerId: task.containerId, containerName: task.containerName, })), }; setLongTasks(prevTasks => [...prevTasks, task]); } } }); observer.observe({ entryTypes: ['longtask'] }
  );
}, [data.length, filteredData.length]); // Cleanup debounce on unmount useEffect(() => { return () => { if (debounceRef.current) { clearTimeout(debounceRef.current); } }; }, []);
  return { filteredData, sortedData, debouncedSearch, performanceMetrics: { renderCount: performanceRef.current.renderCount, dataSize: data.length, filteredSize: filteredData.length, lastFilterTime: performanceRef.current.lastFilterTime, lastSortTime: performanceRef.current.lastSortTime } }; };

export default usePerformanceOptimization;