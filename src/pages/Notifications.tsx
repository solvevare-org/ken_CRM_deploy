import React, { useState } from 'react';
import { Mail, Users, Home, Calendar, ArrowRight } from 'lucide-react';

const mockNotifications = [
  {
    id: '1',
    type: 'message',
    title: 'New Message from Client',
    description: 'John Doe sent you a message about 123 Main St.',
    time: '2 min ago',
    icon: Mail,
    action: 'Open Messaging',
    section: 'clients',
  },
  {
    id: '2',
    type: 'property',
    title: 'New Property Assigned',
    description: 'You have been assigned to 456 Oak Ave.',
    time: '10 min ago',
    icon: Home,
    action: 'View Property',
    section: 'properties',
  },
  {
    id: '3',
    type: 'transaction',
    title: 'Transaction Stage Update',
    description: 'Offer accepted for 789 Pine Rd.',
    time: '30 min ago',
    icon: Users,
    action: 'View Transaction',
    section: 'dashboard',
  },
  {
    id: '4',
    type: 'reminder',
    title: 'Viewing Reminder',
    description: 'Viewing scheduled for 123 Main St. tomorrow at 2pm.',
    time: '1 hr ago',
    icon: Calendar,
    action: 'View Calendar',
    section: 'calendar',
  },
];

const Notifications: React.FC<{ onNavigate?: (section: string) => void }> = ({ onNavigate }) => {
  const [notifications, setNotifications] = useState(mockNotifications);

  // Simulate real-time alert
  // In real app, use websocket or polling
  // For demo, add a notification after 5s
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setNotifications(prev => [
        {
          id: '5',
          type: 'message',
          title: 'Team Message',
          description: 'Admin sent a message to all agents.',
          time: 'Just now',
          icon: Mail,
          action: 'Open Messaging',
          section: 'clients',
        },
        ...prev,
      ]);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 px-2">
      <div className="max-w-xl w-full">
        <h2 className="text-3xl font-bold mb-6 text-blue-700 text-center">Notifications & Reminders</h2>
        <div className="space-y-4">
          {notifications.map(n => {
            const Icon = n.icon;
            return (
              <div key={n.id} className="bg-white rounded-xl shadow p-4 border-l-4 border-blue-400 flex items-center gap-4">
                <div className="flex items-center justify-center w-12 h-12 bg-blue-50 rounded-full">
                  <Icon className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-blue-700">{n.title}</div>
                  <div className="text-gray-700 text-sm">{n.description}</div>
                  <div className="text-xs text-gray-400 mt-1">{n.time}</div>
                </div>
                <button
                  className="flex items-center gap-1 text-blue-600 font-semibold hover:underline"
                  onClick={() => onNavigate && onNavigate(n.section)}
                >
                  {n.action} <ArrowRight size={16} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
