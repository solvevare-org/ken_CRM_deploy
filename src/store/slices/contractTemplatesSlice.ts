import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  ContractTemplate,
  ContractTemplatesState,
} from "../../types/contractTypes";
import api, { handleApiError } from "../../utils/api";

// API base URL
const API_BASE_URL = "/api/contracts";

// Async Thunks
export const fetchContractTemplates = createAsyncThunk(
  "contractTemplates/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_BASE_URL}/templates`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const createContractTemplate = createAsyncThunk(
  "contractTemplates/create",
  async (templateData: Partial<ContractTemplate>, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_BASE_URL}/templates`, templateData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const updateContractTemplate = createAsyncThunk(
  "contractTemplates/update",
  async ({ id, updates }: { id: string; updates: Partial<ContractTemplate> }, { rejectWithValue }) => {
    try {
      const response = await api.put(`${API_BASE_URL}/templates/${id}`, updates);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const deleteContractTemplate = createAsyncThunk(
  "contractTemplates/delete",
  async (templateId: string, { rejectWithValue }) => {
    try {
      await api.delete(`${API_BASE_URL}/templates/${templateId}`);
      return templateId;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Initial state
const initialState: ContractTemplatesState = {
  templates: [],
  isLoading: false,
  error: null,
  isCreating: false,
  isUpdating: null,
  isDeleting: null,
};

// Slice
const contractTemplatesSlice = createSlice({
  name: "contractTemplates",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    // Fetch Contract Templates
    builder
      .addCase(fetchContractTemplates.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchContractTemplates.fulfilled,
        (state, action: PayloadAction<ContractTemplate[]>) => {
          console.log('🔧 fetchContractTemplates.fulfilled payload:', action.payload);
          console.log('🔧 payload type:', typeof action.payload);
          console.log('🔧 is array:', Array.isArray(action.payload));
          state.isLoading = false;
          state.templates = Array.isArray(action.payload) ? action.payload : [];
        }
      )
      .addCase(fetchContractTemplates.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create Contract Template
    builder
      .addCase(createContractTemplate.pending, (state) => {
        state.isCreating = true;
        state.error = null;
      })
      .addCase(
        createContractTemplate.fulfilled,
        (state, action: PayloadAction<ContractTemplate>) => {
          state.isCreating = false;
          state.templates.unshift(action.payload);
        }
      )
      .addCase(createContractTemplate.rejected, (state, action) => {
        state.isCreating = false;
        state.error = action.payload as string;
      });

    // Update Contract Template
    builder
      .addCase(updateContractTemplate.pending, (state, action) => {
        state.isUpdating = action.meta.arg.id;
        state.error = null;
      })
      .addCase(
        updateContractTemplate.fulfilled,
        (state, action: PayloadAction<ContractTemplate>) => {
          state.isUpdating = null;
          const index = state.templates.findIndex(
            (template) => template._id === action.payload._id
          );
          if (index !== -1) {
            state.templates[index] = action.payload;
          }
        }
      )
      .addCase(updateContractTemplate.rejected, (state, action) => {
        state.isUpdating = null;
        state.error = action.payload as string;
      });

    // Delete Contract Template
    builder
      .addCase(deleteContractTemplate.pending, (state, action) => {
        state.isDeleting = action.meta.arg;
        state.error = null;
      })
      .addCase(
        deleteContractTemplate.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.isDeleting = null;
          state.templates = state.templates.filter(
            (template) => template._id !== action.payload
          );
        }
      )
      .addCase(deleteContractTemplate.rejected, (state, action) => {
        state.isDeleting = null;
        state.error = action.payload as string;
      });
  },
});

// Actions
export const { clearError, resetState } = contractTemplatesSlice.actions;

// Selectors
export const selectContractTemplates = (state: { contractTemplates: ContractTemplatesState }) =>
  state.contractTemplates.templates;
export const selectContractTemplatesLoading = (state: { contractTemplates: ContractTemplatesState }) =>
  state.contractTemplates.isLoading;
export const selectContractTemplatesError = (state: { contractTemplates: ContractTemplatesState }) =>
  state.contractTemplates.error;
export const selectIsCreatingTemplate = (state: { contractTemplates: ContractTemplatesState }) =>
  state.contractTemplates.isCreating;
export const selectUpdatingTemplateId = (state: { contractTemplates: ContractTemplatesState }) =>
  state.contractTemplates.isUpdating;
export const selectDeletingTemplateId = (state: { contractTemplates: ContractTemplatesState }) =>
  state.contractTemplates.isDeleting;

// Helper selectors
export const selectContractTemplateById = (
  state: { contractTemplates: ContractTemplatesState },
  templateId: string
) => state.contractTemplates.templates.find((template) => template._id === templateId);

export const selectDefaultContractTemplate = (
  state: { contractTemplates: ContractTemplatesState }
) => state.contractTemplates.templates.find((template) => template.isDefault);

export default contractTemplatesSlice.reducer;
