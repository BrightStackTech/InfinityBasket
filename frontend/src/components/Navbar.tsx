import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaInstagram, FaWhatsapp, FaEnvelope } from 'react-icons/fa';
import MobileNavbar from './MobileNavbar';
import ThemeToggle from './ThemeToggle';
import { toast } from "react-hot-toast";
import api from '../api/config';


interface ContactDetails {
  email?: string;
  phone?: string;
  instagram?: string;
  facebook?: string;
  twitter?: string;
}


const Navbar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const isAdmin = !!localStorage.getItem('adminToken');

  const [contactDetails, setContactDetails] = useState<ContactDetails>({
    email: '',
    phone: ''
  });

  useEffect(() => {
    const fetchContactDetails = async () => {
      try {
        const response = await api.get('/contact/details');
        if (response.data) {
          setContactDetails(response.data);
        }
      } catch (error) {
        console.error('Failed to load contact details');
      }
    };

    fetchContactDetails();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    toast.success("Logged out successfully!", { position: "top-center" });
    navigate('/admin-login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm transition-colors">
      {/* Top Bar */}
      <div className="border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-6 md:px-12 md:h-14 h-16 flex items-center justify-between">
          <div className="flex items-center justify-between w-full lg:w-auto gap-4">
            {/* Logo */}
            <Link to="/" className="font-bold md:text-3xl text-2xl text-gold-500 dark:text-gold-400 flex items-center gap-3">
              <img src="https://res.cloudinary.com/dvb5mesnd/image/upload/v1754402984/infinitybasketlogo_s7pmbl.png" alt="InfinityBasket Logo" className="h-8 w-auto" />
              <span className="font-times">InfinityBasket</span>
            </Link>
            <div className="flex items-center gap-4">
              <div className="bg-gray-100 dark:bg-gray-800 p-1.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition duration-300 lg:hidden">
                <ThemeToggle />
              </div>
              <MobileNavbar />
            </div>
          </div>

          {/* Socials and Contact */}
          <div className="hidden lg:flex items-center gap-6"> 
            <div className="flex items-center gap-4">
              <a 
                href={`mailto:${contactDetails.email || 'info@infinitybasket.com'}`} 
                className="text-gray-600 hover:text-gold-500 hover:font-bold flex items-center gap-2"
              >
                <FaEnvelope size={16} />
                <span className="text-sm">{contactDetails.email || 'info@infinitybasket.com'}</span>
              </a>
              <a 
                href={`https://wa.me/${contactDetails.phone?.replace(/\D/g, '') || '919876543210'}`} 
                className="text-gray-600 hover:text-gold-500 hover:font-bold flex items-center gap-2"
              >
                <FaWhatsapp size={16} />
                <span className="text-sm">{contactDetails.phone || '+91 98765 43210'}</span>
              </a>
            </div>
            <div className="flex items-center gap-3">
              <a href={contactDetails.instagram || '#'} className="text-gray-600 hover:text-gold-500 hover:font-bold" title="Follow us on Instagram">
                <FaInstagram size={16} />
              </a>
              <a href={contactDetails.facebook || '#'} className="text-gray-600 hover:text-gold-500 hover:font-bold" title="Follow us on Facebook">
                  <FaFacebookF size={16} />
                </a>
                <a href={contactDetails.twitter || '#'} className="text-gray-600 hover:text-gold-500 hover:font-bold" title="Follow us on Twitter">
                  <FaTwitter size={16} />
                </a>
            </div>
            <div className="flex items-center gap-2">
              <Link to="/contact#contact-form" className="px-4 py-1.5 bg-gold-500 text-white text-sm rounded hover:bg-gold-600 transition duration-300 hover:font-bold">
                ENQUIRE NOW
              </Link>
              <div className="hidden md:block transition duration-300">
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
  {(isHomePage || isAdmin || window.innerWidth >= 1024) && (
    <div 
      className={`container mx-auto px-6 md:px-12 transition-all duration-300 ease-in-out transform z-50 ${
        isScrolled 
          ? 'max-h-20 opacity-100 translate-y-0'
          : 'max-h-0 opacity-0 -translate-y-2 lg:max-h-20 lg:opacity-100 lg:translate-y-0 pointer-events-none lg:pointer-events-auto'
      } overflow-hidden`}
    >
        <div className={`flex flex-col lg:flex-row items-center justify-between lg:h-14 py-4 lg:py-0 transition-opacity duration-300 ease-in-out ${
          isScrolled ? 'opacity-100' : 'opacity-0 lg:opacity-100'
        }`}>
          <div className="flex items-center w-full">
            {isAdmin ? (
              <div className="flex items-center w-full">
                <div className="hidden lg:flex items-center gap-4">
                  <Link 
                    to="/" 
                    className="text-gray-700 hover:text-white px-4 py-1 rounded hover:font-bold hover:bg-gold-500 transition duration-200 font-medium"
                  >
                    HOME
                  </Link>
                  <Link 
                    to="/products" 
                    className="text-gray-700 hover:text-white px-4 py-1 rounded hover:font-bold hover:bg-gold-500 transition duration-200 font-medium"
                  >
                    PRODUCTS
                  </Link>
                  <Link 
                    to="/about" 
                    className="text-gray-700 hover:text-white px-4 py-1 rounded hover:font-bold hover:bg-gold-500 transition duration-200 font-medium"
                  >
                    ABOUT US
                  </Link>
                  <Link 
                    to="/contact" 
                    className="text-gray-700 hover:text-white px-4 py-1 rounded hover:font-bold hover:bg-gold-500 transition duration-200 font-medium"
                  >
                    CONTACT US
                  </Link>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-auto px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-300"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center w-full">
                <div className="hidden lg:flex items-center gap-4">
                  <Link 
                    to="/" 
                    className="text-gray-700 hover:text-white px-4 py-1 rounded hover:font-bold hover:bg-gold-500 transition duration-200 font-medium"
                  >
                    HOME
                  </Link>
                  <Link 
                    to="/products" 
                    className="text-gray-700 hover:text-white px-4 py-1 rounded hover:font-bold hover:bg-gold-500 transition duration-200 font-medium"
                  >
                    PRODUCTS
                  </Link>
                  <Link 
                    to="/about" 
                    className="text-gray-700 hover:text-white px-4 py-1 rounded hover:font-bold hover:bg-gold-500 transition duration-200 font-medium"
                  >
                    ABOUT US
                  </Link>
                  <Link 
                    to="/contact" 
                    className="text-gray-700 hover:text-white px-4 py-1 rounded hover:font-bold hover:bg-gold-500 transition duration-200 font-medium"
                  >
                    CONTACT US
                  </Link>
                </div>
                {/* Right aligned search bar */}
                <div className="flex-1 flex justify-end">
                  <form onSubmit={handleSearch} className={`relative w-full md:w-72 mt-0 transition-opacity duration-300 ${
                    isScrolled ? 'opacity-100' : 'opacity-0 md:opacity-100'
                  }`}>
                    <input
                      type="search"
                      placeholder="Search products..."
                      className={`w-full px-4 py-2.5 md:py-2 rounded border bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gold-500 text-sm`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      )}
    </nav>
  );
};

export default Navbar;