import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaArrowLeft, FaChevronLeft, FaChevronRight, FaWhatsapp, FaEnvelope, FaTimes } from 'react-icons/fa';
import api from '../api/config';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [contactPhone, setContactPhone] = useState('9876543210'); 
  const [showImageOverlay, setShowImageOverlay] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/products/${id}`);
        if (response.data) setProduct(response.data);
      } catch (error) {
        // Optionally handle error
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchContactDetails = async () => {
      try {
        const response = await api.get('/contact/details');
        if (response.data && response.data.phone) {
          setContactPhone(response.data.phone.replace(/\D/g, '')); // Remove non-digits
        }
      } catch (error) {
        console.error('Failed to load contact details');
      }
    };

    fetchContactDetails();
  }, []);

  if (loading || !product) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Use product.image as array, fallback to product.media or single image
    const imageList =
    Array.isArray(product.images) && product.images.length > 0
        ? product.images
        : product.media && Array.isArray(product.media) && product.media.length > 0
        ? product.media
        : product.images
        ? [product.images]
        : [];

    const currentImage = imageList[currentMediaIndex];

  return (
    <div className="container mx-auto px-4 md:px-12 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-primary-600 hover:text-primary-700 mb-6 dark:text-white"
        >
          <FaArrowLeft className="mr-2" /> Back
        </button>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Images Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden relative w-full h-[350px] md:h-[500px] flex items-center justify-center">
            {currentImage ? (
              <img
                src={currentImage}
                alt={product.name}
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setShowImageOverlay(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No image available
              </div>
            )}
            {imageList.length > 1 && (
              <>
                {currentMediaIndex > 0 && (
                  <button
                    onClick={() => setCurrentMediaIndex(currentMediaIndex - 1)}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 text-gray-800 p-2 rounded-full"
                    title="Previous Image"
                  >
                    <FaChevronLeft />
                  </button>
                )}
                {currentMediaIndex < imageList.length - 1 && (
                  <button
                    onClick={() => setCurrentMediaIndex(currentMediaIndex + 1)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 text-gray-800 p-2 rounded-full"
                    title="Next Image"
                  >
                    <FaChevronRight />
                  </button>
                )}
              </>
            )}
          </div>
          {/* Product Info Section */}
          <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6 flex flex-col justify-top">
            {/* Category */}
            <div className="mb-4">
              <span className="py-2 text-lg font-bold font-medium  text-gray-400  dark:text-gray-600 font-serif">
                category :
              </span>
              <span className="ml-2 inline-block px-4 py-2 text-sm font-medium rounded-full bg-gray-200 text-gray-900 dark:bg-gray-600 dark:text-white">
                {product.category}
              </span>
            </div>
            <div className=" text-sm font-bold font-medium  text-gray-400  dark:text-gray-600 font-serif">
              Product name :
            </div>
            {/* Name */}
            <h1 className="text-3xl font-bold mb-4 dark:text-white">{product.name}</h1>
            {/* Brand */}
            <div className=" text-sm font-bold font-medium  text-gray-400  dark:text-gray-600 font-serif">
              Brand :
            </div>
            {product.brand && (
              <div className="mb-4">
                <span className="text-lg font-semibold text-gold-500 dark:text-gold-400">{product.brand}</span>
              </div>
            )}
            {/* Description */}
            <div className=" text-sm py-2 font-bold font-medium  text-gray-400  dark:text-gray-600 font-serif">
              Description :
            </div>
            <p className="text-gray-600 dark:text-gray-300 bg-gray-200 dark:bg-gray-800 rounded-xl p-4 mb-4">{product.description}</p>
            <div className="flex gap-4">
              <span className="flex-1">
                <button
                  onClick={() => navigate('/contact#contact-form')}
                  className="w-full inline-flex flex-col md:flex-row items-center justify-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition duration-300 shadow-md hover:shadow-lg hover:scale-105"
                >
                  <FaEnvelope className="text-2xl md:text-xl md:mr-2 mb-2 md:mb-0" />
                  <span>Write a Message</span>
                </button>
              </span>
              <span className="flex-1">
              <a
                href={`https://wa.me/${contactPhone}?text=Hi, I'm interested in ${product.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex flex-col md:flex-row items-center justify-center px-6 py-3 bg-gold-500 hover:bg-gold-600 text-white rounded-lg transition duration-300 shadow-md hover:shadow-lg hover:scale-105"
              >
                <FaWhatsapp className="text-2xl md:text-xl md:mr-2 mb-2 md:mb-0" />
                <span>Enquire on WhatsApp</span>
              </a>
              </span>
            </div>
          </div>
        </div>
      </motion.div>
      {showImageOverlay && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setShowImageOverlay(false)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gold-500 transition-colors duration-200"
            onClick={() => setShowImageOverlay(false)}
          >
            <FaTimes size={24} />
          </button>
          <img
            src={currentImage}
            alt={product.name}
            className="max-w-full max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
};

export default ProductDetail;