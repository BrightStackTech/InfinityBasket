import React, { useState } from 'react';
import { FaPaperPlane, FaTimes } from 'react-icons/fa';
import api from '../api/config';
import { toast } from 'react-hot-toast';

interface ReplyProps {
  messageId: string;
  onClose: () => void;
  onReplySuccess: () => void;
}

const Reply: React.FC<ReplyProps> = ({ messageId, onClose, onReplySuccess }) => {
  const [replyContent, setReplyContent] = useState('');
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    if (!replyContent.trim()) {
      toast.error('Reply cannot be empty');
      return;
    }

    setSending(true);
    try {
      const response = await api.post(`/messages/${messageId}/reply`, {
        replyContent: replyContent.trim()
      });

      if (response.data.success) {
        toast.success('Reply sent successfully');
        onReplySuccess();
        onClose();
      }
    } catch (error: any) {
      console.error('Failed to send reply:', error);
      toast.error(error.response?.data?.message || 'Failed to send reply');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="border-t dark:border-gray-700 p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          Write Reply
        </h3>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
        >
          <FaTimes className="text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      <textarea
        value={replyContent}
        onChange={(e) => setReplyContent(e.target.value)}
        placeholder="Type your reply..."
        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-gold-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none"
        rows={4}
        autoFocus
      />

      <div className="flex justify-end gap-2 mt-2">
        <button
          onClick={onClose}
          className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={sending}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500 hover:bg-gold-600 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          {sending ? (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
          ) : (
            <FaPaperPlane />
          )}
          Send Reply
        </button>
      </div>
    </div>
  );
};

export default Reply;