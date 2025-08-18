import {
  ClientProperty,
  ChatMessage,
  Notification,
  UserSettings,
} from "../types";

export const mockProperties: ClientProperty[] = [
  {
    id: "1",
    title: "Modern Downtown Apartment",
    price: 450000,
    location: "Downtown, Seattle, WA",
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    image:
      "https://images.pexels.com/photos/1396132/pexels-photo-1396132.jpeg?auto=compress&cs=tinysrgb&w=500",
    description:
      "Stunning modern apartment in the heart of downtown with city views and premium amenities.",
    type: "apartment",
    status: "available",
    isFavorited: false,
    agent: {
      name: "Sarah Johnson",
      phone: "(555) 123-4567",
      email: "sarah@realestate.com",
    },
  },
  {
    id: "2",
    title: "Luxury Family Home",
    price: 750000,
    location: "Bellevue, WA",
    bedrooms: 4,
    bathrooms: 3,
    area: 2800,
    image:
      "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=500",
    description:
      "Spacious family home with large backyard, modern kitchen, and excellent schools nearby.",
    type: "house",
    status: "available",
    isFavorited: true,
    agent: {
      name: "Michael Chen",
      phone: "(555) 987-6543",
      email: "michael@realestate.com",
    },
  },
  {
    id: "3",
    title: "Cozy Condo with Lake View",
    price: 320000,
    location: "Lake Washington, WA",
    bedrooms: 1,
    bathrooms: 1,
    area: 850,
    image:
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=500",
    description:
      "Charming condo with beautiful lake views and walking distance to parks and cafes.",
    type: "condo",
    status: "pending",
    isFavorited: true,
    agent: {
      name: "Emily Davis",
      phone: "(555) 456-7890",
      email: "emily@realestate.com",
    },
  },
  {
    id: "4",
    title: "Elegant Townhouse",
    price: 580000,
    location: "Capitol Hill, Seattle, WA",
    bedrooms: 3,
    bathrooms: 2,
    area: 1800,
    image:
      "https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg?auto=compress&cs=tinysrgb&w=500",
    description:
      "Beautiful townhouse in trendy Capitol Hill with modern updates and rooftop deck.",
    type: "townhouse",
    status: "available",
    isFavorited: false,
    agent: {
      name: "David Wilson",
      phone: "(555) 234-5678",
      email: "david@realestate.com",
    },
  },
  {
    id: "5",
    title: "Waterfront Penthouse",
    price: 1200000,
    location: "Waterfront, Seattle, WA",
    bedrooms: 3,
    bathrooms: 3,
    area: 2200,
    image:
      "https://images.pexels.com/photos/1571471/pexels-photo-1571471.jpeg?auto=compress&cs=tinysrgb&w=500",
    description:
      "Luxurious penthouse with panoramic water views, premium finishes, and private balcony.",
    type: "apartment",
    status: "available",
    isFavorited: false,
    agent: {
      name: "Lisa Thompson",
      phone: "(555) 345-6789",
      email: "lisa@realestate.com",
    },
  },
];

export const mockChatMessages: ChatMessage[] = [
  {
    id: "1",
    content:
      "Hi! I'm interested in the downtown apartment listing. Can we schedule a viewing?",
    timestamp: new Date("2024-01-15T10:30:00"),
    sender: "client",
    senderName: "You",
  },
  {
    id: "2",
    content:
      "Hello! I'd be happy to help you schedule a viewing. Are you available this weekend?",
    timestamp: new Date("2024-01-15T10:45:00"),
    sender: "agent",
    senderName: "Sarah Johnson",
  },
  {
    id: "3",
    content:
      "Yes, Saturday afternoon would work great for me. What time would be convenient?",
    timestamp: new Date("2024-01-15T11:00:00"),
    sender: "client",
    senderName: "You",
  },
  {
    id: "4",
    content:
      "Perfect! How about 2:00 PM on Saturday? I'll meet you at the property.",
    timestamp: new Date("2024-01-15T11:15:00"),
    sender: "agent",
    senderName: "Sarah Johnson",
  },
];

export const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "New Property Match",
    message:
      "A new property matching your criteria has been listed in Bellevue, WA.",
    timestamp: new Date("2024-01-15T09:00:00"),
    type: "info",
    read: false,
  },
  {
    id: "2",
    title: "Price Reduction Alert",
    message: "The luxury family home in Bellevue has been reduced by $25,000.",
    timestamp: new Date("2024-01-14T15:30:00"),
    type: "success",
    read: false,
  },
  {
    id: "3",
    title: "Viewing Scheduled",
    message:
      "Your viewing for the downtown apartment is confirmed for Saturday at 2:00 PM.",
    timestamp: new Date("2024-01-14T11:15:00"),
    type: "success",
    read: true,
  },
  {
    id: "4",
    title: "Document Required",
    message: "Please upload your pre-approval letter to complete your profile.",
    timestamp: new Date("2024-01-13T14:20:00"),
    type: "warning",
    read: true,
  },
];

export const mockUserSettings: UserSettings = {
  name: "John Smith",
  email: "john.smith@email.com",
  phone: "(555) 123-4567",
  preferences: {
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    priceAlerts: true,
  },
  searchPreferences: {
    minPrice: 300000,
    maxPrice: 800000,
    propertyTypes: ["apartment", "condo"],
    locations: ["Seattle, WA", "Bellevue, WA"],
  },
};

export const leads = [
  {
    id: "1",
    name: "Jennifer Martinez",
    email: "jennifer.martinez@email.com",
    phone: "(555) 123-4567",
    source: "website",
    status: "new",
    interestedIn: "buying",
    budget: 450000,
    preferredLocation: "Downtown",
    notes: "Looking for 2-3 bedroom condo, first-time buyer",
    createdAt: new Date("2024-01-22"),
    nextFollowUp: new Date("2024-01-25"),
  },
  {
    id: "2",
    name: "David Thompson",
    email: "david.thompson@email.com",
    phone: "(555) 987-6543",
    source: "referral",
    status: "qualified",
    interestedIn: "selling",
    budget: 0,
    preferredLocation: "Suburbs",
    notes: "Wants to sell family home, moving to another state",
    createdAt: new Date("2024-01-20"),
    lastContact: new Date("2024-01-21"),
    nextFollowUp: new Date("2024-01-24"),
  },
  {
    id: "3",
    name: "Lisa Chen",
    email: "lisa.chen@email.com",
    phone: "(555) 456-7890",
    source: "social",
    status: "nurturing",
    interestedIn: "buying",
    budget: 750000,
    preferredLocation: "Waterfront",
    notes: "High-end buyer, looking for luxury properties",
    createdAt: new Date("2024-01-18"),
    lastContact: new Date("2024-01-22"),
    nextFollowUp: new Date("2024-01-26"),
  },
  {
    id: "4",
    name: "Robert Wilson",
    email: "robert.wilson@email.com",
    phone: "(555) 321-0987",
    source: "advertising",
    status: "contacted",
    interestedIn: "investing",
    budget: 300000,
    preferredLocation: "Various",
    notes: "Looking for rental properties, cash buyer",
    createdAt: new Date("2024-01-15"),
    lastContact: new Date("2024-01-19"),
    nextFollowUp: new Date("2024-01-23"),
  },
];
