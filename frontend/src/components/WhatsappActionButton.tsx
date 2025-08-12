import React, { useState, useEffect } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import api from '../api/config';


const WhatsappActionButton: React.FC = () => {
  const [phone, setPhone] = useState('919876543210'); // Default fallback number

  useEffect(() => {
    const fetchContactDetails = async () => {
      try {
        const response = await api.get('/contact/details');
        if (response.data && response.data.phone) {
          setPhone(response.data.phone.replace(/\D/g, '')); // Remove non-digits
        }
      } catch (error) {
        console.error('Failed to load contact details');
      }
    };

    fetchContactDetails();
  }, []);

  return (
    <a
      href={`https://wa.me/${phone}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed z-50 bottom-6 right-6 md:bottom-8 md:right-8 bg-[#FFD700] text-white rounded-full shadow-lg p-3 md:p-5 flex items-center justify-center transition-transform transform hover:scale-110 hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 cursor-pointer drop-shadow-lg animate-bounce duration-300"
      title="Chat with us on WhatsApp"
      aria-label="Chat with us on WhatsApp"
    >
      <FaWhatsapp size={32} className="text-white dark:text-gray-800 font-extrabold text-2xl" />
    </a>
  );
};

export default WhatsappActionButton;