import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { useSearchParams } from 'react-router-dom';
import api from '../api/config';

type Product = {
  _id: string;
  name: string;
  brand?: string;
  description?: string;
  category?: string;
  images?: string[];
  order?: number;
};

const sortOptions = [
  { value: 'default', label: 'Default' },
  { value: 'az', label: 'A-Z' },
  { value: 'za', label: 'Z-A' },
];

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState('default');
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  useEffect(() => {
    const search = searchParams.get('search');
    if (search) {
      setSearchTerm(search);
    }
  }, [searchParams]);


  useEffect(() => {
    api.get('/products')
      .then(res => {
        // Sort products by order before setting state
        const sortedProducts = res.data.sort((a: Product, b: Product) => 
          (a.order || 0) - (b.order || 0)
        );
        setProducts(sortedProducts);
      })
      .catch(() => setProducts([]));
  }, []);

  const categories = Array.from(new Set(products.map((p: Product) => p.category)));

  let filteredProducts = selectedCategory
    ? products.filter((p: any) => p.category === selectedCategory)
    : products;

  if (sortOrder === 'az') {
    filteredProducts = [...filteredProducts].sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortOrder === 'za') {
    filteredProducts = [...filteredProducts].sort((a, b) => b.name.localeCompare(a.name));
  } else {
    // Default sorting by order
    filteredProducts = [...filteredProducts].sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  if (searchTerm.trim() !== '') {
    const term = searchTerm.trim().toLowerCase();
    filteredProducts = filteredProducts.filter((p: any) =>
      p.name.toLowerCase().includes(term) || p.brand?.toLowerCase().includes(term)
    );
  }

  return (
    <div className="container mx-auto px-8 md:px-12 pt-4 pb-8">
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
            Products
          </motion.h1>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="flex flex-wrap gap-2 mb-6 items-center"
      >
        <button
          className={`px-4 py-2 rounded-lg border ${selectedCategory === null ? 'bg-gold-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white'}`}
          onClick={() => setSelectedCategory(null)}
        >
          All
        </button>
        {categories.map(cat => (
          <motion.button
            key={cat}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5 + categories.indexOf(cat) * 0.1 }}
            className={`px-4 py-2 rounded-lg border ${selectedCategory === cat ? 'bg-gold-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white'}`}
            onClick={() => setSelectedCategory(cat ?? null)}
          >
            {cat}
          </motion.button>
        ))}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          className="ml-auto flex items-center gap-2"
        >
          <select
            id="sort-products"
            className="px-4 py-2 rounded-lg border bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white"
            value={sortOrder}
            onChange={e => setSortOrder(e.target.value)}
            title="Sort products"
          >
            {sortOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="px-4 py-2 ml-auto rounded-lg border bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white"
            aria-label="Search products"
          />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6"
      >
        {filteredProducts.map((product: any, idx: number) => (
          <motion.div
            key={product._id || idx}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 + idx * 0.07 }}
          >
            <ProductCard product={product} height="400px" mobileHeight="300px" />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Products;