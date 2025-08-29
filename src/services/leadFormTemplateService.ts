import { BASE_URL } from '../config';

export interface LeadFormField {
  _id?: string;
  name: string;
  label: string;
  type: 'input' | 'number' | 'email' | 'checkbox' | 'radio' | 'select' | 'textarea';
  required: boolean;
  options?: { label: string; value: string }[];
  placeholder?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
  defaultValue?: any;
}

export interface LeadFormTemplate {
  _id?: string;
  name: string;
  description?: string;
  fields: LeadFormField[];
  workspaceId?: string;
  createdBy?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface FormLink {
  _id?: string;
  formId: string;
  realtorId: string;
  tag?: string;
  linkId: string;
  shareableUrl: string;
  createdAt?: string;
  updatedAt?: string;
  formId_populated?: {
    name: string;
    description?: string;
  };
}

class LeadFormTemplateService {
  private getHeaders() {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Template Management
  async createTemplate(template: Omit<LeadFormTemplate, '_id' | 'createdAt' | 'updatedAt'>): Promise<LeadFormTemplate> {
    const response = await fetch(`${BASE_URL}/api/lead-form/templates`, {
      method: 'POST',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify(template),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create template');
    }

    const result = await response.json();
    return result.data;
  }

  async getTemplates(): Promise<LeadFormTemplate[]> {
    const response = await fetch(`${BASE_URL}/api/lead-form/templates`, {
      method: 'GET',
      headers: this.getHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch templates');
    }

    const result = await response.json();
    return result.data;
  }

  async getTemplate(id: string): Promise<LeadFormTemplate> {
    const response = await fetch(`${BASE_URL}/api/lead-form/templates/${id}`, {
      method: 'GET',
      headers: this.getHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch template');
    }

    const result = await response.json();
    return result.data;
  }

  async updateTemplate(id: string, template: Partial<LeadFormTemplate>): Promise<LeadFormTemplate> {
    const response = await fetch(`${BASE_URL}/api/lead-form/templates/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify(template),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to update template');
    }

    const result = await response.json();
    return result.data;
  }

  async deleteTemplate(id: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/api/lead-form/templates/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete template');
    }
  }

  // Form Link Management
  async generateFormLink(formId: string, tag?: string): Promise<FormLink> {
    const response = await fetch(`${BASE_URL}/api/lead-form/links`, {
      method: 'POST',
      headers: this.getHeaders(),
      credentials: 'include',
      body: JSON.stringify({ formId, tag }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to generate form link');
    }

    const result = await response.json();
    return result.data;
  }

  async getFormLinks(): Promise<FormLink[]> {
    const response = await fetch(`${BASE_URL}/api/lead-form/links`, {
      method: 'GET',
      headers: this.getHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch form links');
    }

    const result = await response.json();
    return result.data;
  }

  async deleteFormLink(id: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/api/lead-form/links/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete form link');
    }
  }

  // Utility Methods
  async cloneTemplate(templateId: string, newName: string): Promise<LeadFormTemplate> {
    const originalTemplate = await this.getTemplate(templateId);
    const clonedTemplate = {
      name: newName,
      description: originalTemplate.description ? `Copy of ${originalTemplate.description}` : `Copy of ${originalTemplate.name}`,
      fields: originalTemplate.fields.map(field => ({
        ...field,
        _id: undefined, // Remove _id to create new field
      })),
    };
    
    return this.createTemplate(clonedTemplate);
  }
}

export default new LeadFormTemplateService();
