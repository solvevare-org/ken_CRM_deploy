import React, { useState } from 'react';
import { Paperclip, Send, Users, MessageCircle, User, Calendar } from 'lucide-react';
// Utility for classnames
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

// Mock data for demonstration
type UserType = {
  id: string;
  name: string;
  role: 'client' | 'realtor' | 'admin';
};
type MessageType = {
  sender: string;
  text: string;
  time: string;
};
type ConversationType = {
  id: string;
  participants: string[];
  messages: MessageType[];
};

const mockUsers: UserType[] = [
  { id: 'u1', name: 'Alice Realtor', role: 'realtor' },
  { id: 'u2', name: 'Bob Admin', role: 'admin' },
  { id: 'u3', name: 'Charlie Client', role: 'client' },
  { id: 'u4', name: 'Dana Realtor', role: 'realtor' },
  { id: 'u5', name: 'Priya Kapoor', role: 'client' },
  { id: 'u6', name: 'Javier Rodriguez', role: 'client' },
  { id: 'u7', name: 'Aisha al-Hadi', role: 'client' },
  { id: 'u8', name: 'Mei Ling Wong', role: 'client' },
  { id: 'u9', name: 'Darnell Thompson', role: 'client' },
];

const mockConversations: ConversationType[] = [
  // Realtor <-> Client
  {
    id: 'c1',
    participants: ['u1', 'u3'],
    messages: [
      { sender: 'u1', text: 'Hey Charlie, do you need help with your property search?', time: '2025-08-13 00:36' },
      { sender: 'u3', text: 'Thank you!', time: '2025-08-13 09:01' },
      { sender: 'u3', text: 'Can you send me the latest listings?', time: '2025-08-13 09:02' },
      { sender: 'u1', text: 'Sure! I will send you a document shortly.', time: '2025-08-13 09:03' },
    ],
  },
  // Admin <-> Realtor
  {
    id: 'c2',
    participants: ['u2', 'u1'],
    messages: [
      { sender: 'u2', text: 'Monthly report is ready.', time: '2025-08-13 08:00' },
      { sender: 'u1', text: 'Received, thanks!', time: '2025-08-13 08:05' },
      { sender: 'u2', text: 'Let me know if you need any changes.', time: '2025-08-13 08:06' },
      { sender: 'u1', text: 'Will do, thanks Bob!', time: '2025-08-13 08:07' },
    ],
  },
  // Client <-> Realtor
  {
    id: 'c3',
    participants: ['u1', 'u5'],
    messages: [
      { sender: 'u5', text: 'I placed an order using this discount and want to check on the shipping status.', time: '2025-08-13 10:21' },
      { sender: 'u1', text: 'I see your order, Priya. It should ship by tomorrow.', time: '2025-08-13 10:22' },
      { sender: 'u5', text: 'Thank you!', time: '2025-08-13 10:23' },
      { sender: 'u1', text: 'You’re welcome! Let me know if you need anything else.', time: '2025-08-13 10:24' },
    ],
  },
  // Client <-> Realtor
  {
    id: 'c4',
    participants: ['u1', 'u6'],
    messages: [
      { sender: 'u6', text: 'I received the wrong color for my dog collar.', time: '2025-08-13 11:00' },
      { sender: 'u1', text: 'Sorry about that, Javier! I will arrange a replacement.', time: '2025-08-13 11:01' },
      { sender: 'u6', text: 'Thanks for the quick response!', time: '2025-08-13 11:02' },
    ],
  },
  // Client <-> Realtor
  {
    id: 'c5',
    participants: ['u1', 'u7'],
    messages: [
      { sender: 'u7', text: 'How do I get a refund on my order?', time: '2025-08-13 12:00' },
      { sender: 'u1', text: 'Hi Aisha, you can request a refund from your account dashboard.', time: '2025-08-13 12:01' },
      { sender: 'u7', text: 'Found it, thanks!', time: '2025-08-13 12:02' },
    ],
  },
  // Client <-> Realtor
  {
    id: 'c6',
    participants: ['u1', 'u8'],
    messages: [
      { sender: 'u8', text: 'I can’t log into my account.', time: '2025-08-13 13:00' },
      { sender: 'u1', text: 'Mei Ling, please try resetting your password.', time: '2025-08-13 13:01' },
      { sender: 'u8', text: 'It worked, thank you!', time: '2025-08-13 13:02' },
    ],
  },
  // Client <-> Realtor
  {
    id: 'c7',
    participants: ['u1', 'u9'],
    messages: [
      { sender: 'u9', text: 'Can I change the shipping address for my last order?', time: '2025-08-13 14:00' },
      { sender: 'u1', text: 'Yes, Darnell. Please send me the new address.', time: '2025-08-13 14:01' },
      { sender: 'u9', text: 'Sent! Thanks.', time: '2025-08-13 14:02' },
    ],
  },
  // Admin <-> Client
  {
    id: 'c8',
    participants: ['u2', 'u3'],
    messages: [
      { sender: 'u2', text: 'Charlie, your account has been upgraded.', time: '2025-08-13 15:00' },
      { sender: 'u3', text: 'Awesome, thanks Bob!', time: '2025-08-13 15:01' },
      { sender: 'u2', text: 'Let us know if you need anything else.', time: '2025-08-13 15:02' },
    ],
  },
  // Admin <-> Realtor
  {
    id: 'c9',
    participants: ['u2', 'u4'],
    messages: [
      { sender: 'u2', text: 'Dana, please review the new compliance guidelines.', time: '2025-08-13 16:00' },
      { sender: 'u4', text: 'Will do, thanks!', time: '2025-08-13 16:01' },
      { sender: 'u2', text: 'Deadline is Friday.', time: '2025-08-13 16:02' },
    ],
  },
  // Client <-> Admin
  {
    id: 'c10',
    participants: ['u2', 'u5'],
    messages: [
      { sender: 'u5', text: 'Hi Bob, I need help with my account settings.', time: '2025-08-13 17:00' },
      { sender: 'u2', text: 'Hi Priya, what do you need changed?', time: '2025-08-13 17:01' },
      { sender: 'u5', text: 'I want to update my email address.', time: '2025-08-13 17:02' },
      { sender: 'u2', text: 'I’ve updated it for you.', time: '2025-08-13 17:03' },
    ],
  },
  // Realtor <-> Realtor
  {
    id: 'c11',
    participants: ['u1', 'u4'],
    messages: [
      { sender: 'u1', text: 'Dana, are you joining the team call today?', time: '2025-08-13 18:00' },
      { sender: 'u4', text: 'Yes, I’ll be there!', time: '2025-08-13 18:01' },
      { sender: 'u1', text: 'Great, see you then.', time: '2025-08-13 18:02' },
    ],
  },
];

