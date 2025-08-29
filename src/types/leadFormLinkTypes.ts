// Types
export interface FormLink {
  _id: string;
  formId: {
    _id: string;
    name: string;
    description: string;
  };
  realtorId: string;
  linkId: string;
  tag?: string;
  shareableUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface GenerateFormLinkRequest {
  formId?: string;
  tag?: string;
}

export interface FormLinksState {
  links: FormLink[];
  isLoading: boolean;
  error: string | null;
  isGenerating: boolean;
  isDeleting: string | null; // ID of the link being deleted
}
