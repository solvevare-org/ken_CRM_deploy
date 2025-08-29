// Contract Types
export interface ContractTemplate {
  _id: string;
  name: string;
  description: string;
  elements: ContractElement[];
  isDefault: boolean;
  createdBy: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ContractElement {
  _id?: string;
  id: string;
  type: 'header' | 'text' | 'table' | 'checkbox' | 'radio' | 'date' | 'signature' | 'variable' | 'spacer' | 'image' | 'list';
  content: string;
  properties?: {
    style?: any;
    required?: boolean;
    options?: string[];
    variable?: string;
    title?: string;
    description?: string;
    showDate?: boolean;
    showTitle?: boolean;
    placeholder?: string;
    rows?: number;
    columns?: string[];
    tableData?: string[][];
    listType?: 'bullet' | 'numbered';
    listItems?: string[];
    width?: string;
    height?: string;
  };
}

export interface ContractInstance {
  _id: string;
  templateId: string;
  leadId: string;
  clientId: string;
  realtorId: string;
  workspaceId: string;
  contractData: Record<string, any>;
  signatures: ContractSignature[];
  status: 'draft' | 'sent' | 'signed' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface ContractSignature {
  signerId: string;
  signerType: 'client' | 'realtor';
  signedAt: string;
  signatureData: string;
}

export interface GenerateContractRequest {
  templateId: string;
  leadId: string;
  clientId?: string;
  autoFill?: boolean;
}

export interface ContractTemplatesState {
  templates: ContractTemplate[];
  isLoading: boolean;
  error: string | null;
  isCreating: boolean;
  isUpdating: string | null;
  isDeleting: string | null;
}

export interface ContractInstancesState {
  instances: ContractInstance[];
  isLoading: boolean;
  error: string | null;
  isGenerating: boolean;
  isUpdating: string | null;
  currentInstance: ContractInstance | null;
}

export interface AutoFillVariable {
  key: string;
  value: string;
  category: 'lead' | 'client' | 'realtor' | 'workspace';
}
