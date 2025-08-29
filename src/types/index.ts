export interface User {
  id: string;
  email: string;
  name: string;
  type: "individual" | "organization";
  isFirstTime: boolean;
  avatar?: string;
  role: "agent" | "broker" | "admin" | "manager";
  phone?: string;
  license?: string;
  brokerage?: string;
}

export interface Workspace {
  id: string;
  name: string;
  description: string;
  type: "main" | "sub";
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

// Lead type from Realtor (3rd developer) section below is the canonical one.

// Client Portal Property

export interface Deal {
  id: string;
  propertyId: string;
  clientName: string;
  agent: string;
  value: number;
  status: "negotiation" | "under_contract" | "closing" | "closed" | "cancelled";
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
  signupType: "individual" | "organization" | null;
  paymentCompleted: boolean;
  verificationCompleted: boolean;
  leads: Lead[];
  properties: ClientProperty[];
  deals: Deal[];
  workspaceName?: string;
}
export interface ClientProperty {
  id: string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  image: string;
  description: string;
  type: "house" | "apartment" | "condo" | "townhouse";
  status: "available" | "pending" | "sold";
  isFavorited: boolean;
  agent: {
    name: string;
    phone: string;
    email: string;
  };
}

// New API-based Client Property interfaces
export interface ClientPropertyAddress {
  street: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface ClientPropertyLocation {
  latitude: number;
  longitude: number;
  street_view_url?: string;
  county_fips?: string;
  address?: {
    line?: string;
    street_number?: string;
    street_name?: string;
    street_suffix?: string;
    city?: string;
    state?: string;
    state_code?: string;
    postal_code?: string;
    country?: string | null;
    unit?: string | null;
  };
  coordinate?: {
    lat?: number;
    lon?: number;
    accuracy?: number | null;
  };
  county?: {
    fips_code?: string;
    name?: string | null;
  };
  neighborhoods?: ClientPropertyNeighborhood[];
}

export interface ClientPropertyDetails {
  beds: number;
  baths: number;
  baths_full: number;
  baths_half: number | null;
  sqft: number;
  lot_sqft: number;
  year_built: number | null;
  sub_type: string | null;
  type?: string;
  stories?: number;
  units?: number;
}

export interface ClientPropertyMedia {
  primary_photo: string;
  photo_count: number;
  photos?: string[];
  virtual_tours?: boolean;
  matterport?: boolean;
  videos?: boolean;
}

export interface ClientPropertyFlags {
  is_new_listing: boolean;
  is_pending: boolean;
  is_contingent: boolean;
  is_foreclosure: boolean;
  is_new_construction: boolean;
  is_plan: boolean;
  is_coming_soon: boolean;
  is_price_reduced: boolean;
}

export interface ClientPropertyAPI {
  _id: string;
  name: string;
  price: number;
  status: string;
  property_type: string;
  source_type: string;
  createdAt: string;
  listed_date: string;
  fullAddress: string;
  imageArray: string[];
  id: string;
  address: ClientPropertyAddress;
  location?: ClientPropertyLocation;
  details?: ClientPropertyDetails;
  media?: ClientPropertyMedia;
  flags?: ClientPropertyFlags;
  description?: ClientPropertyDescription;
  pricing?: ClientPropertyPricing;
  schools?: ClientPropertySchools;
  property_history?: ClientPropertyHistory[];
  tax_history?: ClientPropertyTaxHistory[];
  estimates?: ClientPropertyEstimates;
}

export interface ClientPropertyApiResponse {
  statusCode: number;
  message: string;
  data: {
    items: ClientPropertyAPI[];
    pageInfo: {
      endCursor: string;
      hasNextPage: boolean;
    };
    role: string;
  };
  success: boolean;
}

export interface BookmarkResponse {
  statusCode: number;
  message: string;
  data: {
    bookmarks: Array<{
      bookmark_id: string;
      bookmarked_at: string;
      notes: string;
      age_in_days: number;
      property: ClientPropertyAPI;
    }>;
    pagination: {
      limit: number;
      skip: number;
      count: number;
    };
  };
  success: boolean;
}

export interface ChatMessage {
  id: string;
  content: string;
  timestamp: Date;
  sender: "client" | "agent";
  senderName: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: Date;
  type: "info" | "success" | "warning" | "error";
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

// Realtor Portal Types
export interface RealtorProperty {
  id: string;
  title: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  status: "active" | "pending" | "sold" | "draft";
  type: "house" | "condo" | "townhouse" | "land";
  image: string;
  dateAdded: Date;
  commission: number;
}

// In src/types/index.ts, update ClientPropertyDetails:
export interface ClientPropertyDetails {
  beds: number;
  baths: number;
  baths_full: number;
  baths_half: number | null;
  sqft: number;
  lot_sqft: number;
  year_built: number | null;
  sub_type: string | null;
  stories?: number;  // Add this
  units?: number;    // Add this
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: "buyer" | "seller" | "both";
  status: "active" | "inactive" | "potential";
  lastContact: Date;
  totalValue: number;
  properties: string[];
}

export interface Transaction {
  id: string;
  propertyId: string;
  clientId: string;
  type: "sale" | "listing" | "showing";
  amount: number;
  date: Date;
  status: "completed" | "pending" | "cancelled";
}

export interface Analytics {
  totalSales: number;
  totalCommission: number;
  activeListings: number;
  monthlyRevenue: number[];
  salesByType: Record<string, number>;
  topPerformingProperties: RealtorProperty[];
}

// Canonical Lead type (3rd developer)
export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source:
    | "website"
    | "referral"
    | "social"
    | "advertising"
    | "walk-in"
    | "other";
  status:
    | "new"
    | "contacted"
    | "qualified"
    | "nurturing"
    | "converted"
    | "lost";
  interestedIn: "buying" | "selling" | "renting" | "investing";
  budget?: number;
  preferredLocation?: string;
  notes: string;
  assignedAgent?: string;
  createdAt: Date;
  lastContact?: Date;
  nextFollowUp?: Date;
}

export interface Document {
  id: string;
  name: string;
  type:
    | "contract"
    | "listing"
    | "disclosure"
    | "inspection"
    | "appraisal"
    | "other";
  propertyId?: string;
  clientId?: string;
  url: string;
  uploadedAt: Date;
  uploadedBy: string;
  size: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: "follow-up" | "showing" | "paperwork" | "marketing" | "other";
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "in-progress" | "completed" | "cancelled";
  dueDate: Date;
  assignedTo: string;
  propertyId?: string;
  clientId?: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface MarketingCampaign {
  id: string;
  name: string;
  type: "email" | "social" | "print" | "online" | "direct-mail";
  status: "draft" | "active" | "paused" | "completed";
  propertyIds: string[];
  targetAudience: string;
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  leads: number;
  startDate: Date;
  endDate?: Date;
}

export interface Appointment {
  id: string;
  title: string;
  type:
    | "showing"
    | "listing"
    | "consultation"
    | "closing"
    | "inspection"
    | "other";
  propertyId?: string;
  clientId?: string;
  startTime: Date;
  endTime: Date;
  location: string;
  notes?: string;
  status: "scheduled" | "confirmed" | "completed" | "cancelled" | "no-show";
  attendees: string[];
}

export interface Commission {
  id: string;
  propertyId: string;
  clientId: string;
  salePrice: number;
  commissionRate: number;
  grossCommission: number;
  splits: {
    agent: number;
    brokerage: number;
    referral?: number;
  };
  netCommission: number;
  status: "pending" | "paid" | "disputed";
  closingDate: Date;
  paidDate?: Date;
}

// Error handling helper
export interface ApiErrorResponse {
  message: string;
  statusCode?: number;
  errors?: string[];
}

export interface ClientPropertyDescription {
  summary?: string;
  features?: string[];
  highlights?: string[];
  text?: string;
}

export interface ClientPropertyPricing {
  list_price?: number;
  last_sold_date?: string | null;
  last_sold_price?: number;
  price_per_sqft?: number;
  monthly_payment?: number;
}

export interface ClientPropertySchool {
  id: string;
  name: string;
  type: string;
  distance?: number;
  rating?: number;
  district?: {
    name?: string;
  };
  distance_in_miles?: number;
  education_levels?: string[];
}

export interface ClientPropertySchools {
  assigned?: ClientPropertySchool[];
  nearby?: ClientPropertySchool[];
}

export interface ClientPropertyNeighborhood {
  id: string;
  name: string;
  type: string;
  description?: string;
  city?: string;
  level?: string;
  geo_statistics?: {
    housing_market?: {
      median_listing_price?: number;
    };
  };
}

export interface ClientPropertyHistory {
  id: string;
  date: string;
  event: string;
  event_name?: string;
  source_name?: string;
  price?: number;
  details?: string;
}

export interface ClientPropertyTaxHistory {
  year: number;
  amount: number;
  assessment?: {
    total?: number;
  };
  tax?: number;
}

export interface ClientPropertyEstimate {
  source: string;
  value: number;
  confidence?: number;
  date?: string;
  name?: string;
}

export interface ClientPropertyEstimates {
  zestimate?: ClientPropertyEstimate;
  redfin?: ClientPropertyEstimate;
  other?: ClientPropertyEstimate[];
  current_values?: Array<{
    source: ClientPropertyEstimate;
    estimate: number;
    estimate_low: number;
    estimate_high: number;
    date: string;
  }>;
}
