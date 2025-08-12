import { useState, useEffect } from 'react';
import api from '../../api/config';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaPlus, FaArrowLeft, FaSearch, FaEdit, FaTrash } from 'react-icons/fa';
import { GrDrag } from 'react-icons/gr';
import Select from 'react-select';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Switch } from '@headlessui/react';
import { toast } from 'react-hot-toast';

type Product = {
  _id: string;
  name: string;
  brand?: string;
  description?: string;
  category?: string;
  images?: string[];
  featured?: boolean;
  order?: number;
};

const categories = ['all', 'Confectionery', 'Health care'];
const categoryOptions = categories.map(cat => ({
  value: cat,
  label: cat.charAt(0).toUpperCase() + cat.slice(1)
}));

const ManageProduct = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch products from database
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

  // Drag and drop handler
  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const items = Array.from(products);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update orders based on new positions
    const updatedItems = items.map((item, index) => ({
      ...item,
      order: index
    }));

    // Update local state first for immediate UI feedback
    setProducts(updatedItems);

    try {
      // Prepare updates for backend
      const updates = updatedItems.map((item, index) => ({
        id: item._id,
        order: index
      }));

      const response = await api.put('/products/reorder', { updates });
      
      if (!response.data.success) {
        throw new Error(response.data.message || 'Failed to update order');
      }

      toast.success('Product order updated successfully');
    } catch (error: any) {
      console.error('Error updating product order:', error.response?.data || error);
      toast.error(error.response?.data?.message || 'Failed to update product order');
      // Revert to previous order on error
      setProducts(products);
    }
  };

  // Filter products based on search term and category
