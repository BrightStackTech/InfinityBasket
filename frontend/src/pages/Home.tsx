import { useState, useRef, useEffect } from 'react';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useMotionValue, animate } from 'framer-motion';
import { FaTruck, FaShieldAlt, FaStar, FaPercent, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaWhatsapp, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import createGlobe from 'cobe';
import WhatsappActionButton from '../components/WhatsappActionButton';
import ProductCard from '../components/ProductCard';
import api from '../api/config';


interface Product {
  _id: string;
  name: string;
  images: string[];
  brand?: string;
  featured: boolean;
}

interface ContactDetails {
  email: string;
  phone: string;
  location: string;
  hours: string;
  instagram: string;
  facebook: string;
  twitter: string;
}

const AnimatedCounter = ({ value, className }: { value: number, className?: string }) => {
  const [isInView, setIsInView] = useState(false);
  const countingNumber = useMotionValue(0);
  const roundedNumber = useTransform(countingNumber, Math.round);
  const [displayNumber, setDisplayNumber] = useState(0);

  useEffect(() => {
    if (isInView) {
      animate(countingNumber, value, {
        duration: 2,
        ease: "easeOut",
      });
    }
  }, [isInView, value, countingNumber]);

  useEffect(() => {
    const unsubscribe = roundedNumber.on("change", (v) => {
      setDisplayNumber(v);
    });
    return () => unsubscribe();
  }, [roundedNumber]);

  return (
    <motion.span
      className={className}
      onViewportEnter={() => setIsInView(true)}
      viewport={{ once: true, amount: 0.8 }}
    >
      {displayNumber}+
    </motion.span>
  );
};

const Globe = ({ className }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isPausedRef = useRef(false);

  useEffect(() => {
    let phi = 0;

    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 600 * 2,
      height: 600 * 2,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [1, 0.8, 0.1], // Gold color for markers
      glowColor: [1, 1, 1],
      markers: [
        // Add your business locations here
        { location: [19.0760, 72.8777], size: 0.1 }, // Mumbai
        { location: [28.6139, 77.2090], size: 0.1 }, // Delhi
        { location: [13.0827, 80.2707], size: 0.1 }, // Chennai
      ],
      onRender: (state: any) => {
        // Only update phi if not paused
        if (!isPausedRef.current) {
          state.phi = phi;
          phi += 0.01;
        }
      },
    });

    const handleStart = () => {
      isPausedRef.current = true;
    };

    const handleEnd = () => {
      isPausedRef.current = false;
    };

    // Add event listeners for both mouse and touch events
    canvasRef.current.addEventListener('mousedown', handleStart);
    canvasRef.current.addEventListener('mouseup', handleEnd);
    canvasRef.current.addEventListener('mouseleave', handleEnd);
    canvasRef.current.addEventListener('touchstart', handleStart);
    canvasRef.current.addEventListener('touchend', handleEnd);

    return () => {
      if (canvasRef.current) {
        canvasRef.current.removeEventListener('mousedown', handleStart);
        canvasRef.current.removeEventListener('mouseup', handleEnd);
        canvasRef.current.removeEventListener('mouseleave', handleEnd);
        canvasRef.current.removeEventListener('touchstart', handleStart);
        canvasRef.current.removeEventListener('touchend', handleEnd);
      }
      globe.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ 
        width: "600px",
        height: "600px",
        maxWidth: "none",
        cursor: "inherit"
      }}
      className={`${className} select-none touch-none`}
    />
  );
};

