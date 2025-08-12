import React, { useState } from 'react';
import { FaUser, FaReply, FaTimes } from 'react-icons/fa';
import Reply from './Reply';

interface MessageProps {
  message: {
    _id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    createdAt: string;
    status: 'pending' | 'replied';
    reply?: {
      content: string;
      repliedAt: string;
    };
  };
  onClose: () => void;
  onReplySuccess?: () => void;
}

const Message: React.FC<MessageProps> = ({ message, onClose, onReplySuccess }) => {
  const [showReplyBox, setShowReplyBox] = useState(false);

  const formattedDate = new Date(message.createdAt).toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata'
  });

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      {/* Header */}
      <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          {message.subject}
        </h2>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
        >
          <FaTimes className="text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      {/* Sender Info */}
      <div className="p-4 flex items-start gap-4 border-b dark:border-gray-700">
        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
          <FaUser className="text-gray-400 dark:text-gray-500 text-xl" />
        </div>
        <div className="min-w-0">
          <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-2">
            <span className="font-semibold text-gray-900 dark:text-white truncate">
              {message.name}
            </span>
            <span className="text-gray-500 dark:text-gray-400 text-sm md:text-base truncate">
              &lt;{message.email}&gt;
            </span>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {formattedDate}
          </div>
        </div>
      </div>

      {/* Message Content */}
      <div className="p-6 flex-1 overflow-auto">
        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
          {message.message}
        </p>

        {/* Show Reply if exists */}
        {message.reply && (
          <div className="mt-8 pt-4 border-t dark:border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <FaReply className="text-gold-500" />
              <span className="text-sm text-gray-500">
                Replied on {new Date(message.reply.repliedAt).toLocaleString()}
              </span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap pl-6 bg-gray-100 dark:bg-gray-700 rounded-md p-2">
              {message.reply.content}
            </p>
          </div>
        )}
      </div>

      {/* Reply Section */}
      {showReplyBox ? (
        <Reply
          messageId={message._id}
          onClose={() => setShowReplyBox(false)}
          onReplySuccess={() => {
            if (onReplySuccess) onReplySuccess();
          }}
        />
      ) : (
        !message.reply && (
          <div className="p-4 border-t dark:border-gray-700">
            <button
              onClick={() => setShowReplyBox(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gold-500 hover:bg-gold-600 text-white rounded-lg transition-colors"
            >
              <FaReply />
              Reply
            </button>
          </div>
        )
      )}
    </div>
  );
};

export default Message;