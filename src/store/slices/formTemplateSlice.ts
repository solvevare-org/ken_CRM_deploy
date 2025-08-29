import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api, { handleApiError } from "../../utils/api";

// API base URL
const API_BASE_URL = "/api/lead-form"; 

// Types
export interface FormField {
  name: string;
  label: string;
  type: string;
  required: boolean;
  placeholder?: string;
  options?: { label: string; value: string }[];
  validation?: Record<string, any>;
}

export interface FormTemplate {
  _id: string;
  name: string;
  description?: string;
  fields: FormField[];
  workspaceId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface FormTemplateState {
  templates: FormTemplate[];
  isLoading: boolean;
  error: string | null;
  defaultTemplate: FormTemplate | null;
}

// Async Thunks
export const fetchFormTemplates = createAsyncThunk(
  "formTemplate/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_BASE_URL}/templates`);
      return response.data.data as FormTemplate[];
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const getDefaultTemplate = createAsyncThunk(
  "formTemplate/getDefault",
  async (_, { rejectWithValue }) => {
    try {
      // Fetch all templates and find the first one (which should be the default)
      const response = await api.get(`${API_BASE_URL}/templates`);
      const templates = response.data.data as FormTemplate[];
      
      if (templates && templates.length > 0) {
        return templates[0]; // Return the first template as default
      }
      
      throw new Error("No default template found");
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const createFormTemplate = createAsyncThunk(
  "formTemplate/create",
  async (templateData: Omit<FormTemplate, '_id' | 'createdAt' | 'updatedAt' | 'workspaceId' | 'createdBy'>, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_BASE_URL}/templates`, templateData);
      return response.data.data as FormTemplate;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const updateFormTemplate = createAsyncThunk(
  "formTemplate/update",
  async ({ id, templateData }: { id: string; templateData: Partial<FormTemplate> }, { rejectWithValue }) => {
    try {
      const response = await api.put(`${API_BASE_URL}/templates/${id}`, templateData);
      return response.data.data as FormTemplate;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const deleteFormTemplate = createAsyncThunk(
  "formTemplate/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(`${API_BASE_URL}/templates/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Initial state
const initialState: FormTemplateState = {
  templates: [],
  isLoading: false,
  error: null,
  defaultTemplate: null,
};

// Slice
const formTemplateSlice = createSlice({
  name: "formTemplate",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    // Fetch Form Templates
    builder
      .addCase(fetchFormTemplates.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFormTemplates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.templates = action.payload;
      })
      .addCase(fetchFormTemplates.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Get Default Template
    builder
      .addCase(getDefaultTemplate.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getDefaultTemplate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.defaultTemplate = action.payload;
      })
      .addCase(getDefaultTemplate.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create Form Template
    builder
      .addCase(createFormTemplate.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createFormTemplate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.templates.push(action.payload);
      })
      .addCase(createFormTemplate.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Update Form Template
    builder
      .addCase(updateFormTemplate.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateFormTemplate.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.templates.findIndex(t => t._id === action.payload._id);
        if (index !== -1) {
          state.templates[index] = action.payload;
        }
      })
      .addCase(updateFormTemplate.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete Form Template
    builder
      .addCase(deleteFormTemplate.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteFormTemplate.fulfilled, (state, action) => {
        state.isLoading = false;
        state.templates = state.templates.filter(t => t._id !== action.payload);
      })
      .addCase(deleteFormTemplate.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

// Export actions
export const { clearError, resetState } = formTemplateSlice.actions;

// Selectors
export const selectFormTemplates = (state: any) => state.formTemplate.templates;
export const selectDefaultTemplate = (state: any) => state.formTemplate.defaultTemplate;
export const selectFormTemplateLoading = (state: any) => state.formTemplate.isLoading;
export const selectFormTemplateError = (state: any) => state.formTemplate.error;

// Export reducer
export default formTemplateSlice.reducer;
