import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const NotFound = () => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.7 }}
    className="flex flex-col items-center justify-center min-h-[60vh] text-center"
  >
    <h1 className="text-5xl font-bold text-gold-500 mb-4">404</h1>
    <h2 className="text-2xl font-semibold mb-2 dark:text-white">Page Not Found</h2>
    <p className="text-gray-600 dark:text-gray-300 mb-6">
      Sorry, the page you are looking for does not exist.
    </p>
    <Link
      to="/"
      className="px-6 py-2 bg-gold-500 text-white rounded-lg font-medium hover:bg-gold-600 transition"
    >
      Go to Home
    </Link>
  </motion.div>
);

export default NotFound;