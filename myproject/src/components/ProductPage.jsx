import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useProductComparison } from '../context/ProductComparisonContext';
import { productsAPI } from '../utils/api';
import { Heart, Scale, Star, ShoppingCart, Zap } from 'lucide-react';
import { getImageUrl } from '../utils/imageUrl';
import ReviewsSection from './ReviewsSection';

const ProductPage = () => {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addToCart } = useContext(CartContext);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { addToComparison, removeFromComparison, isInComparison } = useProductComparison();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewStats, setReviewStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    starBreakdown: {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0
    }
  });

  // Generate sample/reference reviews for demonstration
  const generateSampleReviews = (productName, isComponent = false) => {
    const componentReviews = [
      {
        id: 'sample-1',
        userName: 'Rajesh Kumar',
        rating: 5,
        title: 'Excellent Component Quality',
        comment: `Outstanding ${isComponent ? 'component' : 'product'}! The build quality exceeds expectations and the performance is exceptional. Highly recommend for ${isComponent ? 'DIY projects' : 'professional use'}.`,
        date: '2025-09-25',
        verified: true,
        helpful: 42,
        notHelpful: 3,
        userVoted: null,
        isSample: true
      },
      {
        id: 'sample-2', 
        userName: 'Priya Sharma',
        rating: 4,
        title: 'Great Value for Money',
        comment: `Really impressed with this ${isComponent ? 'component' : 'product'}. The sound quality is crisp and clear. ${isComponent ? 'Perfect for my custom speaker build.' : 'Works perfectly with my setup.'}`,
        date: '2025-09-20',
        verified: true,
        helpful: 28,
        notHelpful: 2,
        userVoted: null,
        isSample: true
      },
      {
        id: 'sample-3',
        userName: 'Arjun Patel',
        rating: 5,
        title: 'Professional Grade',
        comment: `Been using this ${isComponent ? 'component' : 'product'} in my studio for weeks now. The clarity and detail are remarkable. ${isComponent ? 'Easy to integrate and excellent specifications.' : 'Definitely worth the investment.'}`,
        date: '2025-09-18',
        verified: true,
        helpful: 35,
        notHelpful: 1,
        userVoted: null,
        isSample: true
      },
      {
        id: 'sample-4',
        userName: 'Neha Gupta',
        rating: 4,
        title: 'Solid Performance',
        comment: `Good ${isComponent ? 'component' : 'product'} overall. The bass response is tight and the highs are well-balanced. ${isComponent ? 'Fits perfectly in my custom enclosure.' : 'Meets my expectations for this price range.'}`,
        date: '2025-09-15',
        verified: true,
        helpful: 19,
        notHelpful: 4,
        userVoted: null,
        isSample: true
      },
      {
        id: 'sample-5',
        userName: 'Vikram Singh',
        rating: 3,
        title: 'Decent but Room for Improvement',
        comment: `This ${isComponent ? 'component' : 'product'} does the job but could be better. ${isComponent ? 'The specifications are adequate but not exceptional.' : 'Performance is acceptable for casual use.'} Still recommended for beginners.`,
        date: '2025-09-12',
        verified: true,
        helpful: 12,
        notHelpful: 8,
        userVoted: null,
        isSample: true
      }
    ];

    return componentReviews;
  };

  // Function to load internal component data
  const loadInternalComponent = async (componentId) => {
    // Extract the component index from the ID (e.g., "internal_component_5" -> 5)
    const componentIndex = parseInt(componentId.split('_')[2]) - 1;
    
    // Create a seeded random function based on component index
    const seededRandom = (seed) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };
    
    // Internal component images list (same as in InternalComponents.jsx)
    const internalComponentImages = [
      // DJ Speaker Components
      'DJSpeaker_Woofer1.png', 'DJSpeaker_HornTweeters2.png', 'DJSpeaker_ProfessionalCrossovers3.png',
      'DJSpeaker_ReinforcedCones4.png', 'DJSpeaker_CoolingSystem5.png', 'DJSpeaker_ProtectiveGrilles6.png',
      'DJSpeaker_PortSystems7.png', 'DJSpeaker_MountingHardware8.png',
      
      // Drums & Percussion Components
      'DrumsPercussion_DrumHeads1.png', 'DrumsPercussion_DrumStickTips2.png', 'DrumsPercussion_DrumShell3.png',
      'DrumsPercussion_TensionRods4.png', 'DrumsPercussion_DrumLugs5.png', 'DrumsPercussion_SnareWires6.png',
      'DrumsPercussion_DrumHoops7.png', 'DrumsPercussion_HihatClutch8.png',
      
      // EarBuds Components
      'EarBuds_Driver6mm_12mm1.png', 'EarBuds_SiliconeEarTipsSet2.png', 'EarBuds_Li-on_Batteries3.png',
      'EarBuds_Bluetooth_5.0_Module4.png', 'EarBuds_Memory_Foam_Tips5.png', 'EarBuds_Charging_Case6.png',
      'Earbud_WirelessChargingCoil7.png', 'Earbud_Cables8.png',
      
      // Earphones Components
      'Earphones_In_ear_Drivers1.png', 'Earphones_Audio Cables_3.5mm2.png', 'Earphones_Y_splitter_Connectors3.png',
      'Earphones_3.5mm_Connectors4.png', 'Earphones_StrainReliefBoots5.png', 'Earphones_CableShielding6.png',
      'Earphones_WireConductors7.png', 'Earphones_CableJackets8.png',
      
      // Guitars & Basses Components
      'GuitarsBasses_HumbuckerPickups1.png', 'GuitarsBasses_SingleCoilPickups2.png', 'GuitarsBasses_GuitarStrings3.png',
      'GuitarsBassesBassStrings4.png', 'GuitarsBasses_Potentiometers5.png', 'GuitarsBasses_Capacitors6.png',
      'GuitarsBasses_GuitarJacks7.png', 'GuitarsBasses_PickupRings8.png',
      
      // HeadPhones Components
      'HeadPhonesDriver1.png', 'HeadPhonesNeodymiumMagnet2.png', 'HeadPhonesVoiceCoil3.png',
      'HeadPhonesDiaphragm4.png', 'HeadPhones_HeadbandPaddingFoam5.png', 'HeadPhonesCables6.png',
      'HeadPhones_EarCupCushion7.png', 'HeadPhones_3.5mm_6.35mmConnectors8.png',
      
      // Speakers Components
      'Speakers_Woofers1.png', 'Speakers_Tweeters2.png', 'Speakers_Driver3.png',
      'Speakers_CrossoverNetworks4.png', 'Speakers_VoiceCoils5.png', 'Speakers_MagnetFerrite6.png',
      'Speakers_Cones7.png', 'Speakers_DustCaps8.png'
    ];

    if (componentIndex < 0 || componentIndex >= internalComponentImages.length) {
      return null;
    }

    const imageName = internalComponentImages[componentIndex];
    const componentInfo = parseComponentName(imageName);
    
    // Generate gallery images for the component (only main image, no fake variants)
    const baseImageName = imageName.replace('.png', '');
    const galleryImages = [
      `/images/internal_components/images/${imageName}` // Only main image: ComponentName.png
    ];
    
    // Calculate pricing using seeded random for consistency
    const basePrice = Math.floor(seededRandom(componentIndex + 1) * 200) + 50;
    const discountPercent = Math.floor(seededRandom(componentIndex + 2) * 25) + 5;
    const originalPrice = Math.floor(basePrice * 1.3);
    const discountedPrice = Math.floor(originalPrice * (1 - discountPercent / 100));
    
    return {
      _id: componentId,
      id: componentId,
      name: componentInfo.name,
      description: `High-quality ${componentInfo.name.toLowerCase()} component for professional audio equipment. Perfect for repairs, upgrades, and custom builds.`,
      image: `/images/internal_components/images/${imageName}`,
      images: galleryImages,
      galleryImages: galleryImages,
      price: discountedPrice,
      originalPrice: originalPrice,
      discountedPrice: discountedPrice,
      discount: discountPercent,
      category: 'internal-components',
      type: componentInfo.type,
      subCategory: componentInfo.category.toLowerCase().replace(/\s+/g, '-'),
      brand: 'SonicMart Components',
      stock: Math.floor(seededRandom(componentIndex + 3) * 50) + 10,
      inStock: true,
      rating: parseFloat((seededRandom(componentIndex + 4) * 1.5 + 3.5).toFixed(1)),
      reviews: Math.floor(seededRandom(componentIndex + 5) * 100) + 10,
      featured: seededRandom(componentIndex + 6) > 0.7,
      tags: ['component', 'internal', componentInfo.type.toLowerCase(), 'replacement'],
      specifications: {
        'Component Type': componentInfo.type,
        'Category': componentInfo.category,
        'Brand': 'SonicMart Components',
        'Application': componentInfo.features.join(', ')
      },
      features: componentInfo.features
    };
  };

  // Function to parse component name (same logic as InternalComponents.jsx)
  const parseComponentName = (imageName) => {
    const baseName = imageName.replace('.png', '');
    const parts = baseName.split('_');
    
    const categoryMap = {
      'DJSpeaker': 'DJ Speaker Components',
      'DrumsPercussion': 'Drums & Percussion Components',
      'EarBuds': 'EarBuds Components',
      'Earbud': 'EarBuds Components',
      'Earphones': 'Earphones Components',
      'GuitarsBasses': 'Guitars & Basses Components',
      'HeadPhones': 'HeadPhones Components',
      'Speakers': 'Speakers Components'
    };

    const category = categoryMap[parts[0]] || 'Audio Components';
    
    let componentName = parts.slice(1).join(' ')
      .replace(/_/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/\d+$/, '')
      .replace(/\b\w/g, l => l.toUpperCase())
      .trim();
    
    if (componentName === '') {
      const lastPart = baseName.split(/(?=[A-Z])/).pop();
      componentName = lastPart.replace(/\d+$/, '').replace(/([a-z])([A-Z])/g, '$1 $2');
    }
    
    let type = 'Specialized Components';
    if (componentName.includes('Driver') || componentName.includes('Woofer')) {
      type = 'Audio Drivers';
    } else if (componentName.includes('Pickup')) {
      type = 'Pickup Systems';
    } else if (componentName.includes('String')) {
      type = 'String Components';
    } else if (componentName.includes('Battery') || componentName.includes('Charging')) {
      type = 'Power Components';
    } else if (componentName.includes('Cable') || componentName.includes('Connector') || componentName.includes('Jack')) {
      type = 'Wiring & Connections';
    } else if (componentName.includes('Bluetooth') || componentName.includes('Module')) {
      type = 'Electronic Modules';
    } else if (componentName.includes('Magnet') || componentName.includes('Coil')) {
      type = 'Magnetic Systems';
    } else if (componentName.includes('Crossover') || componentName.includes('Network')) {
      type = 'Signal Processing';
    } else if (componentName.includes('Mount') || componentName.includes('Hardware') || componentName.includes('Lug') || componentName.includes('Rod')) {
      type = 'Mounting & Hardware';
    } else if (componentName.includes('Tips') || componentName.includes('Foam') || componentName.includes('Cushion') || componentName.includes('Case')) {
      type = 'Comfort & Acoustic';
    } else if (componentName.includes('Tweeter') || componentName.includes('Horn')) {
      type = 'High-Frequency Drivers';
    } else if (componentName.includes('Shell') || componentName.includes('Head') || componentName.includes('Cone')) {
      type = 'Structural Components';
    } else if (componentName.includes('Wire') || componentName.includes('Clutch') || componentName.includes('Hoop')) {
      type = 'Mechanical Components';
    } else if (componentName.includes('Capacitor') || componentName.includes('Potentiometer')) {
      type = 'Electronic Controls';
    } else if (componentName.includes('Grille') || componentName.includes('Dust') || componentName.includes('Port')) {
      type = 'Protection & Ventilation';
    } else if (componentName.includes('Cooling') || componentName.includes('System')) {
      type = 'Thermal Management';
    }
    
    const features = [];
    if (componentName.includes('Professional')) features.push('Professional Grade');
    if (componentName.includes('5.0')) features.push('Bluetooth 5.0');
    if (componentName.includes('6mm') || componentName.includes('12mm')) features.push('Precision Sized');
    if (componentName.includes('Memory Foam')) features.push('Memory Foam Technology');
    if (componentName.includes('Silicone')) features.push('Silicone Material');
    if (componentName.includes('Neodymium')) features.push('Neodymium Magnet');
    if (componentName.includes('Li-on')) features.push('Lithium Ion');
    if (componentName.includes('Wireless')) features.push('Wireless Technology');
    if (componentName.includes('3.5mm') || componentName.includes('6.35mm')) features.push('Standard Connector');
    if (componentName.includes('Reinforced')) features.push('Reinforced Construction');
    if (componentName.includes('Protective')) features.push('Protective Design');
    if (componentName.includes('Horn')) features.push('Horn-Loaded Design');
    if (componentName.includes('Ferrite')) features.push('Ferrite Core');
    
    if (features.length === 0) {
      features.push('High Quality', 'Professional Use', 'Durable Construction');
    }
    
    return {
      name: componentName,
      category: category,
      type: type,
      features: features
    };
  };

  const loadProduct = async () => {
    try {
      setLoading(true);
      setError(null);
      let response;
      
      // Check if this is an internal component based on the current route
      const isComponentRoute = window.location.pathname.includes('/component/');
      
      if (isComponentRoute && id && id.startsWith('internal_component_')) {
        // Handle internal component - now load from backend to get review data
        try {
          response = await productsAPI.getProduct(id);
          setProduct(response.data.product);
          setSelectedImage(0);
        } catch (error) {
          // Fallback to local component data if backend fails
          const componentData = await loadInternalComponent(id);
          if (componentData) {
            setProduct(componentData);
            setSelectedImage(0);
          } else {
            throw new Error('Internal component not found');
          }
        }
      } else if (slug) {
        response = await productsAPI.getProductBySlug(slug);
        setProduct(response.data.product);
        setSelectedImage(0);
      } else {
        response = await productsAPI.getProduct(id);
        setProduct(response.data.product);
        setSelectedImage(0);
      }
      
      // Apply deal pricing if coming from deals page
      const isDeal = searchParams.get('deal') === 'true';
      if (isDeal && response && response.data.product) {
        const dealPrice = parseFloat(searchParams.get('dealPrice'));
        const originalPrice = parseFloat(searchParams.get('originalPrice'));
        const discount = parseFloat(searchParams.get('discount'));
        
        if (dealPrice && originalPrice && discount) {
          const productWithDealPricing = {
            ...response.data.product,
            price: dealPrice,
            originalPrice: originalPrice,
            discountedPrice: dealPrice,
            discount: discount,
            type: 'special-deal',
            dealInfo: {
              dealTitle: `${discount}% OFF - Limited Time!`,
              dealDescription: `Special discount on ${response.data.product.name}`,
              dealDiscount: discount,
              validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }
          };
          setProduct(productWithDealPricing);
        }
      }
       // Load reviews from the product data and add sample reviews for reference
      // Use the current product state (which may include deal pricing) for reviews
      const currentProduct = product || (response && response.data.product);
      if (currentProduct) {
        const product = currentProduct;
        let combinedReviews = [];
        let finalReviewStats = { ...reviewStats }; // Start with default stats
        
        // Handle internal components (they have their own review system)
        if (isComponentRoute) {
          // Add real internal component reviews if they exist
          if (product.reviews && product.reviews.length > 0) {
            const componentReviews = product.reviews.map(review => ({
              id: review._id,
              userName: review.name,
              rating: review.rating,
              title: review.title || '',
              comment: review.comment,
              date: new Date(review.createdAt || Date.now()).toISOString().split('T')[0],
              verified: true,
              helpful: review.helpful || 0,
              notHelpful: review.notHelpful || 0,
              userVoted: null,
              isSample: false
            }));
            combinedReviews = [...componentReviews];
            
            // Calculate stats from real reviews
            const avgRating = componentReviews.reduce((sum, r) => sum + r.rating, 0) / componentReviews.length;
            const starBreakdown = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
            componentReviews.forEach(r => starBreakdown[r.rating]++);
            
            finalReviewStats = {
              averageRating: Math.round(avgRating * 10) / 10,
              totalReviews: componentReviews.length,
              starBreakdown
            };
          }
          // Use database rating stats if available (CRITICAL FIX FOR INTERNAL COMPONENTS)
          else if ((product.averageRating && product.totalReviews) || (product.rating && product.reviewCount)) {
            const avgRating = product.averageRating || product.rating;
            const totalReviews = product.totalReviews || product.reviewCount;
            
            // Generate plausible star breakdown
            const starBreakdown = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
            const mainRating = Math.round(avgRating);
            
            starBreakdown[mainRating] = Math.floor(totalReviews * 0.6);
            if (mainRating > 1) starBreakdown[mainRating - 1] = Math.floor(totalReviews * 0.2);
            if (mainRating < 5) starBreakdown[mainRating + 1] = Math.floor(totalReviews * 0.15);
            if (mainRating > 2) starBreakdown[mainRating - 2] = Math.floor(totalReviews * 0.03);
            if (mainRating < 4) starBreakdown[mainRating + 2] = Math.floor(totalReviews * 0.02);
            
            finalReviewStats = {
              averageRating: avgRating,
              totalReviews: totalReviews,
              starBreakdown
            };
          }
          
          // Always add sample reviews for reference
          const sampleReviews = generateSampleReviews(product.name, true);
          combinedReviews = [...combinedReviews, ...sampleReviews];
        }
        // Handle regular products
        else {
          // Add real product reviews if they exist
          if (product.reviews && product.reviews.length > 0) {
            const productReviews = product.reviews.map(review => ({
              id: review._id,
              userName: review.name,
              rating: review.rating,
              title: '',
              comment: review.comment,
              date: new Date(review.createdAt || Date.now()).toISOString().split('T')[0],
              verified: true,
              helpful: review.helpful || 0,
              notHelpful: review.notHelpful || 0,
              userVoted: null,
              isSample: false
            }));
            combinedReviews = [...productReviews];
            
            // Calculate stats from real reviews
            const avgRating = productReviews.reduce((sum, r) => sum + r.rating, 0) / productReviews.length;
            const starBreakdown = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
            productReviews.forEach(r => starBreakdown[r.rating]++);
            
            finalReviewStats = {
              averageRating: Math.round(avgRating * 10) / 10,
              totalReviews: productReviews.length,
              starBreakdown
            };
          }
          // Use database rating stats if available
          else if ((product.averageRating && product.totalReviews) || (product.rating && product.reviewCount)) {
            const avgRating = product.averageRating || product.rating;
            const totalReviews = product.totalReviews || product.reviewCount;
            
            // Generate plausible star breakdown
            const starBreakdown = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
            const mainRating = Math.round(avgRating);
            
            starBreakdown[mainRating] = Math.floor(totalReviews * 0.6);
            if (mainRating > 1) starBreakdown[mainRating - 1] = Math.floor(totalReviews * 0.2);
            if (mainRating < 5) starBreakdown[mainRating + 1] = Math.floor(totalReviews * 0.15);
            if (mainRating > 2) starBreakdown[mainRating - 2] = Math.floor(totalReviews * 0.03);
            if (mainRating < 4) starBreakdown[mainRating + 2] = Math.floor(totalReviews * 0.02);
            
            finalReviewStats = {
              averageRating: avgRating,
              totalReviews: totalReviews,
              starBreakdown
            };
          }
          
          // Always add sample reviews for reference
          const sampleReviews = generateSampleReviews(product.name, false);
          combinedReviews = [...combinedReviews, ...sampleReviews];
        }
        
        setReviews(combinedReviews);
        setReviewStats(finalReviewStats);
      } else {
        // No product data available - use empty state
        setReviews([]);
        setReviewStats({
          averageRating: 0,
          totalReviews: 0,
          starBreakdown: {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
        });
      }

    } catch (err) {
      console.error('Error loading product:', err);
      setError(err.message);
      
      // Redirect to products page if product not found or server error
      if (err.message.includes('not found') || 
          err.message.includes('Server error') ||
          err.message.includes('Product not found')) {
        console.log('Redirecting to products page due to product not found');
        setTimeout(() => {
          navigate('/products');
        }, 2000); // Give user time to read the error message
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id || slug) {
      loadProduct();
    } else {
      setError('No product identifier provided');
      setLoading(false);
    }
  }, [id, slug, navigate]);

  const handleToggleWishlist = async (e) => {
    if (e) e.stopPropagation();
    if (!product) return;
    const productId = product._id || product.id;
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
    } else {
      await addToWishlist(productId);
    }
  };

  const handleToggleComparison = (e) => {
    if (e) e.stopPropagation();
    if (!product) return;
    const productId = product._id || product.id;
    if (isInComparison(productId)) {
      removeFromComparison(productId);
    } else {
      addToComparison(product);
    }
  };

  // Helper function to get product with correct price for cart
  const getProductForCart = (product) => {
    const correctPrice = product.discountedPrice || product.price;
    return {
      ...product,
      price: correctPrice
    };
  };

  const handleBuyNow = () => {
    // Add to cart first, then navigate to cart/checkout
    addToCart(getProductForCart(product));
    // Navigate to cart page for immediate checkout
    navigate('/cart');
  };

  if (loading) {
    return (
      <div 
        className="flex justify-center items-center h-screen"
        style={{ backgroundColor: '#FEFCF3' }}
      >
        <div className="text-center">
          <div 
            className="animate-spin rounded-full h-32 w-32 border-b-4 mx-auto"
            style={{ borderColor: '#FF6B6B' }}
          ></div>
          <p className="mt-6 text-lg font-medium" style={{ color: '#2C3E50' }}>
            Loading product details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div 
        className="flex justify-center items-center h-screen"
        style={{ backgroundColor: '#FEFCF3' }}
      >
        <div className="text-center max-w-md mx-auto p-8">
          <div className="text-6xl mb-6"></div>
          <h1 className="text-3xl font-bold mb-4" style={{ color: '#2C3E50' }}>
            Product Not Found
          </h1>
          <p className="mb-6 text-lg" style={{ color: '#2C3E50', opacity: 0.7 }}>{error}</p>
          <button 
            onClick={() => navigate('/products')}
            className="px-8 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            style={{ backgroundColor: '#FF6B6B' }}
          >
            ← Back to Products
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div 
        className="flex justify-center items-center h-screen"
        style={{ backgroundColor: '#FEFCF3' }}
      >
        <div className="animate-pulse text-xl font-medium" style={{ color: '#2C3E50' }}>
          Product not found...
        </div>
      </div>
    );
  }

  // Collect main product images (max 5 images)
  const productImages = [];
  
  // Check if this is an internal component from database
  const isInternalComponent = product && product.category === 'internal-components';
  
  if (isInternalComponent) {
    // For internal components from database, use the images array directly
    // The database already has: images: [main, variant1, variant2, variant3]
    if (product.images && product.images.length > 0) {
      productImages.push(...product.images.slice(0, 5));
    } else if (product.image) {
      // Fallback to single image if images array is empty
      productImages.push(product.image);
    }
  } else {
    // For regular products, check images array first, then galleryImages, then generate variants
    
    // If product has images array (like drums-percussion), use it directly
    if (product.images && product.images.length > 0) {
      productImages.push(...product.images.slice(0, 5));
    } else {
      // Fallback to old logic for products without images array
      // Add main product image
      if (product.image) {
        productImages.push(product.image);
      }
      
      // Add main product gallery images (only skip actual technical component images for regular products)
      if (product.galleryImages && product.galleryImages.length > 0) {
        product.galleryImages.forEach(img => {
          // Only skip component images from internal_components folder for regular products
          const isComponentImage = img.includes('/internal_components/') || (
            img.includes('_') && (
              img.includes('Driver') || img.includes('Chip') || img.includes('Module') ||
              img.includes('Battery') || img.includes('Cable') || img.includes('Coil') ||
              img.includes('Tweeter') || img.includes('Woofer') || img.includes('Crossover') ||
              img.includes('Pickup') || img.includes('Capacitor') || img.includes('Voice') ||
              img.includes('Magnet') || img.includes('Diaphragm') || img.includes('Foam') ||
              img.includes('Connector') || img.includes('Tips') || img.includes('Case') ||
              img.includes('Cooling') || img.includes('Mount') || img.includes('Port') ||
              img.includes('Grille') || img.includes('Cone') || img.includes('Head') ||
              img.includes('Shell') || img.includes('Rod') || img.includes('Lug')
            )
          );
          
          if (!isComponentImage && productImages.length < 5 && !productImages.includes(img)) {
            productImages.push(img);
          }
        });
      }
      
      // Only add variant images if we really need more and they exist
      // Skip automatic variant generation to avoid showing duplicate images
      // Only use images that are explicitly provided
    }
  }
  
  // Limit to 5 images and process URLs
  const allImages = productImages.slice(0, 5).filter(Boolean).map(img => getImageUrl(img));

  const handleImgError = (e) => {
    const img = e.currentTarget;
    if (!img.src.includes('/images/DJSpeaker1.png')) {
      img.src = getImageUrl('/images/DJSpeaker1.png');
    }
  };



  return (
    <div 
      className="min-h-screen py-4 sm:py-8"
      style={{ backgroundColor: '#FEFCF3' }}
    >
      {/* Breadcrumb Navigation - Enhanced Mobile */}
      <div className="container mx-auto px-3 sm:px-4 mb-3 sm:mb-6">
        <nav className="flex items-center space-x-2 text-xs sm:text-sm overflow-x-auto pb-2 sm:pb-0">
          <button 
            onClick={() => navigate('/')}
            className="transition-colors duration-200 whitespace-nowrap flex-shrink-0 touch-target py-1"
            style={{ color: '#2C3E50' }}
            onMouseEnter={(e) => e.target.style.color = '#FF6B6B'}
            onMouseLeave={(e) => e.target.style.color = '#2C3E50'}
          >
            Home
          </button>
          <span style={{ color: '#2C3E50', opacity: 0.5 }} className="flex-shrink-0">→</span>
          <button 
            onClick={() => navigate('/products')}
            className="transition-colors duration-200 whitespace-nowrap flex-shrink-0 touch-target py-1"
            style={{ color: '#2C3E50' }}
            onMouseEnter={(e) => e.target.style.color = '#FF6B6B'}
            onMouseLeave={(e) => e.target.style.color = '#2C3E50'}
          >
            Products
          </button>
          <span style={{ color: '#2C3E50', opacity: 0.5 }} className="flex-shrink-0">→</span>
          <span style={{ color: '#FF6B6B', fontWeight: 'bold' }} className="truncate text-xs sm:text-sm">{product.name}</span>
        </nav>
      </div>

      <div className="container mx-auto px-2 sm:px-4 lg:px-6">
        <div 
          className="max-w-screen-2xl mx-auto rounded-lg sm:rounded-xl lg:rounded-3xl shadow-md sm:shadow-lg lg:shadow-2xl p-3 sm:p-6 lg:p-8 border sm:border-2"
          style={{ 
            backgroundColor: 'white',
            borderColor: '#F8F9FA'
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-12">
            {/* Enhanced Mobile Image Gallery */}
            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              {/* Gallery Container with Enhanced Mobile Layout */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                {/* Thumbnail Gallery - Horizontal on Mobile, Vertical on Desktop */}
                {allImages.length > 1 && (
                  <div className="flex sm:flex-col gap-2 w-full sm:w-16 lg:w-20 overflow-x-auto sm:overflow-x-visible pb-2 sm:pb-0 scrollbar-hide">
                    {allImages.map((img, index) => (
                      <button
                        key={`${img}-${index}`}
                        onClick={() => setSelectedImage(index)}
                        className={`aspect-square rounded-md overflow-hidden border-2 transition-all duration-300 hover:scale-105 shadow-sm hover:shadow-md flex-shrink-0 w-14 sm:w-full touch-target`}
                        style={{
                          backgroundColor: '#F8F9FA',
                          borderColor: selectedImage === index ? '#FF6B6B' : '#E5E7EB'
                        }}
                      >
                        <img 
                          src={img} 
                          alt={`${product.name} view ${index + 1}`}
                          className="w-full h-full object-contain p-0.5 sm:p-1" 
                          onError={handleImgError} 
                          data-tries="0" 
                        />
                      </button>
                    ))}
                  </div>
                )}

                {/* Main Product Image - Enhanced Mobile */}
                <div 
                  className="flex-1 overflow-hidden rounded-lg sm:rounded-xl lg:rounded-2xl shadow-md sm:shadow-lg border-2 relative bg-white aspect-square"
                  style={{ 
                    backgroundColor: '#FFFFFF',
                    borderColor: '#E5E7EB',
                    border: '2px solid #E5E7EB'
                  }}
                >
                  {/* Action Icons - Enhanced Mobile Layout */}
                  {product && (
                    <div className="absolute top-2 sm:top-3 lg:top-4 right-2 sm:right-3 lg:right-4 z-20 flex flex-col gap-1.5 sm:gap-2">
                      <button
                        onClick={handleToggleWishlist}
                        className="p-1.5 sm:p-2 lg:p-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-110 group/wishlist touch-target"
                        style={{ backgroundColor: '#F8F9FA' }}
                      >
                        <Heart
                          className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 ${
                            isInWishlist(product._id || product.id)
                              ? 'scale-110'
                              : 'group-hover/wishlist:scale-110'
                          }`}
                          style={{ 
                            color: isInWishlist(product._id || product.id) ? '#FF6B6B' : '#2C3E50',
                            fill: isInWishlist(product._id || product.id) ? '#FF6B6B' : 'none'
                          }}
                        />
                      </button>
                      
                      <button
                        onClick={handleToggleComparison}
                        className="p-1.5 sm:p-2 lg:p-2.5 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-110 group/compare touch-target"
                        style={{ 
                          backgroundColor: isInComparison(product._id || product.id) ? '#20B2AA' : '#F8F9FA'
                        }}
                      >
                        <Scale
                          className={`w-4 h-4 sm:w-5 sm:h-5 transition-all duration-300 ${
                            isInComparison(product._id || product.id)
                              ? 'scale-110'
                              : 'group-hover/compare:scale-110'
                          }`}
                          style={{ 
                            color: isInComparison(product._id || product.id) ? 'white' : '#2C3E50'
                          }}
                        />
                      </button>
                    </div>
                  )}
                  
                  <img
                    src={allImages[selectedImage] || getImageUrl('/images/DJSpeaker1.png')}
                    alt={product.name}
                    className="w-full h-full object-contain p-1 sm:p-2 transition-transform duration-500 hover:scale-105"
                    onError={handleImgError}
                    data-tries="0"
                  />
                </div>
              </div>
              
            </div>
            {/* Enhanced Product Details - Mobile Optimized */}
            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              {/* Product Header - Enhanced Mobile */}
              <div>
                {/* Brand Display */}
                {product.brand && (
                  <div 
                    className="text-xs sm:text-sm font-bold uppercase tracking-wider mb-2 sm:mb-3"
                    style={{ color: '#20B2AA' }}
                  >
                    {product.brand}
                  </div>
                )}
                <div 
                  className="inline-block px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-bold mb-2 sm:mb-3"
                  style={{ backgroundColor: '#20B2AA', color: 'white' }}
                >
                  Premium Audio
                </div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-2 sm:mb-3 lg:mb-4 leading-tight" style={{ color: '#2C3E50' }}>{product.name}</h1>
                <p className="text-sm sm:text-base lg:text-lg leading-relaxed" style={{ color: '#2C3E50', opacity: 0.7 }}>{product.description}</p>
              </div>

              {/* Enhanced Pricing - Mobile Optimized */}
              <div 
                className="p-3 sm:p-4 lg:p-6 rounded-lg sm:rounded-xl lg:rounded-2xl border-2"
                style={{ 
                  backgroundColor: '#F8F9FA',
                  borderColor: '#F8F9FA'
                }}
              >
                <div className="flex items-baseline gap-2 sm:gap-3 lg:gap-4 mb-2 sm:mb-3 flex-wrap">
                  <span className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold" style={{ color: '#FF6B6B' }}>
                    ₹{Math.round(product.discountedPrice || product.price).toLocaleString('en-IN')}
                  </span>
                  {product.originalPrice && product.originalPrice !== (product.discountedPrice || product.price) && (
                    <span className="text-base sm:text-lg lg:text-xl line-through" style={{ color: '#2C3E50', opacity: 0.5 }}>
                      ₹{Math.round(product.originalPrice).toLocaleString('en-IN')}
                    </span>
                  )}
                </div>
                {product.originalPrice && product.originalPrice !== (product.discountedPrice || product.price) && (
                  <div 
                    className="inline-block px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg lg:rounded-xl font-bold text-xs sm:text-sm"
                    style={{ backgroundColor: '#FF6B6B', color: 'white' }}
                  >
                    Save ₹{Math.round(product.originalPrice - (product.discountedPrice || product.price)).toLocaleString('en-IN')} - Limited Time!
                  </div>
                )}
              </div>

              {/* Action Tiles - Large layout (like first image) */}
              <div className="mt-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Add to Cart Tile */}
                  <button
                    onClick={() => addToCart(getProductForCart(product))}
                    className="w-full h-14 sm:h-16 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 flex items-center justify-center px-6"
                    style={{
                      background: 'linear-gradient(135deg, #E56B6B, #1FAAA4)',
                      color: 'white'
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <ShoppingCart size={28} />
                      <div className="text-center font-semibold text-white">
                        <span className="text-base sm:text-lg leading-tight">Add to Cart</span>
                      </div>
                    </div>
                  </button>

                  {/* Buy Now Tile */}
                  <button
                    onClick={handleBuyNow}
                    className="w-full h-14 sm:h-16 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-200 flex items-center justify-center px-6"
                    style={{
                      background: 'linear-gradient(135deg, #1FAAA4, #E56B6B)',
                      color: 'white'
                    }}
                  >
                    <div className="flex items-center gap-4">
                      <Zap size={28} />
                      <div className="text-center font-semibold text-white">
                        <span className="text-base sm:text-lg leading-tight">Buy Now</span>
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Enhanced Features - Mobile Optimized */}
              <div 
                className="p-3 sm:p-4 lg:p-6 rounded-lg sm:rounded-xl lg:rounded-2xl border-2"
                style={{ 
                  backgroundColor: 'white',
                  borderColor: '#F8F9FA'
                }}
              >
                <h3 className="text-base sm:text-lg lg:text-xl font-bold mb-2 sm:mb-3 lg:mb-4" style={{ color: '#2C3E50' }}>
                  What You Get
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div 
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#20B2AA' }}
                    >
                      <span className="text-white text-xs sm:text-sm">🚚</span>
                    </div>
                    <span className="text-sm sm:text-base" style={{ color: '#2C3E50' }}>Free Delivery on orders above ₹999</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#FF6B6B' }}
                    >
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm sm:text-base" style={{ color: '#2C3E50' }}>100% Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#20B2AA' }}
                    >
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm sm:text-base" style={{ color: '#2C3E50' }}>7 Days Easy Return & Exchange</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: '#FF6B6B' }}
                    >
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span className="text-sm sm:text-base" style={{ color: '#2C3E50' }}>1 Year Warranty Included</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Key Features Section - Full Width with Mobile Optimization */}
          <div 
            className="mt-4 sm:mt-6 lg:mt-12 p-3 sm:p-5 lg:p-9 rounded-lg sm:rounded-xl lg:rounded-2xl border-2"
            style={{ 
              backgroundColor: '#FEFCF3',
              borderColor: '#F8F9FA'
            }}
          >
            <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold mb-4 sm:mb-6 lg:mb-8 text-center" style={{ color: '#2C3E50' }}>
              Key Features
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 lg:gap-8 xl:gap-10">
              {/* Feature 1 */}
              <div 
                className="flex flex-col items-center text-center gap-3 sm:gap-4 p-4 sm:p-6 lg:p-8 rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 touch-target"
                style={{ backgroundColor: 'white' }}
              >
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12" fill="currentColor" style={{ color: '#20B2AA' }} viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 11-1.414-1.414A7.971 7.971 0 0017 12c0-1.594-.471-3.076-1.343-4.243a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 12a5.984 5.984 0 01-.757 2.829 1 1 0 11-1.415-1.414A3.987 3.987 0 0013 12a3.988 3.988 0 00-.172-1.172 1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-sm sm:text-base lg:text-lg mb-1 sm:mb-2" style={{ color: '#2C3E50' }}>Premium Audio</h4>
                  <p className="text-xs sm:text-sm lg:text-base text-gray-600 leading-relaxed">High-quality sound experience</p>
                </div>
              </div>
              
              {/* Feature 2 */}
              <div 
                className="flex flex-col items-center text-center gap-3 sm:gap-4 p-4 sm:p-6 lg:p-8 rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 touch-target"
                style={{ backgroundColor: 'white' }}
              >
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12" fill="currentColor" style={{ color: '#FF6B6B' }} viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-sm sm:text-base lg:text-lg mb-1 sm:mb-2" style={{ color: '#2C3E50' }}>Advanced Tech</h4>
                  <p className="text-xs sm:text-sm lg:text-base text-gray-600 leading-relaxed">Long battery & features</p>
                </div>
              </div>
              
              {/* Feature 3 */}
              <div 
                className="flex flex-col items-center text-center gap-3 sm:gap-4 p-4 sm:p-6 lg:p-8 rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 touch-target"
                style={{ backgroundColor: 'white' }}
              >
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12" fill="currentColor" style={{ color: '#20B2AA' }} viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-sm sm:text-base lg:text-lg mb-1 sm:mb-2" style={{ color: '#2C3E50' }}>Modern Design</h4>
                  <p className="text-xs sm:text-sm lg:text-base text-gray-600 leading-relaxed">Sleek & comfortable fit</p>
                </div>
              </div>
              
              {/* Feature 4 */}
              <div 
                className="flex flex-col items-center text-center gap-3 sm:gap-4 p-4 sm:p-6 lg:p-8 rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 touch-target"
                style={{ backgroundColor: 'white' }}
              >
                <div className="flex-shrink-0">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12" fill="currentColor" style={{ color: '#FF6B6B' }} viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-sm sm:text-base lg:text-lg mb-1 sm:mb-2" style={{ color: '#2C3E50' }}>Professional Grade</h4>
                  <p className="text-xs sm:text-sm lg:text-base text-gray-600 leading-relaxed">High-end components</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section - Enhanced Mobile */}
        <div className="mt-8 sm:mt-12 lg:mt-16">
          <div 
            className="rounded-lg sm:rounded-xl lg:rounded-2xl shadow-md sm:shadow-lg border p-3 sm:p-6 lg:p-8"
            style={{ 
              backgroundColor: 'white',
              borderColor: '#F8F9FA'
            }}
          >
            <ReviewsSection 
               product={product}
               reviews={reviews}
               setReviews={setReviews}
               reviewStats={reviewStats}
               setReviewStats={setReviewStats}
               onReviewSubmitted={loadProduct}
             />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;