import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { TiShoppingCart } from "react-icons/ti";
import { FaUserEdit } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdInbox } from "react-icons/md";

const AdminPanel = () => {
  const navigate = useNavigate();
  return (
    <div className="container mx-auto px-4 md:px-12 pt-12 md:pb-4 pb-8 flex flex-col items-center">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-3xl md:text-4xl font-bold text-gold-500 mb-8"
      >
        Admin Panel
      </motion.h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 w-full max-w-4xl">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-blue-600 text-white p-8 rounded-xl hover:bg-blue-700 flex flex-col items-center justify-center transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          onClick={() => navigate('/admin/manage-products')}
        >
          <TiShoppingCart className="text-6xl mb-4" />
          <span className="text-xl font-bold">Manage Products</span>
        </motion.button>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-green-600 text-white p-8 rounded-xl hover:bg-green-700 flex flex-col items-center justify-center transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          onClick={() => navigate('/admin/edit-contact')}
        >
          <FaUserEdit className="text-6xl mb-4" />
          <span className="text-xl font-bold">Edit Contact Details</span>
        </motion.button>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="bg-red-600 text-white p-8 rounded-xl hover:bg-red-700 flex flex-col items-center justify-center transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          onClick={() => navigate('/admin/change-password')}
        >
          <RiLockPasswordFill className="text-6xl mb-4" />
          <span className="text-xl font-bold">Change Password</span>
        </motion.button>

        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-purple-600 text-white p-8 rounded-xl hover:bg-purple-700 flex flex-col items-center justify-center transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
          onClick={() => navigate('/admin/inbox')}
        >
          <MdInbox className="text-6xl mb-4" />
          <span className="text-xl font-bold">Inbox</span>
        </motion.button>
      </div>
    </div>
  );
};

export default AdminPanel;