export interface User {
  id: string;
  email: string;
  name: string;
  type: 'individual' | 'organization';
  isFirstTime: boolean;
  avatar?: string;
  role: 'agent' | 'broker' | 'admin' | 'manager';
  phone?: string;
  license?: string;
  brokerage?: string;
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  type: 'main' | 'sub';
  createdAt: string;
  memberCount: number;
  activeListings: number;
  totalDeals: number;
  monthlyRevenue: number;
  image?: string;
  primaryColor?: string;
  secondaryColor?: string;
  roleTags?: string[];
  isWhitelabel?: boolean;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'qualified' | 'nurturing' | 'converted' | 'lost';
  source: 'website' | 'referral' | 'social' | 'advertising' | 'cold_call';
  budget: number;
  propertyType: 'residential' | 'commercial' | 'land' | 'rental';
  location: string;
  assignedAgent: string;
  lastContact: string;
  nextFollowUp: string;
  score: number;
}

// Property interface for Client Portal

export interface Deal {
  id: string;
  propertyId: string;
  clientName: string;
  agent: string;
  value: number;
  status: 'negotiation' | 'under_contract' | 'closing' | 'closed' | 'cancelled';
  stage: string;
  probability: number;
  expectedCloseDate: string;
  commission: number;
  notes: string;
}

export interface AppState {
  user: User | null;
  currentWorkspace: Workspace | null;
  workspaces: Workspace[];
  signupType: 'individual' | 'organization' | null;
  paymentCompleted: boolean;
  verificationCompleted: boolean;
  leads: Lead[];
  properties: Property[];
  deals: Deal[];
  workspaceName?: string;
}
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