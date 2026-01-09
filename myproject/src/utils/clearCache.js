// Utility to clear browser cache and localStorage for debugging export 
const clearAllCache = () => { // Clear localStorage localStorage.clear(); // Clear sessionStorage sessionStorage.clear(); // Force reload window.location.reload(true);
};

export const clearComparisonCache = () => { // Clear only comparison-related cache localStorage.removeItem('comparisonItems'); localStorage.removeItem('comparison'); console.log('Comparison cache cleared');
};

export const clearProductCache = () => { // Clear product-related cache ;
const keysToRemove = []; for (let i = 0; i < localStorage.length; i++) { 
const key = localStorage.key(i);
if (key && (key.includes('product') || key.includes('cart') || key.includes('wishlist'))) { keysToRemove.push(key); } } keysToRemove.forEach(key => localStorage.removeItem(key)); console.log('Product cache cleared');
};
 
