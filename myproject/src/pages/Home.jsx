import React, { useState, useEffect } from 'react';
import HeroBanner from '../components/HeroBanner';
import FeaturedProducts from '../components/FeaturedProducts';
import PromotionalBanner from '../components/PromotionalBanner';
import WhyChooseSound from '../components/WhyChooseSound';
import TrustedByMusicLovers from '../components/TrustedByMusicLovers';
import { useProductCache } from '../context/ProductCacheContext';

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getProductsWithDeals, isProductsCached } = useProductCache();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);

        const result = await getProductsWithDeals();
        console.log(`Home: Loaded ${result.data.length} products with deals ${result.fromCache ? '(from cache)' : '(fresh data)'}`);
        setProducts(result.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount - getProductsWithDeals handles caching internally

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FEFCF3' }}>
      {/* Hero Banner - Full Width */}
      <div className="bg-red-500 text-white p-4 text-center font-bold text-sm">
        DEBUG MODE: <br />
        API URL: [{import.meta.env.VITE_API_URL || 'UNDEFINED - USING LOCALHOST'}] <br />
        Products Found: {products.length} <br />
        Loading: {loading ? 'YES' : 'NO'}
      </div>
      <HeroBanner />

      {/* Featured Products - Mobile Optimized */}
      <section className="py-6 sm:py-8" style={{ backgroundColor: '#F8F9FA' }}>
        <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6">
          {loading ? (
            <div className="flex justify-center items-center py-12 sm:py-16">
              <div className="text-base sm:text-lg" style={{ color: '#2C3E50' }}>Loading products...</div>
            </div>
          ) : (
            <FeaturedProducts products={products} />
          )}
        </div>
      </section>

      {/* Promotional Banner Section - Mobile Optimized */}
      <section className="py-6 sm:py-8">
        <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6">
          <PromotionalBanner />
        </div>
      </section>

      {/* Why Choose Sound Section - Mobile Optimized */}
      <div className="py-6 sm:py-8">
        <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6">
          <WhyChooseSound />
          <div className="mt-6 sm:mt-8">
            <TrustedByMusicLovers />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
