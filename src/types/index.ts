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

export interface Property {
  id: string;
  address: string;
  price: number;
  type: 'house' | 'apartment' | 'condo' | 'townhouse' | 'commercial' | 'land';
  status: 'active' | 'pending' | 'sold' | 'off_market';
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  listingDate: string;
  images: string[];
  description: string;
  agent: string;
  views: number;
  inquiries: number;
}

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