import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api, { handleApiError } from "../../utils/api";

// Contract Template Types
export interface ContractElement {
  id: string;
  type: string;
  content: string;
  properties?: any;
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

export interface ContractInstance {
  _id: string;
  templateId: string;
  title: string;
  elements: ContractElement[];
  variables: Record<string, any>;
  clientId?: string;
  leadId?: string;
  workspaceId: string;
  createdBy: string;
  status: string;
  signatures: any[];
  contractDate: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

interface ContractState {
  templates: ContractTemplate[];
  contracts: ContractInstance[];
  selectedTemplate: ContractTemplate | null;
  selectedContract: ContractInstance | null;
  categories: string[];
  isLoading: boolean;
  error: string | null;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: string | null;
  autoFillData: Record<string, any> | null;
}

// API base URL
const API_BASE_URL = "/api/contracts";

// Async Thunks - Templates
export const fetchTemplates = createAsyncThunk(
  "contracts/fetchTemplates",
  async (params: { category?: string } = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.category) queryParams.append('category', params.category);
      
      const response = await api.get(`${API_BASE_URL}/templates?${queryParams}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const createTemplate = createAsyncThunk(
  "contracts/createTemplate",
  async (templateData: { name: string; description: string; category: string; elements: ContractElement[] }, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_BASE_URL}/templates`, templateData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Async Thunks - Contract Instances
export const generateContract = createAsyncThunk(
  "contracts/generate",
  async (contractData: { templateId: string; title?: string; leadId?: string; clientId?: string }, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_BASE_URL}/generate`, contractData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchContracts = createAsyncThunk(
  "contracts/fetchAll",
  async (params: { status?: string; page?: number; limit?: number } = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.status) queryParams.append('status', params.status);
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      
      const response = await api.get(`${API_BASE_URL}?${queryParams}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchContract = createAsyncThunk(
  "contracts/fetchOne",
  async (contractId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_BASE_URL}/${contractId}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const updateContract = createAsyncThunk(
  "contracts/update",
  async ({ id, ...contractData }: { id: string; title?: string; elements?: ContractElement[]; status?: string; notes?: string; clientId?: string; leadId?: string }, { rejectWithValue }) => {
    try {
      const response = await api.put(`${API_BASE_URL}/${id}`, contractData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const deleteContract = createAsyncThunk(
  "contracts/delete",
  async (contractId: string, { rejectWithValue }) => {
    try {
      await api.delete(`${API_BASE_URL}/${contractId}`);
      return contractId;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const getAutoFillPreview = createAsyncThunk(
  "contracts/autoFillPreview",
  async (params: { leadId?: string; clientId?: string }, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.leadId) queryParams.append('leadId', params.leadId);
      if (params.clientId) queryParams.append('clientId', params.clientId);
      
      const response = await api.get(`${API_BASE_URL}/auto-fill-preview?${queryParams}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Initial state
const initialState: ContractState = {
  templates: [],
  contracts: [],
  selectedTemplate: null,
  selectedContract: null,
  categories: [],
  isLoading: false,
  error: null,
  isCreating: false,
  isUpdating: false,
  isDeleting: null,
  autoFillData: null,
};

// Slice
const contractSlice = createSlice({
  name: "contracts",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setSelectedTemplate: (state, action: PayloadAction<ContractTemplate | null>) => {
      state.selectedTemplate = action.payload;
    },
    setSelectedContract: (state, action: PayloadAction<ContractInstance | null>) => {
      state.selectedContract = action.payload;
    },
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    // Fetch Templates
    builder
      .addCase(fetchTemplates.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchTemplates.fulfilled,
        (state, action: PayloadAction<ContractTemplate[]>) => {
          state.isLoading = false;
          state.templates = action.payload;
        }
      )
      .addCase(fetchTemplates.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create Template
    builder
      .addCase(createTemplate.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(
        createTemplate.fulfilled,
        (state, action: PayloadAction<ContractTemplate>) => {
          state.isCreating = false;
          state.templates.unshift(action.payload);
        }
      )
      .addCase(createTemplate.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload as string;
      });

    // Generate Contract
    builder
      .addCase(generateContract.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(
        generateContract.fulfilled,
        (state, action: PayloadAction<ContractInstance>) => {
          state.isCreating = false;
          state.contracts.unshift(action.payload);
          state.selectedContract = action.payload;
        }
      )
      .addCase(generateContract.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload as string;
      });

    // Fetch Contracts
    builder
      .addCase(fetchContracts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchContracts.fulfilled,
        (state, action: PayloadAction<{ contracts: ContractInstance[] }>) => {
          state.isLoading = false;
          state.contracts = action.payload.contracts;
        }
      )
      .addCase(fetchContracts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Fetch Contract
    builder
      .addCase(fetchContract.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchContract.fulfilled,
        (state, action: PayloadAction<ContractInstance>) => {
          state.isLoading = false;
          state.selectedContract = action.payload;
        }
      )
      .addCase(fetchContract.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update Contract
    builder
      .addCase(updateContract.pending, (state) => {
        state.isUpdating = true;
        state.error = null;
      })
      .addCase(
        updateContract.fulfilled,
        (state, action: PayloadAction<ContractInstance>) => {
          state.isUpdating = false;
          const index = state.contracts.findIndex(c => c._id === action.payload._id);
          if (index !== -1) {
            state.contracts[index] = action.payload;
          }
          if (state.selectedContract?._id === action.payload._id) {
            state.selectedContract = action.payload;
          }
        }
      )
      .addCase(updateContract.rejected, (state, action) => {
        state.isUpdating = false;
        state.error = action.payload as string;
      });

    // Delete Contract
    builder
      .addCase(deleteContract.pending, (state, action) => {
        state.isDeleting = action.meta.arg;
        state.error = null;
      })
      .addCase(
        deleteContract.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.isDeleting = null;
          state.contracts = state.contracts.filter(c => c._id !== action.payload);
          if (state.selectedContract?._id === action.payload) {
            state.selectedContract = null;
          }
        }
      )
      .addCase(deleteContract.rejected, (state, action) => {
        state.isDeleting = null;
        state.error = action.payload as string;
      });

    // Auto Fill Preview
    builder
      .addCase(getAutoFillPreview.pending, (state) => {
        state.error = null;
      })
      .addCase(
        getAutoFillPreview.fulfilled,
        (state, action: PayloadAction<Record<string, any>>) => {
          state.autoFillData = action.payload;
        }
      )
      .addCase(getAutoFillPreview.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

// Actions
export const { clearError, setSelectedTemplate, setSelectedContract, resetState } = contractSlice.actions;

// Selectors
export const selectContractTemplates = (state: { contracts: ContractState }) => state.contracts.templates;
export const selectContracts = (state: { contracts: ContractState }) => state.contracts.contracts;
export const selectSelectedTemplate = (state: { contracts: ContractState }) => state.contracts.selectedTemplate;
export const selectSelectedContract = (state: { contracts: ContractState }) => state.contracts.selectedContract;
export const selectContractsLoading = (state: { contracts: ContractState }) => state.contracts.isLoading;
export const selectContractsError = (state: { contracts: ContractState }) => state.contracts.error;
export const selectIsCreating = (state: { contracts: ContractState }) => state.contracts.isCreating;
export const selectIsUpdating = (state: { contracts: ContractState }) => state.contracts.isUpdating;
export const selectDeletingId = (state: { contracts: ContractState }) => state.contracts.isDeleting;
export const selectAutoFillData = (state: { contracts: ContractState }) => state.contracts.autoFillData;

export default contractSlice.reducer;
