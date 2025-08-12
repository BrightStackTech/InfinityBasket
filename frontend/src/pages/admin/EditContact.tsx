import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { FaInstagram, FaFacebookF, FaClock, FaMapMarkerAlt, FaPhone, FaEnvelope,FaTwitter } from 'react-icons/fa';
import api from '../../api/config';

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

const EditContact = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState<ContactDetails>({
    email: '',
    phone: '',
    location: '',
    mapUrl: '',
    hours: '',
    instagram: '',
    facebook: '',
    twitter: ''
  });

  useEffect(() => {
    fetchContactDetails();
  }, []);

  const fetchContactDetails = async () => {
    try {
      const response = await api.get('/contact/details');
      if (response.data) {
        setFormData(response.data);
      }
    } catch (error) {
      toast.error('Failed to load contact details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await api.put('/contact/details', formData);
      if (response.data.success) {
        toast.success('Contact details updated successfully');
        navigate('/admin');
      }
    } catch (error) {
      toast.error('Failed to update contact details');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 md:px-12 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-center mb-8 text-gold-500">
          Edit Contact Details
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white dark:bg-gray-900 p-6 rounded-lg shadow-lg">
          {/* Email */}
          <div>
            <label className="flex items-center text-gray-700 dark:text-gray-300 mb-2">
              <FaEnvelope className="mr-2" />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="flex items-center text-gray-700 dark:text-gray-300 mb-2">
              <FaPhone className="mr-2" />
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          {/* Location */}
          <div>
            <label className="flex items-center text-gray-700 dark:text-gray-300 mb-2">
              <FaMapMarkerAlt className="mr-2" />
              Location Address
            </label>
            <textarea
              name="location"
              value={formData.location}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>

          {/* Map URL */}
          <div>
            <label className="flex items-center text-gray-700 dark:text-gray-300 mb-2">
              <FaMapMarkerAlt className="mr-2" />
              Google Maps Embed URL
            </label>
            <input
              type="url"
              name="mapUrl"
              value={formData.mapUrl}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="https://www.google.com/maps/embed?..."
              required
            />
            {formData.mapUrl && (
              <div className="mt-4 aspect-video w-full rounded-lg overflow-hidden">
                <iframe
                  src={formData.mapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Location Map"
                />
              </div>
            )}
          </div>

          {/* Hours */}
          <div>
            <label className="flex items-center text-gray-700 dark:text-gray-300 mb-2">
              <FaClock className="mr-2" />
              Business Hours
            </label>
            <textarea
              name="hours"
              value={formData.hours}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Monday-Friday: 9 AM - 6 PM&#10;Saturday: 10 AM - 4 PM&#10;Sunday: Closed"
              required
            />
          </div>

          {/* Social Media */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center text-gray-700 dark:text-gray-300 mb-2">
                <FaInstagram className="mr-2" />
                Instagram Profile URL
              </label>
              <input
                type="url"
                name="instagram"
                value={formData.instagram}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="https://instagram.com/yourusername"
              />
            </div>

            <div>
              <label className="flex items-center text-gray-700 dark:text-gray-300 mb-2">
                <FaFacebookF className="mr-2" />
                Facebook Profile URL
              </label>
              <input
                type="url"
                name="facebook"
                value={formData.facebook}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="https://facebook.com/yourpage"
              />
            </div>

            <div>
              <label className="flex items-center text-gray-700 dark:text-gray-300 mb-2">
                <FaTwitter className="mr-2" />
                Twitter Profile URL
              </label>
              <input
                type="url"
                name="twitter"
                value={formData.twitter}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                placeholder="https://twitter.com/yourusername"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2 bg-gold-500 hover:bg-gold-600 text-white rounded-lg transition duration-300 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default EditContact;