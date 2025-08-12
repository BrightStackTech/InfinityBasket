import { useState, useEffect, type ChangeEvent, type FormEvent, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../../api/config';
import { FaArrowLeft, FaPlus } from "react-icons/fa";
import Select from 'react-select';
import LoadingOverlay from '../../components/LoadingOverlay';
import { motion } from 'framer-motion';

const categoryOptions = [
  { value: 'confectionery', label: 'Confectionery' },
  { value: 'snacks', label: 'Snacks' },
  { value: 'beverages', label: 'Beverages' },
  { value: 'personal-care', label: 'Personal Care' },
  { value: 'home-care', label: 'Home Care' },
  { value: 'health-care', label: 'Health Care' },
  { value: 'others', label: 'Others' },
];

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [productData, setProductData] = useState({
    name: '',
    brand: '',
    category: categoryOptions[0].value,
    description: ''
  });
  // Store all images as objects: { url?: string, file?: File }
  const [images, setImages] = useState<{ url?: string; file?: File }[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch product details
  useEffect(() => {
    setIsLoading(true);
    api.get(`/products/${id}`)
      .then(res => {
        const prod = res.data;
        setProductData({
          name: prod.name || '',
          brand: prod.brand || '',
          category: prod.category || categoryOptions[0].value,
          description: prod.description || ''
        });
        // Load existing images as { url }
        setImages((prod.images || []).map((url: string) => ({ url })));
      })
      .catch(() => toast.error('Failed to fetch product'))
      .finally(() => setIsLoading(false));
  }, [id]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const handleMediaChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).filter(file => file.type.startsWith('image/'));
      if (filesArray.length !== e.target.files.length) {
        toast.error('Only image files are allowed.');
      }
      // Add new files as { file }
      setImages(prev => [...prev, ...filesArray.map(file => ({ file }))]);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData();
      // Only append files for upload; send URLs for existing images
      images.forEach(img => {
        if (img.file) {
          formData.append('media', img.file);
        } else if (img.url) {
          formData.append('existingImages', img.url);
        }
      });
      formData.append('name', productData.name);
      formData.append('brand', productData.brand);
      formData.append('category', productData.category);
      formData.append('description', productData.description);

      const response = await api.put(`/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data._id) {
        toast.success('Product updated successfully!');
        navigate('/admin/manage-products');
      } else {
        throw new Error(response.data.message || 'Failed to update product');
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-12 pt-12 md:pb-4 pb-8">
      {(isSubmitting || isLoading) && <LoadingOverlay />}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-3xl md:text-4xl font-bold text-gold-500 mb-8"
      >
        Edit Product
      </motion.h1>

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-12"
      >
        <form onSubmit={handleSubmit} className="mx-auto space-y-6 bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg">
          {/* Back Link */}
          <div className="flex items-center mb-4">
            <Link to="/admin/manage-products" className="text-gold-500 hover:text-gold-700 mr-4 flex items-center">
              <FaArrowLeft className="inline mr-2" /> Manage Products
            </Link>
          </div>

          {/* Images Preview (existing + new) */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2 md:mb-4 font-semibold md:text-xl">Images</label>
            <div className="flex items-center space-x-4">
              {images.map((img, index) => (
                <div key={index} className="relative flex-shrink-0">
                  <img
                    src={img.file ? URL.createObjectURL(img.file) : img.url}
                    alt={`Product image ${index + 1}`}
                    className="w-32 h-32 md:w-64 md:h-64 object-cover rounded-xl cursor-pointer"
                    onClick={() => img.file && setSelectedMedia(img.file)}
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                  >
                    &times;
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={triggerFileInput}
                className="w-32 h-32 md:w-64 md:h-64 bg-gold-500 text-white border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center hover:bg-gold-600 flex-shrink-0"
              >
                <FaPlus size={24} className="text-white mb-1" />
                <span className="text-white text-sm">Upload</span>
              </button>
            </div>
            <input
              type="file"
              accept="image/*"
              multiple
              ref={fileInputRef}
              onChange={handleMediaChange}
              className="hidden"
              title="Upload image files"
            />
          </div>

          {/* Product Name */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold md:text-xl md:mb-4">Product Name</label>
            <input
              type="text"
              name="name"
              value={productData.name}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter product name"
              required
            />
          </div>

          {/* Product Brand */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold md:text-xl md:mb-4">Product Brand</label>
            <input
              type="text"
              name="brand"
              value={productData.brand}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter product brand"
              required
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold md:text-xl md:mb-4">Category</label>
            <Select
              options={categoryOptions}
              value={categoryOptions.find(option => option.value === productData.category)}
              onChange={(selectedOption) =>
                setProductData({ ...productData, category: selectedOption?.value || '' })
              }
              className="w-full"
              styles={{
                control: (provided, state) => ({
                  ...provided,
                  backgroundColor: 'transparent',
                  borderColor: state.isFocused ? '#FFD700' : '#D1D5DB',
                  color: 'black',
                  boxShadow: state.isFocused ? '0 0 0 1px #FFD700' : 'none',
                }),
                menu: (provided) => ({
                  ...provided,
                  backgroundColor: document.documentElement.classList.contains('dark')
                    ? '#1F2937'
                    : 'white',
                  zIndex: 9999,
                }),
                option: (provided, state) => ({
                  ...provided,
                  backgroundColor: state.isFocused
                    ? '#FFD700'
                    : document.documentElement.classList.contains('dark')
                    ? '#1F2937'
                    : 'white',
                  color: state.isFocused
                    ? 'white'
                    : document.documentElement.classList.contains('dark')
                    ? '#D1D5DB'
                    : 'black',
                }),
                singleValue: (provided) => ({
                  ...provided,
                  color: document.documentElement.classList.contains('dark') ? 'white' : 'black',
                }),
              }}
            />
          </div>

          {/* Product Description */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2 font-semibold md:text-xl md:mb-4">Product Description</label>
            <textarea
              name="description"
              value={productData.description}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2 rounded bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="Enter product description"
              rows={4}
              required
            />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-gold-500 text-white font-semibold hover:bg-gold-600 transition duration-300"
            >
              Update
            </button>
          </div>
        </form>

        {/* Modal for Media Preview */}
        {selectedMedia && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="relative bg-transparent p-4 rounded-lg shadow-lg">
              <button
                onClick={() => setSelectedMedia(null)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center"
              >
                &times;
              </button>
              <img
                src={URL.createObjectURL(selectedMedia)}
                alt="Preview"
                className="w-auto lg:h-[500px] h-[300px] rounded"
              />
            </div>
          </div>
        )}
      </motion.section>
    </div>
  );
};

export default EditProduct;