const filteredProducts = products
  .sort((a, b) => (a.order || 0) - (b.order || 0)) // Keep sorted by order
  .filter(product => {
    const matchesSearch =
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDeleteClick = (id: string) => {
    setProductToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!productToDelete) return;
    try {
      await api.delete(`/products/${productToDelete}`);
      setProducts(products.filter(p => p._id !== productToDelete));
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    } catch {
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleFeaturedToggle = async (productId: string, currentValue: boolean) => {
    try {
      const response = await api.put(`/products/${productId}/toggle-featured`, {
        featured: !currentValue
      });

      if (response.data.success) {
        setProducts(products.map(p => 
          p._id === productId ? { ...p, featured: !currentValue } : p
        ));
        toast.success(response.data.message);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update featured status');
    }
  };
  

  return (
    <div className="container mx-auto px-4 md:px-12 pt-12 md:pb-4 pb-8">
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-3xl md:text-4xl font-bold text-gold-500 mb-8"
      >
        Manage Products
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 mb-8"
      >
        <div className="flex flex-wrap items-center justify-between mb-6">
          <Link to="/admin" className="text-gold-500 hover:text-gold-600 mr-4 flex items-center">
            <FaArrowLeft className="inline mr-2" /> Back to Dashboard
          </Link>
          <button
            onClick={() => navigate("/admin/add-product")}
            className="bg-gold-500 text-white px-4 py-2 rounded-md hover:bg-gold-600 flex items-center"
          >
            <FaPlus className="mr-2" /> Add New Product
          </button>
        </div>
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-400" />
            </span>
            <input
              type="text"
              placeholder="Search name, brand or description..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:ring-gold-500 focus:border-gold-500 bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div className="flex-shrink-0 min-w-[180px]">
            <Select
              options={categoryOptions}
              value={categoryOptions.find(option => option.value === selectedCategory)}
              onChange={option => setSelectedCategory(option?.value || 'all')}
              className="w-full"
              classNamePrefix="react-select"
              placeholder="Filter by category"
              styles={{
                control: (provided: any) => {
                  const isDark = document.documentElement.classList.contains("dark");
                  return {
                    ...provided,
                    backgroundColor: isDark ? "#2d3748" : "#fff",
                    borderColor: isDark ? "#4a5568" : provided.borderColor,
                    color: isDark ? "#fff" : provided.color,
                  };
                },
                menu: (provided: any) => {
                  const isDark = document.documentElement.classList.contains("dark");
                  return {
                    ...provided,
                    backgroundColor: isDark ? "#2d3748" : "#fff",
                  };
                },
                singleValue: (provided: any) => {
                  const isDark = document.documentElement.classList.contains("dark");
                  return {
                    ...provided,
                    color: isDark ? "#fff" : provided.color,
                  };
                },
                option: (provided: any, state: any) => {
                  const isDark = document.documentElement.classList.contains("dark");
                  return {
                    ...provided,
                    backgroundColor: state.isFocused
                      ? (isDark ? "#4a5568" : "#f0f0f0")
                      : (isDark ? "#2d3748" : "#fff"),
                    color: isDark ? "#fff" : "#000",
                  };
                },
              }}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="products">
              {(provided) => (
                <table
                  className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Arrange</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Image</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Brand</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Featured
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-8 text-gray-500 dark:text-gray-400">
                          No products found. Try a different search or category.
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((product, index) => (
                        <Draggable key={product._id} draggableId={product._id} index={index}>
                          {(provided, snapshot) => (
                            <tr
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`hover:bg-gray-50 dark:hover:bg-gray-700 ${snapshot.isDragging ? 'bg-gray-100 dark:bg-gray-600 min-h-[56px]' : ''}`}
                            >
                              <td className="px-6 py-4 text-center cursor-move" {...provided.dragHandleProps}>
                                <GrDrag className="text-gray-400 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 mx-auto" />
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="w-12 h-12 rounded-md overflow-hidden mx-auto">
                                  <img
                                    src={product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/150?text=No+Image'}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                    onError={e => {
                                      const target = e.target as HTMLImageElement;
                                      target.src = 'https://via.placeholder.com/150?text=No+Image';
                                    }}
                                  />
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-normal">
                                <span className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</span>
                              </td>
                              <td className="px-6 py-4 whitespace-normal">
                                <span className="text-sm font-semibold text-gold-500 dark:text-gold-400">{product.brand}</span>
                              </td>
                              <td className="px-6 py-4 whitespace-normal">
                                <span className="text-sm font-medium text-gray-900 dark:text-white">{product.description}</span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className="text-sm font-medium text-white dark:text-gray-900 bg-gold-500 dark:bg-white rounded-xl py-1 px-2">
                                  {product.category}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-lg font-medium">
                                <button
                                  onClick={() => navigate(`/admin/edit-product/${product._id}`)}
                                  className="text-gold-500 hover:text-gold-700 mr-5"
                                  title="Edit Product"
                                >
                                  <FaEdit />
                                </button>
                                <button
                                  className="text-red-600 hover:text-red-700"
                                  title="Delete Product"
                                  onClick={() => handleDeleteClick(product._id)}
                                >
                                  <FaTrash />
                                </button>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Switch
                                  checked={!!product.featured}
                                  onChange={() => handleFeaturedToggle(product._id, !!product.featured)}
                                  className={`${
                                    product.featured ? 'bg-gold-500' : 'bg-gray-200'
                                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-gold-500`}
                                >
                                  <span className="sr-only">Featured product</span>
                                  <span
                                    className={`${
                                      product.featured ? 'translate-x-6' : 'translate-x-1'
                                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                                  />
                                </Switch>
                              </td>
                            </tr>
                          )}
                        </Draggable>
                      ))
                    )}
                    {provided.placeholder}
                  </tbody>
                  {deleteDialogOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                      <div className="bg-white dark:bg-gray-900 rounded-lg shadow-lg p-8 text-center">
                        <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                          Are you sure you want to delete this product?
                        </h2>
                        <div className="flex justify-center gap-4">
                          <button
                            onClick={handleDeleteCancel}
                            className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleDeleteConfirm}
                            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                          >
                            Yes
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </table>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </motion.div>
    </div>
  );
};

export default ManageProduct;