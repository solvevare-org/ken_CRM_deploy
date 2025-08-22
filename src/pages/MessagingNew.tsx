import React from 'react';
import RealTimeChat from '../components/RealTimeChat';

function Messaging() {
  return (
    <div className="p-6 h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600">Real-time chat with clients and realtors</p>
      </div>
      
      <div className="h-[calc(100vh-200px)]">
        <RealTimeChat />
      </div>
    </div>
  );
}

export default Messaging;
