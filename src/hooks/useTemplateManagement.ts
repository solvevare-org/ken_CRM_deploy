import { useState, useEffect } from 'react';
import { templateAPI, LeadFormTemplate, FormLink, TemplateField } from '../api/templateApi';

export const useTemplateManagement = () => {
  const [templates, setTemplates] = useState<LeadFormTemplate[]>([]);
  const [formLinks, setFormLinks] = useState<FormLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load templates
  const loadTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await templateAPI.getTemplates();
      setTemplates(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  // Load form links
  const loadFormLinks = async () => {
    try {
      const data = await templateAPI.getFormLinks();
      setFormLinks(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load form links');
    }
  };

  // Create template
  const createTemplate = async (templateData: {
    name: string;
    description?: string;
    fields: TemplateField[];
  }): Promise<LeadFormTemplate> => {
    try {
      setLoading(true);
      setError(null);
      const newTemplate = await templateAPI.createTemplate(templateData);
      setTemplates(prev => [...prev, newTemplate]);
      return newTemplate;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create template';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Update template
  const updateTemplate = async (id: string, templateData: Partial<LeadFormTemplate>): Promise<LeadFormTemplate> => {
    try {
      setLoading(true);
      setError(null);
      const updatedTemplate = await templateAPI.updateTemplate(id, templateData);
      setTemplates(prev => prev.map(t => t._id === id ? updatedTemplate : t));
      return updatedTemplate;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update template';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Delete template
  const deleteTemplate = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      await templateAPI.deleteTemplate(id);
      setTemplates(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete template';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Generate form link
  const generateFormLink = async (formId: string, tag?: string): Promise<FormLink> => {
    try {
      setError(null);
      const newLink = await templateAPI.generateFormLink(formId, tag);
      setFormLinks(prev => [...prev, newLink]);
      return newLink;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate form link';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Delete form link
  const deleteFormLink = async (id: string): Promise<void> => {
    try {
      setError(null);
      await templateAPI.deleteFormLink(id);
      setFormLinks(prev => prev.filter(l => l._id !== id));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete form link';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  // Load data on mount
  useEffect(() => {
    loadTemplates();
    loadFormLinks();
  }, []);

  return {
    templates,
    formLinks,
    loading,
    error,
    loadTemplates,
    loadFormLinks,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    generateFormLink,
    deleteFormLink,
  };
};
