import { Client } from ".";

export interface User {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  profile?: string;
}

export interface Realtor {
  _id: string;
  user: User;
  createdAt: string;
  updatedAt: string;
}

export interface Lead {
  _id: string;
  realtorId: string;
  workspaceId: string;

  submittedData: Record<string, any>; // dynamic form data from Map
  tag: "New" | "Hot" | "Long-Term" | "Cold" | "Open House" | "Follow-Up";
  capture_tag?: string;

  createdAt: string;
  updatedAt: string;
}

export interface RealtorState {
  // Realtors data
  realtors: Realtor[];
  realtorsLoading: boolean;
  realtorsError: string | null;

  clients: Client[];
  clientsLoading: boolean;
  clientsError: string | null;

  // Leads data
  leads: Lead[];
  leadsLoading: boolean;
  leadsError: string | null;

  // Tagged leads data
  taggedLeads: Lead[];
  taggedLeadsLoading: boolean;
  taggedLeadsError: string | null;
  currentTag: string | null;

  // Client link generation
  clientLink: string | null;
  clientLinkLoading: boolean;
  clientLinkError: string | null;

  // Delete lead
  deleteLeadLoading: boolean;
  deleteLeadError: string | null;

  // Add lead to campaign
  addToCampaignLoading: boolean;
  addToCampaignError: string | null;

  // Dashboard counts
  leadCount: number;
  clientCount: number;
  propertyCount: number;
  // Timestamp (ms) when counts were last refreshed from the server
  countsLastUpdated?: number | null;
}
