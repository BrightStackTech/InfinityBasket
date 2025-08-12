import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTimes, FaBars } from "react-icons/fa";

const MobileNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Check if admin is logged in
  const isAdmin = !!localStorage.getItem('adminToken');

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    document.body.style.overflow = isOpen ? "auto" : "hidden";
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsOpen(false);
    navigate('/admin-login');
  };

  return (
    <div className="lg:hidden">
      {/* Toggle Button */}
      <button
        onClick={toggleMenu}
        className="p-2 text-gray-600 hover:text-gold-500 transition-colors"
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity z-[60] ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleMenu}
      />

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-0 right-0 w-[80%] max-w-sm h-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-[60] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Close Button */}
          <div className="flex justify-end p-4">
            <button
              onClick={toggleMenu}
              className="p-2 text-gray-600 hover:text-gold-500 transition-colors"
              aria-label="Close menu"
            >
              <FaTimes size={24} />
            </button>
          </div>

          {/* Navigation Links or Logout */}
          <div className="flex flex-col px-4 py-2">
            {isAdmin ? (
              <>
                <Link
                  to="/"
                  onClick={toggleMenu}
                  className="py-3 text-gray-700 hover:text-gold-500 transition-colors font-medium border-b"
                >
                  HOME
                </Link>
                <Link
                  to="/products"
                  onClick={toggleMenu}
                  className="py-3 text-gray-700 hover:text-gold-500 transition-colors font-medium border-b"
                >
                  PRODUCTS
                </Link>
                <Link
                  to="/about"
                  onClick={toggleMenu}
                  className="py-3 text-gray-700 hover:text-gold-500 transition-colors font-medium border-b"
                >
                  ABOUT US
                </Link>
                <Link
                  to="/contact"
                  onClick={toggleMenu}
                  className="py-3 text-gray-700 hover:text-gold-500 transition-colors font-medium border-b"
                >
                  CONTACT US
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full py-3 mt-2 bg-red-600 text-white rounded hover:bg-red-700 transition duration-300 font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  onClick={toggleMenu}
                  className="py-3 text-gray-700 hover:text-gold-500 transition-colors font-medium border-b"
                >
                  HOME
                </Link>
                <Link
                  to="/products"
                  onClick={toggleMenu}
                  className="py-3 text-gray-700 hover:text-gold-500 transition-colors font-medium border-b"
                >
                  PRODUCTS
                </Link>
                <Link
                  to="/about"
                  onClick={toggleMenu}
                  className="py-3 text-gray-700 hover:text-gold-500 transition-colors font-medium border-b"
                >
                  ABOUT US
                </Link>
                <Link
                  to="/contact"
                  onClick={toggleMenu}
                  className="py-3 text-gray-700 hover:text-gold-500 transition-colors font-medium border-b"
                >
                  CONTACT US
                </Link>
              </>
            )}
          </div>

          {/* Mobile Contact */}
          {!isAdmin && (
            <div className="px-4 py-4 bg-gray-50 mt-auto border-t">
              <p className="text-sm text-gray-600 mb-2">Contact Us:</p>
              <a
                href="mailto:info@infinitybasket.com"
                className="text-sm text-gray-600 hover:text-gold-500 block mb-1"
              >
                info@infinitybasket.com
              </a>
              <a
                href="tel:+912266664951"
                className="text-sm text-gray-600 hover:text-gold-500 block"
              >
                +91 22-66664951
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileNavbar;