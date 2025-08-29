import api from '../utils/api';

export interface ContractElement {
  id: string;
  type: 'header' | 'text' | 'table' | 'checkbox' | 'radio' | 'date' | 'signature' | 'variable' | 'spacer' | 'image' | 'list' | 'divider' | 'price' | 'address' | 'terms';
  content: string;
  properties?: {
    style?: any;
    required?: boolean;
    options?: string[];
    variable?: string;
    title?: string;
    description?: string;
    placeholder?: string;
    rows?: number;
    columns?: string[];
    tableData?: string[][];
    listType?: 'bullet' | 'numbered';
    listItems?: string[];
    width?: string;
    height?: string;
    currency?: string;
    format?: string;
    validation?: string;
    defaultValue?: string;
  };
}

export interface ContractTemplate {
  _id: string;
  name: string;
  description: string;
  category: string;
  elements: ContractElement[];
  workspaceId: string;
  createdBy: string;
  isDefault: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  propertyAddress?: string;
}

export interface Realtor {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
}

// Contract Template APIs
export const contractBuilderAPI = {
  // Templates
  createTemplate: async (templateData: {
    name: string;
    description?: string;
    category?: string;
    elements: ContractElement[];
  }): Promise<ContractTemplate> => {
    const response = await api.post('/contracts/templates', templateData);
    return response.data.data;
  },

  getTemplates: async (): Promise<ContractTemplate[]> => {
    const response = await api.get('/contracts/templates');
    return response.data.data;
  },

  getTemplate: async (id: string): Promise<ContractTemplate> => {
    const response = await api.get(`/contracts/templates/${id}`);
    return response.data.data;
  },

  updateTemplate: async (id: string, templateData: Partial<ContractTemplate>): Promise<ContractTemplate> => {
    const response = await api.put(`/contracts/templates/${id}`, templateData);
    return response.data.data;
  },

  deleteTemplate: async (id: string): Promise<void> => {
    await api.delete(`/contracts/templates/${id}`);
  },

  // Clients
  getClients: async (): Promise<Client[]> => {
    const response = await api.get('/realtor/clients');
    return response.data.data;
  },

  // Realtors
  getRealtors: async (): Promise<Realtor[]> => {
    const response = await api.get('/realtor/realtors');
    return response.data.data;
  },

  // Contract Instance
  generateContract: async (data: {
    templateId: string;
    clientId: string;
    realtorId: string;
    customData?: Record<string, any>;
  }) => {
    const response = await api.post('/contracts/generate', data);
    return response.data.data;
  }
};

export default contractBuilderAPI;
