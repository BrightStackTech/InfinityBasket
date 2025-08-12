import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaBars, FaSearch, FaSortAmountDown, FaSortAmountUp, FaTrash, FaRegSquare, FaRegCheckSquare } from 'react-icons/fa';
import api from '../../api/config';
import toast from 'react-hot-toast';
import Message from '../../components/Message';

interface Message {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'pending' | 'replied';
}
const Inbox = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'replied'>('all');
    const [selectedMessages, setSelectedMessages] = useState<string[]>([]);
    const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const filters = [
    { value: 'all', label: 'All Messages' },
    { value: 'enquiry', label: 'Product Enquiry' },
    { value: 'service', label: 'Related to Service' },
    { value: 'website', label: 'Related to Website' },
    { value: 'feedback', label: 'Feedback' },
    { value: 'complaint', label: 'Complaint' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    fetchMessages();
  }, []);

    const fetchMessages = async () => {
    try {
        const response = await api.get('/messages');  // Changed from '/contact' to '/messages'
        setMessages(response.data);
    } catch (error) {
        console.error('Failed to fetch messages:', error);
        toast.error('Failed to fetch messages');
    } finally {
        setLoading(false);
    }
    };

  const filteredMessages = messages
    .filter(message => {
      if (selectedFilter !== 'all') {
        return message.subject === selectedFilter;
      }
      return true;
    })
    .filter(message => {
      if (statusFilter !== 'all') {
        return message.status === statusFilter;
      }
      return true;
    })
    .filter(message => 
      message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    const truncateText = (text: string, limit: number) => {
        if (text.length <= limit) return text;
        return `${text.slice(0, limit)}...`;
    };

    const toggleSelectAll = () => {
    if (selectedMessages.length === filteredMessages.length) {
        setSelectedMessages([]);
    } else {
        setSelectedMessages(filteredMessages.map(msg => msg._id));
    }
    };

    const toggleSelectMessage = (messageId: string) => {
    setSelectedMessages(prev => 
        prev.includes(messageId) 
        ? prev.filter(id => id !== messageId)
        : [...prev, messageId]
    );
    };

    const handleDeleteSelected = async () => {
    if (window.confirm('Are you sure you want to delete selected messages?')) {
        try {
        await api.delete('/messages/multiple', { data: { ids: selectedMessages } }); // Changed from '/contact/multiple'
        toast.success('Messages deleted successfully');
        fetchMessages();
        setSelectedMessages([]);
        } catch (error) {
        console.error('Failed to delete messages:', error);
        toast.error('Failed to delete messages');
        }
    }
    };

    const handleMessageClick = (message: Message) => {
    setSelectedMessage(message);
    };

    
  return (
    <div className="container mx-auto px-4 max-h-screen flex flex-col">
      <div className="flex flex-col flex-1 min-h-0 mt-4">
        {/* Search and Sort Header */}
        <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md mb-4 p-4 overflow-x-auto">
            <div className="flex items-center justify-between min-w-max gap-4">
            <div className="flex items-center gap-4">
                <button 
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300"
                aria-label="Toggle sidebar"
                >
                <FaBars />
                </button>
                <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 w-[225px] md:w-[300px] border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 dark:bg-gray-700 dark:border-gray-600"
                />
                </div>
                <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | 'pending' | 'replied')}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gold-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="replied">Replied</option>
                </select>
            </div>
            <div className="flex items-center gap-4">
                {selectedMessages.length > 0 && (
                <button
                    onClick={handleDeleteSelected}
                    className="p-2 hover:bg-red-100 text-red-600 rounded-full transition-colors"
                    title="Delete selected messages"
                >
                    <FaTrash />
                </button>
                )}
                <button
                onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-600 dark:text-gray-300 transition-colors"
                title={sortOrder === 'asc' ? 'Sort Descending' : 'Sort Ascending'}
                >
                {sortOrder === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />}
                </button>
            </div>
            </div>
        </div>

        {/* Content Area */}
        <div className="flex gap-4 flex-1 h-[600px] md:h-[450px]">
          {/* Sidebar */}
          <motion.div 
            initial={{ width: isSidebarOpen ? 250 : 0 }}
            animate={{ width: isSidebarOpen ? 250 : 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden h-[600px] md:h-[450px]"
          >
            <div className="p-4 space-y-2">
              {filters.map(filter => (
                <button
                  key={filter.value}
                  onClick={() => setSelectedFilter(filter.value)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                    selectedFilter === filter.value
                    ? 'bg-gold-500 text-white'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-white'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Messages Table */}
          <div className="flex-1 bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden h-[600px] md:h-[450px]">
                      {selectedMessage ? (
                          <Message
                              message={selectedMessage}
                              onClose={() => setSelectedMessage(null)}
                          />
                      ) : (
                          <div className="overflow-x-auto">
                              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                  <thead className="bg-gray-50 dark:bg-gray-700">
                                      <tr>
                                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300">
                                              <button
                                                  onClick={toggleSelectAll}
                                                  className="hover:text-gold-500 transition-colors"
                                                  title={selectedMessages.length === filteredMessages.length ? 'Deselect all' : 'Select all'}
                                              >
                                                  {selectedMessages.length === filteredMessages.length ? (
                                                      <FaRegCheckSquare size={18} />
                                                  ) : (
                                                      <FaRegSquare size={18} />
                                                  )}
                                              </button>
                                          </th>
                                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Subject</th>
                                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider min-w-[300px]">Message</th>
                                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                      </tr>
                                  </thead>
                                  <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                                      {loading ? (
                                          <tr>
                                              <td colSpan={6} className="px-6 py-4 text-center">
                                                  <div className="flex justify-center">
                                                      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gold-500"></div>
                                                  </div>
                                              </td>
                                          </tr>
                                      ) : filteredMessages.length === 0 ? (
                                          <tr>
                                              <td colSpan={6} className="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                                                  No messages found
                                              </td>
                                          </tr>
                                      ) : (
                                          filteredMessages.map((message) => (
                                                <tr 
                                                key={message._id}
                                                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                                                onClick={(e) => {
                                                    // Prevent click when selecting checkbox
                                                    if ((e.target as HTMLElement).closest('button')) return;
                                                    handleMessageClick(message);
                                                }}
                                                >
                                                  <td className="px-6 py-4">
                                                      <button
                                                          onClick={() => toggleSelectMessage(message._id)}
                                                          className="hover:text-gold-500 transition-colors"
                                                      >
                                                          {selectedMessages.includes(message._id) ? (
                                                              <FaRegCheckSquare size={18} />
                                                          ) : (
                                                              <FaRegSquare size={18} />
                                                          )}
                                                      </button>
                                                  </td>
                                                  <td className="px-6 py-4">
                                                      <span
                                                          className="text-sm font-medium text-gray-900 dark:text-white block overflow-hidden text-ellipsis whitespace-nowrap max-w-[150px]"
                                                          title={message.name}
                                                      >
                                                          {truncateText(message.name, 15)}
                                                      </span>
                                                  </td>
                                                  <td className="px-6 py-4">
                                                      <span
                                                          className="text-sm text-gray-500 dark:text-gray-300 block overflow-hidden text-ellipsis whitespace-nowrap max-w-[200px]"
                                                          title={message.email}
                                                      >
                                                          {truncateText(message.email, 25)}
                                                      </span>
                                                  </td>
                                                  <td className="px-6 py-4 whitespace-nowrap">
                                                      <span className="text-sm font-medium text-gold-500 dark:text-gold-400">
                                                          {message.subject}
                                                      </span>
                                                  </td>
                                                  <td className="px-6 py-4">
                                                      <p
                                                          className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 max-w-[300px]"
                                                          title={message.message}
                                                      >
                                                          {truncateText(message.message, 50)}
                                                      </p>
                                                  </td>
                                                  <td className="px-6 py-4 whitespace-nowrap">
                                                      <span className="text-sm text-gray-500 dark:text-gray-400">
                                                          {new Date(message.createdAt).toLocaleDateString()}
                                                      </span>
                                                  </td>
                                                  <td className="px-6 py-4 whitespace-nowrap text-right">
                                                      <span className={`inline-flex rounded-full px-2 text-xs font-semibold ${message.status === 'pending'
                                                              ? 'bg-yellow-100 text-yellow-800'
                                                              : 'bg-green-100 text-green-800'
                                                          }`}>
                                                          {message.status}
                                                      </span>
                                                  </td>
                                              </tr>
                                          ))
                                      )}
                                  </tbody>
                              </table>
                          </div>
                      )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inbox;