import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import Contact from "./pages/Contact";
import Navbar from "./components/Navbar";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminPanel from "./pages/admin/AdminPanel";
import ManageProduct from "./pages/admin/ManageProduct";
import AddProduct from "./pages/admin/AddProduct";
import EditProduct from "./pages/admin/EditProduct";
import EditContact from "./pages/admin/EditContact";
import AboutUs from "./pages/AboutUs";
import { ThemeProvider } from "./context/ThemeContext";
import { useEffect } from "react";
import Footer from "./components/Footer";
import NotFound from "./pages/NotFound";
import './App.css';
import AdminRoute from './components/AdminRoute';
import { Toaster } from "react-hot-toast";
import ProductDetail from "./pages/ProductDetail";
import ChangePassword from "./pages/admin/ChangePaasword";
import ResetPassword from "./pages/admin/ResetPassword";
import Inbox from "./pages/admin/Inbox";
import ScrollToTop from './components/ScrollToTop';

function App() {

  useEffect(() => {
    const cursor = document.createElement("div");
    cursor.className = "cursor-glow";
    document.body.appendChild(cursor);
  
    const moveCursor = (e: MouseEvent) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    };
  
    window.addEventListener("mousemove", moveCursor);
  
    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.body.removeChild(cursor);
    };
  }, []);
  
  return (
    <ThemeProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-white dark:bg-gray-800 transition-colors flex flex-col">
          <Navbar />
          <div className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminRoute><AdminPanel /></AdminRoute>} />
              <Route path="/admin/manage-products" element={<AdminRoute><ManageProduct /></AdminRoute>} />
              <Route path="/admin/add-product" element={<AdminRoute><AddProduct /></AdminRoute>} />
              <Route path="/admin/edit-product/:id" element={<AdminRoute><EditProduct /></AdminRoute>} />
              <Route path="/admin/edit-contact" element={<AdminRoute><EditContact /></AdminRoute>} />
              <Route path="/admin/change-password" element={<AdminRoute><ChangePassword /></AdminRoute>} />
              <Route path="/admin/reset-password/:token" element={<AdminRoute><ResetPassword /></AdminRoute>} />
              <Route path="/admin/inbox" element={<AdminRoute><Inbox /></AdminRoute>} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;