// Set currentUser to a realtor for dashboard context
const currentUser: UserType = mockUsers[0]; // Alice Realtor

function getEligibleContacts(user: UserType): UserType[] {
  if (user.role === 'client') {
    return mockUsers.filter(
      (u) =>
        (u.role === 'realtor' && u.id === 'u1') ||
        (u.role === 'admin' && u.id === 'u1')
    );
  }
  if (user.role === 'realtor' || user.role === 'admin') {
    return mockUsers.filter((u) => u.id !== user.id);
  }
  return [];
}

function getUserName(id: string): string {
  const user = mockUsers.find((u) => u.id === id);
  return user ? user.name : 'Unknown';
}

function Messaging() {
  const [selectedConversation, setSelectedConversation] = useState<ConversationType | null>(null);
  const [messageText, setMessageText] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [conversations, setConversations] = useState<ConversationType[]>(mockConversations);
  const [showNew, setShowNew] = useState<boolean>(false);
  const [newRecipient, setNewRecipient] = useState<string>('');
  const eligibleContacts = getEligibleContacts(currentUser);

  const handleSend = () => {
    if (!messageText && !file) return;
    if (selectedConversation) {
      const newMsg: MessageType = {
        sender: currentUser.id,
        text: messageText + (file ? ` [File: ${file.name}]` : ''),
        time: new Date().toISOString().slice(0, 16).replace('T', ' '),
      };
      setConversations((prev) =>
        prev.map((conv) =>
          conv.id === selectedConversation.id
            ? { ...conv, messages: [...conv.messages, newMsg] }
            : conv
        )
      );
      setMessageText('');
      setFile(null);
    }
  };

  const handleStartNew = () => {
    if (!newRecipient) return;
    const newConv: ConversationType = {
      id: `c${conversations.length + 1}`,
      participants: [currentUser.id, newRecipient],
      messages: [],
    };
    setConversations([newConv, ...conversations]);
    setSelectedConversation(newConv);
    setShowNew(false);
    setNewRecipient('');
  };

  const [filterRole, setFilterRole] = useState('all');
  return (
    <div className="flex h-full bg-gray-50">
      {/* Left Panel: Conversation List */}
      <div className="w-1/4 min-w-[260px] bg-white border-r flex flex-col">
        <div className="flex items-center justify-between px-4 py-4 border-b">
          <span className="font-bold text-lg text-gray-800 flex items-center gap-2"><MessageCircle className="text-blue-500" /> Inbox</span>
          <button className="bg-blue-50 text-blue-700 px-3 py-1 rounded hover:bg-blue-100 font-medium" onClick={() => setShowNew(true)}><Users size={16} className="inline mr-1" />Compose</button>
        </div>
        {/* Filter dropdown */}
        <div className="px-4 py-2 border-b flex items-center gap-2 bg-gray-50">
          <span className="text-xs text-gray-600 font-medium">Filter:</span>
          <select
            className="border rounded px-2 py-1 text-xs bg-white"
            value={filterRole}
            onChange={e => setFilterRole(e.target.value)}
          >
            <option value="all">All</option>
            <option value="realtor">Realtor</option>
            <option value="admin">Admin</option>
            <option value="client">Client</option>
          </select>
        </div>
        <div className="flex-1 overflow-y-auto">
          {conversations
            .filter((conv) => conv.participants.includes(currentUser.id))
            .filter((conv) => {
              if (filterRole === 'all') return true;
              const otherUserId = conv.participants.find((id) => id !== currentUser.id);
              const otherUser = mockUsers.find((u) => u.id === otherUserId);
              return otherUser?.role === filterRole;
            })
            .map((conv) => {
              const otherUserId = conv.participants.find((id) => id !== currentUser.id);
              const otherUser = mockUsers.find((u) => u.id === otherUserId);
              return (
                <div
                  key={conv.id}
                  className={`px-4 py-3 border-b cursor-pointer flex items-center gap-3 ${selectedConversation && selectedConversation.id === conv.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
                  onClick={() => setSelectedConversation(conv)}
                >
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600">{otherUser?.name.charAt(0)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 text-sm flex items-center gap-2">
                      {otherUser?.name}
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        otherUser?.role === 'realtor' ? 'bg-blue-100 text-blue-700' :
                        otherUser?.role === 'admin' ? 'bg-green-100 text-green-700' :
                        otherUser?.role === 'client' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {otherUser?.role ? (otherUser.role.charAt(0).toUpperCase() + otherUser.role.slice(1)) : 'Unknown'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 truncate">{conv.messages.length > 0 ? conv.messages[conv.messages.length - 1].text : 'No messages yet'}</div>
                  </div>
                  <div className="text-xs text-gray-400">{conv.messages.length > 0 ? conv.messages[conv.messages.length - 1].time.slice(11) : ''}</div>
                </div>
              );
            })}
        </div>
      </div>
      {/* Center Panel: Chat & Details */}
      <div className="flex-1 flex flex-col border-r bg-white">
        {selectedConversation ? (
          <>
            <div className="flex items-center justify-between px-6 py-4 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 text-lg">
                  {getUserName(selectedConversation.participants.find((id) => id !== currentUser.id) || '')[0]}
                </div>
                <div>
                  <div className="font-bold text-gray-900 text-base">{selectedConversation.participants.filter((id) => id !== currentUser.id).map(getUserName).join(', ')}</div>
                  <div className="text-xs text-gray-500">Online 1 min ago</div>
                </div>
              </div>
              <button className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded hover:bg-blue-100 font-medium"><Calendar size={16} /> Book a Meeting</button>
            </div>
            <div className="flex-1 overflow-y-auto px-0 py-0 bg-[#f7f9fa]">
              {selectedConversation.messages.map((msg, idx) => {
                const isMe = msg.sender === currentUser.id;
                return (
                  <div key={idx} className="flex items-center px-6 py-2 border-b last:border-b-0 bg-transparent">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-600 mr-3">{getUserName(msg.sender)[0]}</div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 text-sm">{getUserName(msg.sender)}</span>
                        <span className="text-xs text-gray-400">{msg.time.slice(11)}</span>
                      </div>
                      <div className="text-sm text-gray-700 whitespace-pre-line">{msg.text}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="border-t px-6 py-5 flex items-center gap-2 bg-[#f7f9fa]">
              <input
                type="text"
                className="flex-1 border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-100 text-gray-900"
                placeholder="Type your message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <label className="cursor-pointer flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100">
                <Paperclip className="text-gray-400" />
                <input
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const files = (e.target as HTMLInputElement).files;
                    if (files && files[0]) setFile(files[0]);
                  }}
                />
              </label>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-1 shadow-none"
                onClick={handleSend}
              >
                <Send size={18} /> Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <MessageCircle size={48} />
            <div className="mt-2">Select a conversation or start a new one.</div>
          </div>
        )}
      </div>
      {/* Right Panel: Contact Details */}
      <div className="w-1/4 min-w-[260px] bg-white flex flex-col border-l">
        {selectedConversation ? (
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700 text-xl">
                {getUserName(selectedConversation.participants.find((id) => id !== currentUser.id) || '')[0]}
              </div>
              <div>
                <div className="font-bold text-gray-900 text-lg flex items-center gap-2">
                  {selectedConversation.participants.filter((id) => id !== currentUser.id).map(getUserName).join(', ')}
                  <span className={`text-xs px-2 py-0.5 rounded-full ${(() => {
                    const otherUserId = selectedConversation.participants.find((id) => id !== currentUser.id);
                    const otherUser = mockUsers.find((u) => u.id === otherUserId);
                    if (!otherUser) return 'bg-gray-100 text-gray-700';
                    if (otherUser.role === 'realtor') return 'bg-blue-100 text-blue-700';
                    if (otherUser.role === 'admin') return 'bg-green-100 text-green-700';
                    if (otherUser.role === 'client') return 'bg-yellow-100 text-yellow-700';
                    return 'bg-gray-100 text-gray-700';
                  })()}`}>
                    {(() => {
                      const otherUserId = selectedConversation.participants.find((id) => id !== currentUser.id);
                      const otherUser = mockUsers.find((u) => u.id === otherUserId);
                      return otherUser?.role ? (otherUser.role.charAt(0).toUpperCase() + otherUser.role.slice(1)) : 'Unknown';
                    })()}
                  </span>
                </div>
                <div className="text-xs text-gray-500">Role: {(() => {
                  const otherUserId = selectedConversation.participants.find((id) => id !== currentUser.id);
                  const otherUser = mockUsers.find((u) => u.id === otherUserId);
                  return otherUser?.role ? (otherUser.role.charAt(0).toUpperCase() + otherUser.role.slice(1)) : 'Unknown';
                })()}</div>
              </div>
            </div>
            <div className="mb-4">
              <div className="text-xs text-gray-500">Email</div>
              <div className="font-medium text-gray-800">{mockUsers.find(u => u.id === selectedConversation.participants.find((id) => id !== currentUser.id))?.name.toLowerCase().replace(' ', '.')}@realtypro.com</div>
            </div>
            <div className="mb-4">
              <div className="text-xs text-gray-500">Phone</div>
              <div className="font-medium text-gray-800">+1 555-123-4567</div>
            </div>
            <div className="mb-4">
              <div className="text-xs text-gray-500">Company</div>
              <div className="font-medium text-gray-800">RealtyPro</div>
            </div>
            <div className="mb-4">
              <div className="text-xs text-gray-500">Other Conversations</div>
              <div className="font-medium text-blue-600 cursor-pointer hover:underline">View all</div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <User size={48} />
            <div className="mt-2">Select a conversation to view details.</div>
          </div>
        )}
      </div>
      {/* New Conversation Modal */}
      {showNew && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <div className="font-bold mb-2">Start New Conversation</div>
            <select
              className="w-full border rounded px-3 py-2 mb-4"
              value={newRecipient}
              onChange={(e) => setNewRecipient(e.target.value)}
            >
              <option value="">Select contact...</option>
              {eligibleContacts.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.role})
                </option>
              ))}
            </select>
            <button
              className="w-full bg-blue-500 text-white py-2 rounded"
              onClick={handleStartNew}
            >
              Start Conversation
            </button>
            <button
              className="w-full mt-2 text-gray-500 hover:text-gray-700"
              onClick={() => setShowNew(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Messaging;
// ...existing code...
