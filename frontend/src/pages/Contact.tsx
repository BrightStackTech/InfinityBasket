import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaCheck, FaClipboard } from 'react-icons/fa';
// import api from '../api/config';
import { toast } from 'react-hot-toast';
import api from '../api/config';

interface ContactDetails {
  email: string;
  phone: string;
  location: string;
  mapUrl: string;
  hours: string;
  instagram: string;
  facebook: string;
  twitter: string;
}

const Contact = () => {
  const [copied, setCopied] = useState(false);

  const [contactDetails, setContactDetails] = useState<ContactDetails>({
    email: '',
    phone: '',
    location: '',
    mapUrl: '',
    hours: '',
    instagram: '',
    facebook: '',
    twitter: ''
  });
  
  const [isLoading, setIsLoading] = useState(true);



  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    const fetchContactDetails = async () => {
      try {
        const response = await api.get('/contact/details');
        if (response.data) {
          setContactDetails(response.data);
        }
      } catch (error) {
        toast.error('Failed to load contact details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContactDetails();
  }, []);

  const handleCopyPhone = async () => {
    try {
      await navigator.clipboard.writeText(contactDetails.phone);
      setCopied(true);
      toast.success("Phone number copied!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy!");
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Change endpoint from /contact to /messages
      const response = await api.post('/messages', formData);
      if (response.data.success) {
        toast.success('Message sent successfully! We will get back to you soon.');
        setSubmitSuccess(true);
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        setTimeout(() => setSubmitSuccess(false), 5000);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send message');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-12 pt-4 md:pb-4 pb-8">
      {/* Hero Section */}
    <div
      className="relative mb-6 rounded-xl overflow-hidden pt-8"
      style={{ minHeight: '120px' }}
    >
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/hero-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10 flex-start justify-center h-full p-8">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.25 }}
          className="text-3xl md:text-4xl font-bold text-white"
        >
          Contact Us
        </motion.h1>
      </div>
    </div>

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="mb-12"
      >
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6"
          >
            <h2 className="text-2xl font-semibold mb-6 dark:text-white">Get in Touch</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <FaMapMarkerAlt className="text-gold-500 mt-1 mr-4 text-xl" />
                <div>
                  <h3 className="font-medium dark:text-white">Our Location</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {contactDetails.location || import.meta.env.VITE_ADMIN_LOCATION}
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <FaPhone className="text-gold-500 mt-1 mr-4 text-xl" />
                <div>
                  <h3 className="font-medium dark:text-white">Phone</h3>
                  <div className="flex items-center gap-2">
                    <span
                      className="text-gray-600 dark:text-gray-300 cursor-pointer select-all"
                      onClick={handleCopyPhone}
                      title="Copy phone number"
                    >
                      {contactDetails.phone || import.meta.env.VITE_ADMIN_PHONE}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyPhone}
                      className="ml-1 text-gold-500 hover:text-gold-700 focus:outline-none"
                      aria-label="Copy phone number"
                    >
                      {copied ? <FaCheck className="text-green-500" /> : <FaClipboard />}
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex items-start">
                <FaEnvelope className="text-gold-500 mt-1 mr-4 text-xl" />
                <div>
                  <h3 className="font-medium dark:text-white">Email</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    <a
                      href={`mailto:${contactDetails.email || import.meta.env.VITE_ADMIN_EMAIL}`}
                      className="hover:text-gold-500 dark:hover:text-gold-400 hover:underline"
                    >
                      {contactDetails.email || import.meta.env.VITE_ADMIN_EMAIL}
                    </a>
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <FaClock className="text-gold-500 mt-1 mr-4 text-xl" />
                <div>
                  <h3 className="font-medium dark:text-white">Hours</h3>
                  <p className="text-gray-600 dark:text-gray-300 whitespace-pre-line">
                    {contactDetails.hours || import.meta.env.VITE_ADMIN_HOURS}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6"
            id='contact-form'
          >
            <h2 className="text-2xl font-semibold mb-6 dark:text-white">Send us a Message</h2>
            {submitSuccess ? (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                <p>Thank you for your message! We'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500 bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500 bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subject</label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white bg-gray-100"
                  >
                    <option value="">Select a subject</option>
                    <option value="enquiry">Product Enquiry</option>
                    <option value="service">Related to Service</option>
                    <option value="website">Related to website</option>
                    <option value="feedback">Feedback</option>
                    <option value="complaint">Complaint</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-gold-500 focus:ring-gold-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white bg-gray-100"
                  ></textarea>
                </div>
                <div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gold-500 hover:bg-gold-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Sending...' : 'Send Message'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </div>

        {/* Google Maps */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-0 h-96 overflow-hidden"
        >
          <iframe
            src={contactDetails.mapUrl || import.meta.env.VITE_ADMIN_MAP_URL}
            width="100%"
            height="100%"
            frameBorder="0"
            style={{ border: 0 }}
            allowFullScreen
            aria-hidden="false"
            title="Restaurant Location"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </motion.div>
      </motion.section>
    </div>
  );
};

export default Contact;