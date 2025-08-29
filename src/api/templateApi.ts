import { BASE_URL } from '../config';

export interface TemplateField {
  id: string;
  name: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'dropdown' | 'checkbox' | 'date' | 'textarea' | 'radio' | 'select';
  required: boolean;
  options?: string[] | { label: string; value: string }[];
  placeholder?: string;
  validation?: string;
  defaultValue?: any;
}

export interface LeadFormTemplate {
  _id?: string;
  id: string;
  name: string;
  description?: string;
  fields: TemplateField[];
  workspaceId?: string;
  createdBy?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface FormLink {
  _id: string;
  formId: string;
  realtorId: string;
  tag?: string;
  linkId: string;
  shareableUrl: string;
  createdAt: string;
  updatedAt: string;
}

class TemplateAPI {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  // Template CRUD Operations
  async createTemplate(templateData: Omit<LeadFormTemplate, '_id' | 'id' | 'createdAt' | 'updatedAt'>): Promise<LeadFormTemplate> {
    const response = await fetch(`${BASE_URL}/api/lead-form/templates`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(templateData),
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Failed to create template');
    }
    return result.data;
  }

  async getTemplates(): Promise<LeadFormTemplate[]> {
    const response = await fetch(`${BASE_URL}/api/lead-form/templates`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch templates');
    }
    return result.data;
  }

  async getTemplate(id: string): Promise<LeadFormTemplate> {
    const response = await fetch(`${BASE_URL}/api/lead-form/templates/${id}`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch template');
    }
    return result.data;
  }

  async updateTemplate(id: string, templateData: Partial<LeadFormTemplate>): Promise<LeadFormTemplate> {
    const response = await fetch(`${BASE_URL}/api/lead-form/templates/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(templateData),
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Failed to update template');
    }
    return result.data;
  }

  async deleteTemplate(id: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/api/lead-form/templates/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Failed to delete template');
    }
  }

  // Form Link Operations
  async generateFormLink(formId: string, tag?: string): Promise<FormLink> {
    const response = await fetch(`${BASE_URL}/api/lead-form/links`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ formId, tag }),
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Failed to generate form link');
    }
    return result.data;
  }

  async getFormLinks(): Promise<FormLink[]> {
    const response = await fetch(`${BASE_URL}/api/lead-form/links`, {
      method: 'GET',
      headers: this.getAuthHeaders(),
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch form links');
    }
    return result.data;
  }

  async deleteFormLink(id: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/api/lead-form/links/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Failed to delete form link');
    }
  }
}

export const templateAPI = new TemplateAPI();
