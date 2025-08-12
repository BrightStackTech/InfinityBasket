import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../api/config';

const ChangePassword = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const navigate = useNavigate();

  const handleResetPassword = async () => {
    try {
      const response = await api.post('/admin/reset-password-request');
      if (response.data.success) {
        toast.success(
          <div>
            Reset password link has been sent to admin email.{' '}
            <a 
              href="https://mail.google.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-600 underline"
            >
              Check your inbox
            </a>
          </div>,
          { duration: 5000 }
        );
        navigate('/admin');
      }
    } catch (error) {
      toast.error('Failed to send reset password link');
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="container mx-auto px-4 md:px-12 pt-12 pb-8 min-h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg mx-auto"
      >
        <h1 className="text-3xl font-bold text-center mb-8 text-gold-500">
          Change Admin Password
        </h1>

        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-6">
          <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
            Are you sure you want to change the admin password?
          </p>
          
          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate('/admin')}
              className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition duration-300"
            >
              No, I clicked by mistake
            </button>
            <button
              onClick={() => setIsDialogOpen(true)}
              className="px-6 py-2 bg-gold-500 hover:bg-gold-600 text-white rounded-lg transition duration-300"
            >
              Yes, I want to
            </button>
          </div>
        </div>
      </motion.div>

      {/* Confirmation Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4"
          >
            <h2 className="text-xl font-bold mb-4 dark:text-white">
              Confirm Password Reset
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to reset the admin password? A reset link will be sent to your email.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsDialogOpen(false)}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition duration-300"
              >
                Cancel
              </button>
              <button
                onClick={handleResetPassword}
                className="px-4 py-2 bg-gold-500 hover:bg-gold-600 text-white rounded-lg transition duration-300"
              >
                Yes, send reset link
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ChangePassword;