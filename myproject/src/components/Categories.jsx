import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI } from '../utils/api';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [internalCategories, setInternalCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Default category display data for fallback
  const categoryDisplayData = {
    'earbuds': {
      description: 'Wireless & Wired Earbuds',
      image: '/images/EarBuds1.png',
      gradient: 'from-blue-400/20 to-cyan-400/20'
    },
    'speakers': {
      description: 'Portable & Smart Speakers',
      image: '/images/Speaker1.png',
      gradient: 'from-purple-400/20 to-pink-400/20'
    },
    'headphones': {
      description: 'Over-Ear & On-Ear',
      image: '/images/HeadPhones1.png',
      gradient: 'from-orange-400/20 to-red-400/20'
    },
    'microphones': {
      description: 'Studio & Gaming Mics',
      image: '/images/MicroPhone1.png',
      gradient: 'from-green-400/20 to-teal-400/20'
    },
    'neckband-earphones': {
      description: 'Wireless Neckband Earphones',
      image: '/images/NeckBand1.png',
      gradient: 'from-indigo-400/20 to-purple-400/20'
    },
    'earphones': {
      description: 'Wired In-Ear Audio',
      image: '/images/EarPhones1.png',
      gradient: 'from-teal-400/20 to-cyan-400/20'
    },
    'dj-speakers': {
      description: 'Professional DJ Audio',
      image: '/images/DJSpeaker1.png',
      gradient: 'from-red-400/20 to-orange-400/20'
    },
    'loud-speakers': {
      description: 'Maximum Volume & Power',
      image: '/images/LoudSpeaker1.png',
      gradient: 'from-yellow-400/20 to-amber-400/20'
    },
    'home-theater': {
      description: 'Cinematic Audio Experience',
      image: '/images/HomeTheater1.png',
      gradient: 'from-pink-400/20 to-rose-400/20'
    },
    'guitars-basses': {
      description: 'Electric & Acoustic Instruments',
      image: '/images/GuitarsBasses1.png',
      gradient: 'from-amber-400/20 to-orange-400/20'
    },
    'keyboards-pianos': {
      description: 'Digital & Acoustic Keyboards',
      image: '/images/KeyboardsPianos1.png',
      gradient: 'from-violet-400/20 to-purple-400/20'
    },
    'drums-percussion': {
      description: 'Acoustic & Electronic Drums',
      image: '/images/DrumsPercussion_Drums1.png',
      gradient: 'from-emerald-400/20 to-green-400/20'
    },
    'studio-equipment': {
      description: 'Professional Recording Gear',
      image: '/images/RecordingStudioEquipments1.png',
      gradient: 'from-slate-400/20 to-gray-400/20'
    }
  };

  // Internal component display data
  const internalComponentDisplayData = {
    'acoustic-elements': {
      description: 'Sound Dampening & Acoustic Materials',
      image: '/images/HeadPhones_HeadbandPaddingFoam5.png',
      gradient: 'from-gray-400/20 to-slate-400/20'
    },
    'audio-amplifiers': {
      description: 'Power Amplifiers & Signal Boosters',
      image: '/images/Speakers_CrossoverNetworks4.png',
      gradient: 'from-red-400/20 to-pink-400/20'
    },
    'audio-circuits': {
      description: 'Electronic Circuits & PCBs',
      image: '/images/EarBuds_Bluetooth_5.0_Module4.png',
      gradient: 'from-blue-400/20 to-indigo-400/20'
    },
    'connectors-cables': {
      description: 'Audio Connectors & Cables',
      image: '/images/HeadPhones_3.5mm_6.35mmConnectors8.png',
      gradient: 'from-green-400/20 to-teal-400/20'
    },
    'control-interfaces': {
      description: 'Control Panels & Interfaces',
      image: '/images/GuitarsBasses_Potentiometers5.png',
      gradient: 'from-purple-400/20 to-violet-400/20'
    },
    'mechanical-parts': {
      description: 'Mechanical Components & Hardware',
      image: '/images/DJSpeaker_MountingHardware8.png',
      gradient: 'from-amber-400/20 to-yellow-400/20'
    },
    'speaker-drivers': {
      description: 'Speaker Drivers & Components',
      image: '/images/Speakers_Driver3.png',
      gradient: 'from-orange-400/20 to-red-400/20'
    }
  };

  // Load categories from backend
  useEffect(() => {
    console.log('Categories component mounted, loading data...');
    const loadCategories = async () => {
      try {
        setLoading(true);
        console.log('Starting to load categories...');

        // Load main categories
        const response = await productsAPI.getCategories();
        console.log('Main categories response:', response);
        const backendCategories = response.data.categories;

        // Map backend categories to display format
        const mappedCategories = backendCategories.map(category => {
          const displayData = categoryDisplayData[category.id] || {
            description: 'Audio equipment',
            image: '/images/MicroPhone1.png',
            gradient: 'from-blue-400/20 to-purple-400/20'
          };

          return {
            id: category.id,
            name: category.name,
            description: displayData.description,
            image: displayData.image,
            productCount: `${category.productCount || 0}+ Products`,
            gradient: displayData.gradient
          };
        });

        setCategories(mappedCategories);

        // Load internal categories
        console.log('Loading internal categories...');
        try {
          const internalResponse = await productsAPI.getInternalCategories();
          console.log('Internal categories response:', internalResponse);
          
          if (internalResponse && internalResponse.data && internalResponse.data.categories) {
            const backendInternalCategories = internalResponse.data.categories;
            console.log('Backend internal categories:', backendInternalCategories);

            // Map internal categories to display format
            const mappedInternalCategories = backendInternalCategories.map(category => {
              const displayData = internalComponentDisplayData[category.id] || {
                description: 'Internal components',
                image: '/images/MicroPhone1.png',
                gradient: 'from-gray-400/20 to-slate-400/20'
              };

              return {
                id: category.id,
                name: category.name,
                description: displayData.description,
                image: displayData.image,
                productCount: `${category.productCount || 0}+ Products`,
                gradient: displayData.gradient
              };
            });

            console.log('Mapped internal categories:', mappedInternalCategories);
            console.log('Setting internal categories state with length:', mappedInternalCategories.length);
            
            // Use functional state update to ensure proper state setting
            setInternalCategories(prevState => {
              console.log('Previous internal categories state:', prevState);
              console.log('New internal categories state:', mappedInternalCategories);
              return mappedInternalCategories;
            });
          } else {
            console.error('Invalid internal categories response structure:', internalResponse);
            setInternalCategories([]);
          }
        } catch (internalError) {
          console.error('Error loading internal categories:', internalError);
          setInternalCategories([]);
        }
      } catch (err) {
        console.error('Error loading categories:', err);
        setCategories([]);
        setInternalCategories([]);
      } finally {
        setLoading(false);
        console.log('Categories loading completed');
      }
    };

    loadCategories();
  }, []);

  if (loading) {
    return (
      <div className="py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={`skeleton-category-${index}`} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 animate-pulse">
              <div className="flex flex-col items-center justify-center space-y-4">
                <div className="w-32 h-32 md:w-40 md:h-40 bg-gray-200 rounded-2xl"></div>
                <div className="space-y-2 text-center">
                  <div className="h-6 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-32"></div>
                  <div className="h-5 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const CategoryGrid = ({ categories, title, subtitle }) => (
    <div className="mb-12">
      {title && (
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-brand-dark mb-4">{title}</h2>
          {subtitle && <p className="text-lg text-brand-dark/60 max-w-2xl mx-auto">{subtitle}</p>}
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/category/${category.id}`}
            className="group relative bg-white rounded-2xl p-6 text-center shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-200 hover:border-brand-coral/30 overflow-hidden transform hover:scale-105"
          >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
            
            {/* Enhanced Shadow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-gray-300/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center space-y-4">
              {/* Image Container */}
              <div className="relative w-32 h-32 md:w-40 md:h-40 mb-2">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-cream/50 to-brand-blue/20 rounded-2xl transform rotate-6 group-hover:rotate-12 transition-transform duration-500 shadow-md group-hover:shadow-lg"></div>
                <img
                  src={category.image}
                  alt={category.name}
                  className="relative z-10 w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 p-4 drop-shadow-lg"
                  onError={(e) => {
                    console.log(`Failed to load category image: ${category.image}`);
                    e.target.src = '/images/MicroPhone1.png';
                  }}
                />
              </div>
              
              {/* Text Content */}
              <div className="space-y-2">
                <h3 className="text-xl md:text-2xl font-bold text-brand-dark group-hover:text-brand-coral transition-colors duration-300">
                  {category.name}
                </h3>
                <p className="text-brand-dark/60 text-sm md:text-base">
                  {category.description}
                </p>
                <div className="inline-block bg-brand-coral/10 text-brand-coral px-3 py-1 rounded-full text-xs font-semibold">
                  {category.productCount}
                </div>
              </div>
              
              {/* Hover Arrow */}
              <div className="opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                <div className="w-8 h-8 bg-brand-coral rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <div className="py-8">
      {/* Main Categories Section */}
      <CategoryGrid 
        categories={categories} 
        title="Product Categories"
        subtitle="Explore our complete range of audio equipment and musical instruments"
      />
      
      {/* Internal Components Section */}
      {internalCategories.length > 0 && (
        <CategoryGrid 
          categories={internalCategories} 
          title="Internal Components"
          subtitle="Professional internal components and parts for audio equipment"
        />
      )}
    </div>
  );
};

export default Categories;