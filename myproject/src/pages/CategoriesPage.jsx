import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI } from '../utils/api';
import { getImageUrl } from '../utils/imageUrl';
import { Music, Grid3X3 } from 'lucide-react';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [internalCategories, setInternalCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Default category display data for fallback
  const categoryDisplayData = {
    'headphones': {
      image: '/images/HeadPhones1.png',
      description: 'Premium quality headphones for immersive audio experience',
      bgGradient: 'from-purple-400/20 to-blue-400/20',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    'earbuds': {
      image: '/images/EarBuds1.png',
      description: 'True wireless earbuds with exceptional sound quality',
      bgGradient: 'from-blue-400/20 to-cyan-400/20',
      iconBg: 'bg-brand-blue/10',
      iconColor: 'text-brand-blue'
    },
    'speakers': {
      image: '/images/Speakers1.png',
      description: 'Powerful speakers for room-filling sound',
      bgGradient: 'from-orange-400/20 to-red-400/20',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600'
    },
    'microphones': {
      image: '/images/Microphone1.png',
      description: 'Professional microphones for content creators',
      bgGradient: 'from-green-400/20 to-teal-400/20',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    'earphones': {
      image: '/images/EarPhones1.png',
      description: 'Wired in-ear earphones for precise audio',
      bgGradient: 'from-teal-400/20 to-cyan-400/20',
      iconBg: 'bg-teal-100',
      iconColor: 'text-teal-600'
    },
    'neckband-earphones': {
      image: '/images/NeckBand1.png',
      description: 'Wireless neckband earphones for daily use',
      bgGradient: 'from-indigo-400/20 to-purple-400/20',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600'
    },
    'dj-speakers': {
      image: '/images/DJSpeaker1.png',
      description: 'Professional DJ speakers for events',
      bgGradient: 'from-yellow-400/20 to-orange-400/20',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
    },
    'loud-speakers': {
      image: '/images/LoudSpeaker1.png',
      description: 'High-powered loud speakers for public events',
      bgGradient: 'from-red-400/20 to-pink-400/20',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600'
    },
    'home-theater': {
      image: '/images/HomeTheater1.png',
      description: 'Complete home theater systems for immersive entertainment',
      bgGradient: 'from-purple-400/20 to-blue-400/20',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    'studio-monitors': {
      image: '/images/DJSpeaker1.png',
      description: 'Studio monitors for professional audio production',
      bgGradient: 'from-red-400/20 to-pink-400/20',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600'
    },
    'amplifiers': {
      image: '/images/DJSpeaker1.png',
      description: 'Power amplifiers for enhanced audio performance',
      bgGradient: 'from-gray-400/20 to-slate-400/20',
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-600'
    },
    'audio-interfaces': {
      image: '/images/RecordingStudioEquipments1.png',
      description: 'Audio interfaces for professional recording',
      bgGradient: 'from-emerald-400/20 to-green-400/20',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600'
    },
    'recording-equipment': {
      image: '/images/RecordingStudioEquipments1.png',
      description: 'Professional recording equipment and studio gear',
      bgGradient: 'from-slate-400/20 to-gray-400/20',
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-600'
    },
    'studio-equipment': {
      image: '/images/RecordingStudioEquipments1.png',
      description: 'Professional studio equipment and recording gear',
      bgGradient: 'from-slate-400/20 to-gray-400/20',
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-600'
    },
    'studio-equipments': {
      image: '/images/RecordingStudioEquipments1.png',
      description: 'Professional studio equipment and recording gear',
      bgGradient: 'from-slate-400/20 to-gray-400/20',
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-600'
    },
    // Add Internal Components mapping to main categories as well
    'internal-components': {
      image: '/images/InternalComponent_Driver.png', // Use copied internal component image
      description: 'Technical components and internal parts used in audio equipment',
      bgGradient: 'from-slate-400/20 to-gray-400/20',
      iconBg: 'bg-slate-100',
      iconColor: 'text-slate-600'
    },
    'keyboards-pianos': {
      image: '/images/KeyboardsPianos1.png',
      description: 'Digital keyboards and pianos for music creation',
      bgGradient: 'from-indigo-400/20 to-purple-400/20',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600'
    },
    'guitars-basses': {
      image: '/images/GuitarsBasses1.png',
      description: 'Electric and acoustic guitars and bass guitars',
      bgGradient: 'from-orange-400/20 to-red-400/20',
      iconBg: 'bg-orange-100',
      iconColor: 'text-orange-600'
    },
    'drums-percussion': {
      image: '/images/DrumsPercussion_Drums1.png',
      description: 'Drum kits and percussion instruments',
      bgGradient: 'from-yellow-400/20 to-orange-400/20',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
    }
  };

  const internalComponentDisplayData = {
    'acoustic-elements': {
      description: 'Sound Dampening & Acoustic Materials',
      image: '/images/internal_components/images/HeadPhones_HeadbandPaddingFoam5.png',
      gradient: 'from-gray-400/20 to-slate-400/20'
    },
    'audio-amplifiers': {
      description: 'Power Amplifiers & Signal Boosters',
      image: '/images/internal_components/images/Speakers_CrossoverNetworks4.png',
      gradient: 'from-red-400/20 to-pink-400/20'
    },
    'audio-circuits': {
      description: 'Electronic Circuits & PCBs',
      image: '/images/internal_components/images/EarBuds_Bluetooth_5.0_Module4.png',
      gradient: 'from-blue-400/20 to-indigo-400/20'
    },
    'connectors-cables': {
      description: 'Audio Connectors & Cables',
      image: '/images/internal_components/images/HeadPhones_3.5mm_6.35mmConnectors8.png',
      gradient: 'from-green-400/20 to-teal-400/20'
    },
    'control-interfaces': {
      description: 'Control Panels & Interfaces',
      image: '/images/internal_components/images/GuitarsBasses_Potentiometers5.png',
      gradient: 'from-purple-400/20 to-violet-400/20'
    },
    'mechanical-parts': {
      description: 'Mechanical Components & Hardware',
      image: '/images/internal_components/images/DJSpeaker_MountingHardware8.png',
      gradient: 'from-amber-400/20 to-yellow-400/20'
    },
    'speaker-drivers': {
      description: 'Speaker Drivers & Components',
      image: '/images/internal_components/images/Speakers_Driver3.png',
      gradient: 'from-orange-400/20 to-red-400/20'
    },
    // Additional mappings for common internal component categories
    'drivers': {
      description: 'Speaker Drivers & Components',
      image: '/images/internal_components/images/Speakers_Driver3.png',
      gradient: 'from-orange-400/20 to-red-400/20'
    },
    'cables': {
      description: 'Audio Cables & Connectors',
      image: '/images/internal_components/images/HeadPhones_3.5mm_6.35mmConnectors8.png',
      gradient: 'from-green-400/20 to-teal-400/20'
    },
    'connectors': {
      description: 'Audio Connectors & Jacks',
      image: '/images/internal_components/images/HeadPhones_3.5mm_6.35mmConnectors8.png',
      gradient: 'from-green-400/20 to-teal-400/20'
    },
    'circuits': {
      description: 'Electronic Circuits & Modules',
      image: '/images/internal_components/images/EarBuds_Bluetooth_5.0_Module4.png',
      gradient: 'from-blue-400/20 to-indigo-400/20'
    },
    'hardware': {
      description: 'Mechanical Hardware Components',
      image: '/images/internal_components/images/DJSpeaker_MountingHardware8.png',
      gradient: 'from-amber-400/20 to-yellow-400/20'
    },
    'foam': {
      description: 'Acoustic Foam & Padding Materials',
      image: '/images/internal_components/images/HeadPhones_HeadbandPaddingFoam5.png',
      gradient: 'from-gray-400/20 to-slate-400/20'
    },
    'magnets': {
      description: 'Speaker Magnets & Voice Coils',
      image: '/images/internal_components/images/HeadPhonesNeodymiumMagnet2.png',
      gradient: 'from-red-400/20 to-pink-400/20'
    },
    'voice-coils': {
      description: 'Voice Coils & Driver Components',
      image: '/images/internal_components/images/HeadPhonesVoiceCoil3.png',
      gradient: 'from-purple-400/20 to-indigo-400/20'
    }
  };
  
  // Load categories from backend
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setLoading(true);
        const [mainCategoriesResponse, internalCategoriesResponse] = await Promise.all([
          productsAPI.getCategories(),
          productsAPI.getInternalCategories()
        ]);

        const mainCategories = mainCategoriesResponse.data.categories;
        const internalCategoriesData = internalCategoriesResponse.data.categories;

        // Debug logging for backend categories
        console.log('Backend main categories:', mainCategories.map(cat => ({ id: cat.id, name: cat.name })));
        console.log('Backend internal categories:', internalCategoriesData.map(cat => ({ id: cat.id, name: cat.name })));

        // Map backend categories to display format
        const mappedCategories = mainCategories.map(category => {
          const displayData = categoryDisplayData[category.id] || {
            image: '/images/Speakers1.png', // Better fallback image
            description: category.description || 'Quality products for your needs',
            bgGradient: 'from-gray-400/20 to-slate-400/20',
            iconBg: 'bg-gray-100',
            iconColor: 'text-gray-600'
          };
          
          return {
            id: category.id,
            name: category.name,
            image: displayData.image,
            description: displayData.description,
            productCount: `${category.productCount || 0}+ Products`,
            bgGradient: displayData.bgGradient,
            iconBg: displayData.iconBg,
            iconColor: displayData.iconColor
          };
        });

        const mappedInternalCategories = internalCategoriesData.map(category => {
          const displayData = internalComponentDisplayData[category.id] || {
            image: '/images/internal_components/images/Speakers_Driver3.png', // Better fallback for internal components
            description: category.description || 'Quality internal components for your audio devices',
            bgGradient: 'from-gray-400/20 to-slate-400/20',
            iconBg: 'bg-gray-100',
            iconColor: 'text-gray-600'
          };
          
          // Debug logging for internal components
          console.log(`Internal component mapping:`, {
            id: category.id,
            name: category.name,
            originalImage: category.image,
            mappedImage: displayData.image,
            hasDisplayData: !!internalComponentDisplayData[category.id]
          });
          
          return {
            id: category.id,
            name: category.name,
            image: displayData.image,
            description: displayData.description,
            productCount: `${category.productCount || 0}+ Products`,
            bgGradient: displayData.bgGradient || displayData.gradient,
            iconBg: displayData.iconBg,
            iconColor: displayData.iconColor
          };
        });
        
        // Add Internal Components as an additional category only if it doesn't exist
        const hasInternalComponents = mainCategories.some(cat => cat.id === 'internal-components');
        const internalComponentsCategory = {
          id: 'internal-components',
          name: 'Internal Components',
          image: '/images/InternalComponent_Driver.png', // Use copied driver image
          description: 'Technical components and internal parts used in audio equipment',
          productCount: '56+ Components',
          bgGradient: 'from-slate-400/20 to-gray-400/20',
          iconBg: 'bg-slate-100',
          iconColor: 'text-slate-600'
        };
        
        console.log('Internal Components category test image:', internalComponentsCategory.image);
        
        const finalCategories = hasInternalComponents ? mappedCategories : [...mappedCategories, internalComponentsCategory];
        
        // Debug logging
        console.log('Final categories with images:', finalCategories.map(cat => ({ 
          id: cat.id, 
          name: cat.name, 
          image: cat.image 
        })));
        
        setCategories(finalCategories);
        setInternalCategories(mappedInternalCategories);
      } catch (err) {
        console.error('Error loading categories:', err);
        // Fallback to empty array if categories fail to load
        setCategories([]);
        setInternalCategories([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadCategories();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white sm:bg-[#FEFCF3]">
        {/* Mobile-First Hero Section - Extra Compact */}
        <div className="bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 py-2 sm:py-3 lg:py-5 border-b border-gray-100">
          <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6 text-center">
            <div className="inline-block text-white px-3 py-1 sm:px-4 sm:py-1.5 lg:px-5 lg:py-2 rounded-full text-xs sm:text-sm font-bold mb-1.5 sm:mb-3 lg:mb-4 shadow-lg" style={{ backgroundColor: '#20B2AA' }}>
              <Music size={14} className="mr-1 inline" />
              EXPLORE COLLECTIONS
            </div>
            <h1 className="text-lg sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-1.5 sm:mb-3 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                Product <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to right, #FF6B6B, #20B2AA)' }}>Categories</span>
              </span>
            </h1>
            <p className="text-xs sm:text-sm lg:text-base text-gray-600 max-w-5xl mx-auto px-2 sm:px-0 mb-2 sm:mb-4 leading-relaxed">
              Browse through our carefully curated categories to find the perfect audio equipment for your needs
            </p>
          </div>
        </div>
        
        <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6">
          {/* Enhanced Loading Skeleton */}
          <div className="text-center mb-4 sm:mb-6">
            <div className="w-32 h-8 bg-gray-200 rounded-full mx-auto mb-4 animate-pulse"></div>
            <div className="w-48 h-6 bg-gray-200 rounded-full mx-auto animate-pulse"></div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
            {[...Array(8)].map((_, index) => (
              <div key={`skeleton-page-category-${index}`} className="bg-white rounded-lg sm:rounded-xl shadow-md border animate-pulse border-gray-100">
                <div className="p-2 sm:p-3 lg:p-4">
                  <div className="flex flex-col items-center space-y-2 sm:space-y-3">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1 space-y-2 sm:space-y-3 w-full text-center">
                      <div className="h-4 sm:h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3 mx-auto"></div>
                      <div className="h-4 sm:h-5 bg-gray-200 rounded w-1/3 mx-auto"></div>
                      <div className="h-8 sm:h-10 bg-gray-200 rounded w-1/2 mx-auto"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const CategoryGrid = ({ categories, title, subtitle }) => (
    <div className="mb-8 sm:mb-12">
      {title && (
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              {title.split(' ')[0]} <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to right, #FF6B6B, #20B2AA)' }}>{title.split(' ').slice(1).join(' ')}</span>
            </span>
          </h2>
          {subtitle && <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-2 sm:px-0">{subtitle}</p>}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
        {categories.map((category, index) => (
          <Link
            key={category.id}
            to={category.id === 'internal-components' ? '/internal-components' : `/category/${category.id}`}
            className="group relative rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border transform hover:scale-105 bg-white touch-target"
            style={{ borderColor: '#F8F9FA' }}
          >
            <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-20 transition-opacity duration-300" style={{ background: 'linear-gradient(135deg, #FF6B6B 0%, #20B2AA 100%)' }}></div>
            
            {/* Content Container */}
            <div className="relative z-10 p-5 sm:p-6 lg:p-8">
              <div className="flex flex-col items-center text-center space-y-5 sm:space-y-6">
                {/* Enhanced Image Section */}
                <div className="relative">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 lg:w-36 lg:h-36 relative">
                    {/* Decorative Background */}
                    <div className="absolute inset-0 rounded-2xl transform rotate-6 group-hover:rotate-12 transition-transform duration-300" style={{ background: 'linear-gradient(135deg, #FF6B6B20, #20B2AA20)' }}></div>
                    
                    {/* Product Image */}
                    <img
                      src={getImageUrl(category.image)}
                      alt={category.name}
                      className="relative z-10 w-full h-full object-contain rounded-2xl transform group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        console.log('Image failed to load:', category.image);
                        e.target.src = '/images/Speakers1.png'; // Better fallback
                      }}
                    />
                  </div>
                </div>
                
                {/* Enhanced Content Section */}
                <div className="flex-1 space-y-5 sm:space-y-6">
                  <h3 className="text-base sm:text-lg lg:text-xl font-bold group-hover:text-brand-blue transition-colors duration-300 text-gray-900">
                    {category.name}
                  </h3>
                  
                  <p className="text-xs sm:text-sm leading-relaxed text-gray-600 px-1 sm:px-0">
                    {category.description}
                  </p>
                  
                  <div className="inline-block px-2 py-1 sm:px-3 sm:py-1.5 rounded-full text-xs font-semibold" style={{ backgroundColor: '#20B2AA20', color: '#20B2AA' }}>
                    {category.productCount}
                  </div>
                  
                  {/* Enhanced CTA Button */}
                  <div className="flex items-center justify-center gap-1 sm:gap-2 text-white px-3 py-2 sm:px-4 sm:py-2.5 rounded-lg font-bold transition-all duration-300 shadow-md hover:shadow-lg transform group-hover:scale-105 touch-target" style={{ backgroundColor: '#FF6B6B' }}>
                    <span className="text-xs sm:text-sm">Explore Collection</span>
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white sm:bg-[#FEFCF3]">
      {/* Mobile-First Hero Section - Extra Compact */}
      <div className="bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 py-2 sm:py-3 lg:py-5 border-b border-gray-100">
        <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6 text-center">
          {/* Extra compact badge */}
          <div className="inline-block text-white px-3 py-1 sm:px-4 sm:py-1.5 lg:px-5 lg:py-2 rounded-full text-xs sm:text-sm font-bold mb-1.5 sm:mb-3 lg:mb-4 shadow-lg transform hover:scale-105 transition-all duration-300" style={{ backgroundColor: '#20B2AA' }}>
            <Music size={14} className="mr-1 inline" />
            EXPLORE COLLECTIONS
          </div>
          
          {/* Extra compact title */}
          <h1 className="text-lg sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-1.5 sm:mb-3 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Product <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to right, #FF6B6B, #20B2AA)' }}>Categories</span>
            </span>
          </h1>
          
          {/* Extra compact description */}
          <p className="text-xs sm:text-sm lg:text-base text-gray-600 max-w-5xl mx-auto mb-2 sm:mb-4 px-2 sm:px-0 leading-relaxed">
            Browse through our carefully curated categories to find the perfect audio equipment for your needs
          </p>
          
          {/* Ultra Compact Statistics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-2 max-w-5xl mx-auto">
            <div className="bg-white rounded-md sm:rounded-lg p-2 sm:p-3 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
              <div className="text-base sm:text-lg font-bold text-brand-coral">{categories.length + internalCategories.length}+</div>
              <div className="text-xs font-medium text-gray-600">Categories</div>
            </div>
            <div className="bg-white rounded-md sm:rounded-lg p-2 sm:p-3 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
              <div className="text-base sm:text-lg font-bold text-brand-blue">500+</div>
              <div className="text-xs font-medium text-gray-600">Products</div>
            </div>
            <div className="bg-white rounded-md sm:rounded-lg p-2 sm:p-3 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
              <div className="text-base sm:text-lg font-bold text-brand-coral">50+</div>
              <div className="text-xs font-medium text-gray-600">Brands</div>
            </div>
            <div className="bg-white rounded-md sm:rounded-lg p-2 sm:p-3 shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200">
              <div className="text-base sm:text-lg font-bold text-brand-blue">24/7</div>
              <div className="text-xs font-medium text-gray-600">Support</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Mobile-Optimized Categories Section */}
      <div className="max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6">
        <CategoryGrid 
          categories={categories}
        />

        {/* Internal Components Section */}
        {internalCategories.length > 0 && (
          <div className="mt-8 sm:mt-12 lg:mt-16">
            <div className="text-center mb-6 sm:mb-8 lg:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-3 sm:mb-4 leading-tight">
                <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                  Internal <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to right, #FF6B6B, #20B2AA)' }}>Components</span>
                </span>
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto px-2 sm:px-0">
                Discover our specialized internal components for audio devices
              </p>
            </div>
            <CategoryGrid 
              categories={internalCategories} 
              subtitle=""
            />
          </div>
        )}
        
        {/* Mobile-Enhanced Bottom CTA Section */}
        <div className="text-center mt-8 sm:mt-12 lg:mt-16 bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-xl border border-gray-100 mx-2 sm:mx-0">
          <div className="text-4xl sm:text-5xl lg:text-6xl mb-4 sm:mb-6 flex justify-center">
            <Grid3X3 size={64} className="text-gray-700" />
          </div>
          <h3 className="text-xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4 sm:mb-6 leading-tight">
            <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Can't Find What You're <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to right, #FF6B6B, #20B2AA)' }}>Looking For?</span>
            </span>
          </h3>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto px-2 sm:px-0 leading-relaxed">
            Explore our complete product catalog or get in touch with our audio experts for personalized recommendations
          </p>
          
          {/* Mobile-Enhanced Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 border-gray-100 bg-gray-50 transform hover:scale-105 transition-all duration-300 hover:shadow-lg">
              <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">👨‍💼</div>
              <h4 className="font-bold mb-1 sm:mb-2 text-gray-900">Expert Support</h4>
              <p className="text-sm text-gray-600">Get personalized recommendations</p>
            </div>
            <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 border-gray-100 bg-gray-50 transform hover:scale-105 transition-all duration-300 hover:shadow-lg">
              <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">🚚</div>
              <h4 className="font-bold mb-1 sm:mb-2 text-gray-900">Fast Delivery</h4>
              <p className="text-sm text-gray-600">Free shipping on orders over ₹99</p>
            </div>
            <div className="p-4 sm:p-6 rounded-xl sm:rounded-2xl border-2 border-gray-100 bg-gray-50 transform hover:scale-105 transition-all duration-300 hover:shadow-lg">
              <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">↩️</div>
              <h4 className="font-bold mb-1 sm:mb-2 text-gray-900">Easy Returns</h4>
              <p className="text-sm text-gray-600">30-day hassle-free returns</p>
            </div>
          </div>
          
          {/* Mobile-Responsive Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 lg:space-x-6">
            <Link
              to="/products"
              className="px-6 sm:px-8 py-3 sm:py-4 text-white rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl touch-target bg-brand-coral hover:bg-brand-coral/90"
            >
              View All Products
            </Link>
            <Link
              to="/contact"
              className="px-6 sm:px-8 py-3 sm:py-4 border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white rounded-xl font-bold transition-all duration-300 transform hover:scale-105 hover:shadow-lg touch-target"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;