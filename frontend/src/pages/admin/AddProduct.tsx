import { useState, type ChangeEvent, type FormEvent, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
  { value: 'coffees', label: 'Coffees' },
  { value: 'personal-care', label: 'Personal Care' },
  { value: 'health-care', label: 'Health Care' },
  { value: 'toiletries', label: 'Toiletries' },
  { value: 'home-care', label: 'Home Care' },
  { value: 'others', label: 'Others' },
];

const AddProduct = () => {
  const navigate = useNavigate();
  const [productData, setProductData] = useState({
    name: '',
    brand: '',
    category: categoryOptions[0].value,
    description: ''
  });
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const handleMediaChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).filter(file => file.type.startsWith('image/'));
      if (filesArray.length !== e.target.files.length) {
        toast.error('Only image files are allowed.');
      }
      setMediaFiles(prev => [...prev, ...filesArray]);
    }
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeMediaField = (index: number) => {
    const newMediaFiles = mediaFiles.filter((_, i) => i !== index);
    setMediaFiles(newMediaFiles);
  };

const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    const formData = new FormData();
    mediaFiles.forEach(file => {
      formData.append('media', file);
    });
    formData.append('name', productData.name);
    formData.append('brand', productData.brand);
    formData.append('category', productData.category);
    formData.append('description', productData.description);

    const response = await api.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    if (response.data._id) {
      toast.success('Product added successfully!');
      navigate('/admin/manage-products');
    } else {
      throw new Error(response.data.message || 'Failed to add product');
    }
  } catch (error: any) {
    toast.error(error.message || 'An error occurred');
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="container mx-auto px-4 md:px-12 pt-12 md:pb-4 pb-8">
      {isSubmitting && <LoadingOverlay />}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-3xl md:text-4xl font-bold text-gold-500 mb-8"
      >
        Add Product
      </motion.h1>

      <motion.section
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="mb-12"
      >
        <form onSubmit={handleSubmit} className=" mx-auto space-y-6 bg-white dark:bg-gray-900 p-8 rounded-xl shadow-lg">
          {/* Back Link */}
          <div className="flex items-center mb-4">
            <Link to="/admin/manage-products" className="text-gold-500 hover:text-gold-700 mr-4 flex items-center">
              <FaArrowLeft className="inline mr-2" /> Manage Products
            </Link>
          </div>

          {/* Media Upload */}
          <div>
            <label className="block text-gray-700 dark:text-gray-300 mb-2 md:mb-4 font-semibold md:text-xl">Upload Images</label>
            <div className="overflow-x-auto">
              <div className="flex items-center space-x-4">
                {mediaFiles.map((file, index) => (
                  <div key={index} className="relative flex-shrink-0">
                    <img
                      src={URL.createObjectURL(file)}
                      alt="Preview"
                      className="w-32 h-32 md:w-64 md:h-64 object-cover rounded-xl cursor-pointer"
                      onClick={() => setSelectedMedia(file)}
                    />
                    <button
                      type="button"
                      onClick={() => removeMediaField(index)}
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
            </div>
            <input
              type="file"
              accept="image/*"
              multiple // <-- allow multiple selection
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
              Submit
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

export default AddProduct;