const TypewriterText = ({ text, className = "" }: { text: string; className?: string }) => {
  const [displayText, setDisplayText] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [isErasing, setIsErasing] = useState(false);

  React.useEffect(() => {
    let currentIndex = isErasing ? text.length : 0;
    let timeoutId: ReturnType<typeof setTimeout>;

    const typingInterval = setInterval(() => {
      if (!isErasing) {
        if (currentIndex <= text.length) {
          setDisplayText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(typingInterval);
          // Wait for 2 seconds before starting to erase
          timeoutId = setTimeout(() => {
            setIsErasing(true);
          }, 2000);
        }
      } else {
        if (currentIndex >= 0) {
          setDisplayText(text.slice(0, currentIndex));
          currentIndex--;
        } else {
          clearInterval(typingInterval);
          setIsErasing(false);
        }
      }
    }, isErasing ? 50 : 100); // Erasing is faster than typing

    // Cursor blinking effect
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);

    return () => {
      clearInterval(typingInterval);
      clearInterval(cursorInterval);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [text, isErasing]);

  return (
    <span className={`inline-flex items-center ${className}`}>
      {displayText}
      <span className={`${showCursor ? 'opacity-100' : 'opacity-0'} transition-opacity ml-1`}>|</span>
    </span>
  );
};

const Home = () => {
  const [email, setEmail] = useState('');
  const featuredSectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: featuredSectionRef,
    offset: ["start start", "end end"]
  });
  const productsX = useTransform(scrollYProgress, [0, 1], ["25%", "-39.666%"]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [contactDetails, setContactDetails] = useState<ContactDetails>({
    email: '',
    phone: '',
    location: '',
    hours: '',
    instagram: '',
    facebook: '',
    twitter: ''
  });

  useEffect(() => {
    const fetchContactDetails = async () => {
      try {
        const response = await api.get('/contact/details');
        if (response.data) {
          setContactDetails(response.data);
        }
      } catch (error) {
        console.error('Failed to load contact details:', error);
      }
    };

    fetchContactDetails();
  }, []);

  const features = [
    {
      icon: <FaTruck className="text-4xl text-blue-600" />,
      title: "Fast Delivery",
      description: "Next-day delivery available on all orders"
    },
    {
      icon: <FaShieldAlt className="text-4xl text-blue-600" />,
      title: "Quality Assured",
      description: "All products pass our strict quality checks"
    },
    {
      icon: <FaStar className="text-4xl text-blue-600" />,
      title: "Premium Brands",
      description: "Shop from top international brands"
    },
    {
      icon: <FaPercent className="text-4xl text-blue-600" />,
      title: "Best Prices",
      description: "Competitive prices on all products"
    }
  ];


  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter signup logic here
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await api.get('/products');
        const products = response.data;
        const featured = products.filter((product: Product) => product.featured);
        setFeaturedProducts(featured);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      {/* Hero Section */}
      <section className="relative h-[90vh] overflow-hidden">
        <motion.div
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 bg-[url('/images/hero-bg.jpg')] bg-cover bg-center bg-fixed"
        />
        <div className="absolute inset-0 bg-black/40 dark:bg-black/60" />
        <div className="container mx-auto h-full relative z-10">
          <div className="flex flex-col justify-center h-full max-w-4xl px-6 md:px-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-lg">
                Premium FMCG Products for Global Markets
              </h1>
              <p className="text-lg md:text-xl text-white/90 dark:text-white/95 mb-8 drop-shadow-md">
                Discover our extensive collection of high-quality fast-moving consumer goods
              </p>
              <Link to="/products" className="px-8 py-4 bg-gold-500 text-white rounded-lg text-lg font-medium hover:bg-gold-600 transition duration-300">
                Explore Products
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Us Section (Top) */}
      <motion.section 
        className="sticky md:top-5 -top-[400px] py-12 md:py-24 bg-gray-50 dark:bg-gray-800 transition-colors min-h-screen z-10 mb-0 md:mb-[400px]"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
      >
        <div className="container mx-auto px-8 md:px-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 dark:text-white">
            <TypewriterText text="Who are we & What we do?" className="break-words whitespace-normal inline-flex flex-wrap justify-center" />
          </h2>
          <div className="h-1 w-24 bg-gold-500 mx-auto mb-8 md:mb-16"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
            <div className="space-y-6">
              <motion.h3 
                initial={{ opacity: 0, x: -10, y: -70 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: -10, y: -70 }}
                viewport={{ amount: 0.25, once: false }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="text-3xl font-bold text-gold-500"
              >
                Leading FMCG Distributor in Global Markets
              </motion.h3>
              <motion.p 
                initial={{ opacity: 0, x: -10, y: -70 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: -10, y: -70 }}
                viewport={{ amount: 0.25, once: false }}
                transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed"
              >
                At InfinityBasket, we pride ourselves on being a premier distributor of Fast-Moving Consumer Goods (FMCG) across global markets. With years of industry expertise and a commitment to excellence, we connect quality products with consumers worldwide.
              </motion.p>
              <motion.p 
                initial={{ opacity: 0, x: -10, y: -70 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: -10, y: -70 }}
                viewport={{ amount: 0.25, once: false }}
                transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
                className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed"
              >
                Our extensive network and strategic partnerships enable us to offer a diverse range of products while maintaining the highest standards of quality and service. We understand the dynamic nature of the FMCG sector and continuously adapt to meet evolving market demands.
              </motion.p>
            </div>
            <div className="relative flex items-center justify-center transition-colors">
              <img src="https://res.cloudinary.com/dvb5mesnd/image/upload/v1754402979/infinitybasketwall_xssffz.jpg" alt="About Us"
                className="w-auto h-[300px] md:h-[450px] rounded-xl shadow-lg transition-colors mt-2 md:mt-0 border-gold-500 md:border-[8px] border-[4px] hover:transform hover:scale-105 ease-in-out duration-10 cursor-pointer" />
            </div>
          </div>
          <div className='mt-10 text-center'>
            <h1 className=" text-2xl font-bold text-gray-600 dark:text-gray-300">We have variety of products such as,</h1>
          </div>
        </div>
      </motion.section>

      <div 
        ref={featuredSectionRef}
        className="relative py-12 md:py-0 bg-white dark:bg-gray-900 z-20 md:h-[200vh] h-[135vh]"
      >
        {/* Mobile Layout */}
        <div className="md:hidden container mx-auto px-8">
          <h2 className="text-3xl font-bold text-center mb-4 dark:text-white">Featured Products</h2>
          <div className="h-1 w-24 bg-gold-500 mx-auto mb-8"></div>
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
            </div>
          ) : featuredProducts.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">No featured products available</p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  mobileHeight="280px"
                  height=""
                />
              ))}
            </div>
          )}
          <div className="text-center py-8 bg-white dark:bg-gray-900">
            <Link to="/products" className="inline-block px-4 py-2 bg-gold-500 text-white rounded-lg text-sm font-medium hover:bg-gold-600 transition duration-300">
              View All Products
            </Link>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:block h-screen sticky top-10">
          <div className="py-8 bg-white dark:bg-gray-900 z-10">
            <h2 className="text-4xl font-bold text-center mb-2 dark:text-white mt-8">Featured Products</h2>
            <div className="h-1 w-24 bg-gold-500 mx-auto"></div>
          </div>
          {isLoading ? (
            <div className="flex justify-center items-center h-[calc(90vh-12rem)]">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
            </div>
          ) : featuredProducts.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 mt-8">No featured products available</p>
          ) : (
            <div className="relative h-[calc(90vh-12rem)] overflow-hidden pt-4"
              onWheel={(e) => {
                const progress = scrollYProgress.get();
                if (progress > 0 && progress < 1) {
                  e.preventDefault();
                  window.scrollBy(0, e.deltaY);
                }
              }}
            >
              <motion.div
                className="flex gap-8 min-w-max px-[50vw]"
                style={{ x: productsX }}
              >
                {featuredProducts.map((product) => (
                  <div key={product._id} className="w-80 flex-shrink-0">
                    <ProductCard
                      product={product}
                      height="440px"
                    />
                  </div>
                ))}
              </motion.div>
            </div>
          )}
          <div className="text-center py-8 bg-white dark:bg-gray-900">
            <Link to="/products" className="inline-block px-8 py-4 bg-gold-500 text-white rounded-lg text-lg font-medium hover:bg-gold-600 transition duration-300">
              View All Products
            </Link>
          </div>
        </div>
      </div>


      {/* About Us Section */}
      <motion.section 
        className="relative py-12 md:py-24 bg-gray-50 dark:bg-gray-800 transition-colors z-30"
        initial={{ y: "0vh" }}
        whileInView={{ y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="container mx-auto px-8 md:px-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 dark:text-white">Global Exporter</h2>
          <div className="h-1 w-24 bg-gold-500 mx-auto mb-8 md:mb-16"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
            <div className="relative bg-black rounded-xl shadow-xl transition-colors overflow-hidden">
                  <motion.div 
                    className="relative h-[300px] md:h-[600px] w-full flex justify-center items-center overflow-hidden"
                    initial={{ scale: 0.8 }}
                    whileInView={{ scale: 1.5 }}
                    viewport={{ amount: 0.6, once: false }}
                    transition={{ duration: 1, ease: "easeOut" }}
                  >
                    <div className="cursor-grab active:cursor-grabbing">
                      <Globe className="transform scale-[0.35] md:scale-[0.7] opacity-90" />
                    </div>
                  </motion.div>
            </div>
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white">Leading FMCG Distributor in Global Markets</h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                At InfinityBasket, we pride ourselves on being a premier distributor of Fast-Moving Consumer Goods (FMCG) across global markets. With years of industry expertise and a commitment to excellence, we connect quality products with consumers worldwide.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Our extensive network and strategic partnerships enable us to offer a diverse range of products while maintaining the highest standards of quality and service. We understand the dynamic nature of the FMCG sector and continuously adapt to meet evolving market demands.
              </p>
              <div className="grid grid-cols-2 gap-8 pt-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <h4 className="text-4xl font-bold text-gold-500">
                    <AnimatedCounter value={1000} className="text-4xl font-bold text-gold-500" />
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">Products Available</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h4 className="text-4xl font-bold text-gold-500">
                    <AnimatedCounter value={50} className="text-4xl font-bold text-gold-500" />
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">Countries Served</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <h4 className="text-4xl font-bold text-gold-500">
                    <AnimatedCounter value={200} className="text-4xl font-bold text-gold-500" />
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">Brand Partners</p>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <h4 className="text-4xl font-bold text-gold-500">
                    <AnimatedCounter value={15} className="text-4xl font-bold text-gold-500" />
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">Years Experience</p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* About Us Section */}
      <motion.section 
        className="relative py-12 md:py-24 bg-white dark:bg-gray-900 transition-colors z-30 overflow-hidden"
        initial={{ y: "0vh" }}
        whileInView={{ y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="container mx-auto px-8 md:px-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 dark:text-white">Why Us?</h2>
          <div className="h-1 w-24 bg-gold-500 mx-auto mb-8 md:mb-16"></div>
          
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 md:gap-16 items-center">
            <div className="relative">
              <div>
                <div className="grid md:grid-cols-4 grid-cols-2 gap-8">
                  {features.map((feature, index) => (
                <motion.div
                  initial={{ opacity: 0, y: -40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: (0.2)* index }}
                  exit={{ opacity: 0, y: -40 }}
                >
                    <div key={index} className="text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md transition-all blur-[2px] hover:blur-none cursor-pointer hover:scale-110 hover:bg-gray-100 dark:hover:bg-gray-700 ease-in-out duration-300 h-full">
                      <div className="flex justify-center mb-4">
                        {React.cloneElement(feature.icon, { className: "text-4xl text-gold-500" })}
                      </div>
                      <h3 className="font-semibold mb-2 dark:text-white">{feature.title}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">{feature.description}</p>
                    </div>
                </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>


      {/* About Us Section */}
      <motion.section 
        className="relative py-12 md:py-24 bg-gray-50 dark:bg-gray-800 transition-colors z-30 overflow-hidden"
        initial={{ y: "0vh" }}
        whileInView={{ y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="container mx-auto px-8 md:px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 dark:text-white">Our Global Partners</h2>
          <div className="h-1 w-24 bg-gold-500 mx-auto mb-8 md:mb-16"></div>
          
          <div className="space-y-16">
            {/* First Row - Left to Right */}
            <div className="overflow-hidden">
              <div 
                className="flex space-x-8 cursor-pointer animate-scroll-left hover:[animation-play-state:paused]"
              >
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex space-x-8 min-w-max">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/c/ce/Coca-Cola_logo.svg" alt="Coca Cola" className="h-8 md:h-16 grayscale hover:grayscale-0 transition-all duration-300" />
                    <img src="https://res.cloudinary.com/dvb5mesnd/image/upload/v1754946636/nestle-logo_asw5uf.png" alt="Nestle" className="h-8 md:h-16 grayscale hover:grayscale-0 transition-all duration-300" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/PepsiCo_logo.svg/1200px-PepsiCo_logo.svg.png?20210115205614" alt="Pepsi" className="h-8 md:h-16 grayscale hover:grayscale-0 transition-all duration-300" />
                    <img src="https://upload.wikimedia.org/wikipedia/en/thumb/e/e4/Unilever.svg/800px-Unilever.svg.png" alt="Unilever" className="h-8 md:h-16 grayscale hover:grayscale-0 transition-all duration-300" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Kellogg%27s-Logo.svg/1200px-Kellogg%27s-Logo.svg.png" alt="Kelloggs" className="h-8 md:h-16 grayscale hover:grayscale-0 transition-all duration-300" />
                    <img src="https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Cadbury_%282020%29.svg/640px-Cadbury_%282020%29.svg.png" alt="Cadbury" className="h-8 md:h-16 grayscale hover:grayscale-0 transition-all duration-300" />
                  </div>
                ))}
              </div>
            </div>

            {/* Second Row - Right to Left */}
            <div className="overflow-hidden">
              <div 
                className="flex space-x-8 cursor-pointer animate-scroll-right hover:[animation-play-state:paused]"
              >
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex space-x-8 min-w-max">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/c/ce/Coca-Cola_logo.svg" alt="Coca Cola" className="h-8 md:h-16 grayscale hover:grayscale-0 transition-all duration-300" />
                    <img src="https://res.cloudinary.com/dvb5mesnd/image/upload/v1754946636/nestle-logo_asw5uf.png" alt="Nestle" className="h-8 md:h-16 grayscale hover:grayscale-0 transition-all duration-300" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/PepsiCo_logo.svg/1200px-PepsiCo_logo.svg.png?20210115205614" alt="Pepsi" className="h-8 md:h-16 grayscale hover:grayscale-0 transition-all duration-300" />
                    <img src="https://upload.wikimedia.org/wikipedia/en/thumb/e/e4/Unilever.svg/800px-Unilever.svg.png" alt="Unilever" className="h-8 md:h-16 grayscale hover:grayscale-0 transition-all duration-300" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Kellogg%27s-Logo.svg/1200px-Kellogg%27s-Logo.svg.png" alt="Kelloggs" className="h-8 md:h-16 grayscale hover:grayscale-0 transition-all duration-300" />
                    <img src="https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Cadbury_%282020%29.svg/640px-Cadbury_%282020%29.svg.png" alt="Cadbury" className="h-8 md:h-16 grayscale hover:grayscale-0 transition-all duration-300" />
                  </div>
                ))}
              </div>
            </div>

            {/* Third Row - Left to Right */}
            <div className="overflow-hidden">
              <div 
                className="flex space-x-8 cursor-pointer animate-scroll-left-slow hover:[animation-play-state:paused]"
              >
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex space-x-8 min-w-max">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/c/ce/Coca-Cola_logo.svg" alt="Coca Cola" className="h-8 md:h-16 grayscale hover:grayscale-0 transition-all duration-300" />
                    <img src="https://res.cloudinary.com/dvb5mesnd/image/upload/v1754946636/nestle-logo_asw5uf.png" alt="Nestle" className="h-8 md:h-16 grayscale hover:grayscale-0 transition-all duration-300" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/PepsiCo_logo.svg/1200px-PepsiCo_logo.svg.png?20210115205614" alt="Pepsi" className="h-8 md:h-16 grayscale hover:grayscale-0 transition-all duration-300" />
                    <img src="https://upload.wikimedia.org/wikipedia/en/thumb/e/e4/Unilever.svg/800px-Unilever.svg.png" alt="Unilever" className="h-8 md:h-16 grayscale hover:grayscale-0 transition-all duration-300" />
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Kellogg%27s-Logo.svg/1200px-Kellogg%27s-Logo.svg.png" alt="Kelloggs" className="h-8 md:h-16 grayscale hover:grayscale-0 transition-all duration-300" />
                    <img src="https://upload.wikimedia.org/wikipedia/en/thumb/a/a4/Cadbury_%282020%29.svg/640px-Cadbury_%282020%29.svg.png" alt="Cadbury" className="h-8 md:h-16 grayscale hover:grayscale-0 transition-all duration-300" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Contact Section */}
      <motion.section 
        className="relative py-12 md:py-24 bg-white dark:bg-gray-900 z-40"
        initial={{ y: "0vh" }}
        whileInView={{ y: 0 }}
        viewport={{ once: false }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="container mx-auto px-8 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
            {/* Company Info */}
            <div>
              <h3 className="text-2xl font-bold mb-6 dark:text-white">Our Group</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                InfinityBasket is amongst the best FMCG, import, and export groups that work globally.
              </p>
              <div className="flex gap-4">
                <a 
                  href={contactDetails.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gold-500 hover:text-gold-600" 
                  title="Follow us on Facebook"
                >
                  <FaFacebookF size={20} />
                </a>
                <a 
                  href={contactDetails.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gold-500 hover:text-gold-600" 
                  title="Follow us on Twitter"
                >
                  <FaTwitter size={20} />
                </a>
                <a 
                  href={contactDetails.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gold-500 hover:text-gold-600" 
                  title="Follow us on Instagram"
                >
                  <FaInstagram size={20} />
                </a>
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-2xl font-bold mb-6 dark:text-white">Contact</h3>
              <div className="space-y-4">
                <p className="flex items-center gap-3 dark:text-gray-300">
                  <FaMapMarkerAlt className="text-gold-500" />
                  <span>{contactDetails.location || 'Loading...'}</span>
                </p>
                <p className="flex items-center gap-3 dark:text-gray-300">
                  <FaWhatsapp className="text-gold-500" />
                  <span>{contactDetails.phone || 'Loading...'}</span>
                </p>
                <p className="flex items-center gap-3 dark:text-gray-300">
                  <FaEnvelope className="text-gold-500" />
                  <span>{contactDetails.email || 'Loading...'}</span>
                </p>
                <p className="flex items-center gap-3 dark:text-gray-300">
                  <FaInstagram className="text-gold-500" />
                  <a 
                    href={contactDetails.instagram} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-gold-500 transition-colors"
                  >
                    @infinitybasketofficial
                  </a>
                </p>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-2xl font-bold mb-6 dark:text-white">Stay Updated</h3>
              <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gold-500"
                  required
                />
                <button
                  type="submit"
                  className="w-full px-4 py-2 bg-gold-500 text-white rounded-lg hover:bg-gold-600 transition duration-300"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
      </motion.section>
      <WhatsappActionButton />
    </div>
  );
};

export default Home;