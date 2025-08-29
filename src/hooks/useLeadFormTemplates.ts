import { useState, useEffect, useCallback } from 'react';
import leadFormTemplateService, { LeadFormTemplate, FormLink } from '../services/leadFormTemplateService';

interface UseLeadFormTemplatesReturn {
  templates: LeadFormTemplate[];
  formLinks: FormLink[];
  loading: boolean;
  error: string | null;
  
  // Template operations
  createTemplate: (template: Omit<LeadFormTemplate, '_id' | 'createdAt' | 'updatedAt'>) => Promise<LeadFormTemplate>;
  updateTemplate: (id: string, template: Partial<LeadFormTemplate>) => Promise<LeadFormTemplate>;
  deleteTemplate: (id: string) => Promise<void>;
  cloneTemplate: (templateId: string, newName: string) => Promise<LeadFormTemplate>;
  
  // Form link operations
  generateFormLink: (formId: string, tag?: string) => Promise<FormLink>;
  deleteFormLink: (id: string) => Promise<void>;
  
  // Utility functions
  refreshTemplates: () => Promise<void>;
  refreshFormLinks: () => Promise<void>;
  clearError: () => void;
}

export const useLeadFormTemplates = (): UseLeadFormTemplatesReturn => {
  const [templates, setTemplates] = useState<LeadFormTemplate[]>([]);
  const [formLinks, setFormLinks] = useState<FormLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const refreshTemplates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedTemplates = await leadFormTemplateService.getTemplates();
      setTemplates(fetchedTemplates);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch templates';
      setError(errorMessage);
      console.error('Error fetching templates:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshFormLinks = useCallback(async () => {
    try {
      setError(null);
      const fetchedLinks = await leadFormTemplateService.getFormLinks();
      setFormLinks(fetchedLinks);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch form links';
      setError(errorMessage);
      console.error('Error fetching form links:', err);
    }
  }, []);

  const createTemplate = useCallback(async (template: Omit<LeadFormTemplate, '_id' | 'createdAt' | 'updatedAt'>): Promise<LeadFormTemplate> => {
    try {
      setError(null);
      const newTemplate = await leadFormTemplateService.createTemplate(template);
      setTemplates(prev => [newTemplate, ...prev]);
      return newTemplate;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create template';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const updateTemplate = useCallback(async (id: string, template: Partial<LeadFormTemplate>): Promise<LeadFormTemplate> => {
    try {
      setError(null);
      const updatedTemplate = await leadFormTemplateService.updateTemplate(id, template);
      setTemplates(prev => prev.map(t => t._id === id ? updatedTemplate : t));
      return updatedTemplate;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update template';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const deleteTemplate = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);
      await leadFormTemplateService.deleteTemplate(id);
      setTemplates(prev => prev.filter(t => t._id !== id));
      // Also remove associated form links
      setFormLinks(prev => prev.filter(link => link.formId !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete template';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const cloneTemplate = useCallback(async (templateId: string, newName: string): Promise<LeadFormTemplate> => {
    try {
      setError(null);
      const clonedTemplate = await leadFormTemplateService.cloneTemplate(templateId, newName);
      setTemplates(prev => [clonedTemplate, ...prev]);
      return clonedTemplate;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to clone template';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const generateFormLink = useCallback(async (formId: string, tag?: string): Promise<FormLink> => {
    try {
      setError(null);
      const newLink = await leadFormTemplateService.generateFormLink(formId, tag);
      setFormLinks(prev => [newLink, ...prev]);
      return newLink;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate form link';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const deleteFormLink = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null);
      await leadFormTemplateService.deleteFormLink(id);
      setFormLinks(prev => prev.filter(link => link._id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete form link';
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Load templates and form links on mount
  useEffect(() => {
    refreshTemplates();
    refreshFormLinks();
  }, [refreshTemplates, refreshFormLinks]);

  return {
    templates,
    formLinks,
    loading,
    error,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    cloneTemplate,
    generateFormLink,
    deleteFormLink,
    refreshTemplates,
    refreshFormLinks,
    clearError,
  };
};
