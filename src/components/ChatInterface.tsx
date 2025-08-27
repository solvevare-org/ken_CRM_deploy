import React from 'react';
import { useSelector } from 'react-redux';
import { selectUser } from '../store/slices/authSlice';
import ClientChat from './ClientChat';
import RealtorChat from './RealtorChat';
import { MessageCircle } from 'lucide-react';

const ChatInterface: React.FC = () => {
  const user = useSelector(selectUser);

  // Show loading state if user data is not available
  if (!user) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Loading chat interface...</p>
        </div>
      </div>
    );
  }

  // Render appropriate chat interface based on user type
  if (user.userType === 'Client') {
    return <ClientChat />;
  } else if (user.userType === 'Realtor' || user.userType === 'Organization') {
    return <RealtorChat />;
  } else {
    return (
      <div className="flex items-center justify-center h-64 text-red-600">
        <div className="text-center">
          <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>Chat not available for this user type</p>
          <p className="text-sm text-gray-500">Only Clients and Realtors can access chat</p>
        </div>
      </div>
    );
  }
};

export default ChatInterface;
