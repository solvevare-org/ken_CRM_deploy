export interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  description: string;
  type: 'house' | 'apartment' | 'condo' | 'townhouse';
  status: 'available' | 'pending' | 'sold';
  isFavorited: boolean;
  agent: {
    name: string;
    phone: string;
    email: string;
  };
}

export interface ChatMessage {
  id: string;
  content: string;
  timestamp: Date;
  sender: 'client' | 'agent';
  senderName: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
}

export interface UserSettings {
  name: string;
  email: string;
  phone: string;
  preferences: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    marketingEmails: boolean;
    priceAlerts: boolean;
  };
  searchPreferences: {
    minPrice: number;
    maxPrice: number;
    propertyTypes: string[];
    locations: string[];
  };
}