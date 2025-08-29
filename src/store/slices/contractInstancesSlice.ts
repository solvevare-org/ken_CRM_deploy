import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  ContractInstance,
  ContractInstancesState,
  GenerateContractRequest,
  AutoFillVariable,
} from "../../types/contractTypes";
import api, { handleApiError } from "../../utils/api";

// API base URL
const API_BASE_URL = "/api/contracts";

// Async Thunks
export const fetchContractInstances = createAsyncThunk(
  "contractInstances/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_BASE_URL}/instances`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const generateContract = createAsyncThunk(
  "contractInstances/generate",
  async (data: GenerateContractRequest, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_BASE_URL}/instances/generate`, data);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const updateContractInstance = createAsyncThunk(
  "contractInstances/update",
  async ({ id, updates }: { id: string; updates: Partial<ContractInstance> }, { rejectWithValue }) => {
    try {
      const response = await api.put(`${API_BASE_URL}/instances/${id}`, updates);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const deleteContractInstance = createAsyncThunk(
  "contractInstances/delete",
  async (instanceId: string, { rejectWithValue }) => {
    try {
      await api.delete(`${API_BASE_URL}/instances/${instanceId}`);
      return instanceId;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const getAutoFillVariables = createAsyncThunk(
  "contractInstances/getAutoFillVariables",
  async ({ leadId, clientId }: { leadId: string; clientId?: string }, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_BASE_URL}/auto-fill-variables`, {
        params: { leadId, clientId }
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const signContract = createAsyncThunk(
  "contractInstances/sign",
  async ({ id, signatureData }: { id: string; signatureData: string }, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_BASE_URL}/instances/${id}/sign`, { signatureData });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Initial state
const initialState: ContractInstancesState = {
  instances: [],
  isLoading: false,
  error: null,
  isGenerating: false,
  isUpdating: null,
  currentInstance: null,
};

// Slice
const contractInstancesSlice = createSlice({
  name: "contractInstances",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetState: () => initialState,
    setCurrentInstance: (state, action: PayloadAction<ContractInstance | null>) => {
      state.currentInstance = action.payload;
    },
    clearCurrentInstance: (state) => {
      state.currentInstance = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch Contract Instances
    builder
      .addCase(fetchContractInstances.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchContractInstances.fulfilled,
        (state, action: PayloadAction<ContractInstance[]>) => {
          state.isLoading = false;
          state.instances = action.payload;
        }
      )
      .addCase(fetchContractInstances.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Generate Contract
    builder
      .addCase(generateContract.pending, (state) => {
        state.isGenerating = true;
        state.error = null;
      })
      .addCase(
        generateContract.fulfilled,
        (state, action: PayloadAction<ContractInstance>) => {
          state.isGenerating = false;
          state.instances.unshift(action.payload);
          state.currentInstance = action.payload;
        }
      )
      .addCase(generateContract.rejected, (state, action) => {
        state.isGenerating = false;
        state.error = action.payload as string;
      });

    // Update Contract Instance
    builder
      .addCase(updateContractInstance.pending, (state, action) => {
        state.isUpdating = action.meta.arg.id;
        state.error = null;
      })
      .addCase(
        updateContractInstance.fulfilled,
        (state, action: PayloadAction<ContractInstance>) => {
          state.isUpdating = null;
          const index = state.instances.findIndex(
            (instance) => instance._id === action.payload._id
          );
          if (index !== -1) {
            state.instances[index] = action.payload;
          }
          if (state.currentInstance?._id === action.payload._id) {
            state.currentInstance = action.payload;
          }
        }
      )
      .addCase(updateContractInstance.rejected, (state, action) => {
        state.isUpdating = null;
        state.error = action.payload as string;
      });

    // Delete Contract Instance
    builder
      .addCase(deleteContractInstance.pending, (state) => {
        state.error = null;
      })
      .addCase(
        deleteContractInstance.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.instances = state.instances.filter(
            (instance) => instance._id !== action.payload
          );
          if (state.currentInstance?._id === action.payload) {
            state.currentInstance = null;
          }
        }
      )
      .addCase(deleteContractInstance.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Sign Contract
    builder
      .addCase(signContract.pending, (state) => {
        state.error = null;
      })
      .addCase(
        signContract.fulfilled,
        (state, action: PayloadAction<ContractInstance>) => {
          const index = state.instances.findIndex(
            (instance) => instance._id === action.payload._id
          );
          if (index !== -1) {
            state.instances[index] = action.payload;
          }
          if (state.currentInstance?._id === action.payload._id) {
            state.currentInstance = action.payload;
          }
        }
      )
      .addCase(signContract.rejected, (state, action) => {
        state.error = action.payload as string;
      });

    // Get Auto Fill Variables
    builder
      .addCase(getAutoFillVariables.pending, (state) => {
        state.error = null;
      })
      .addCase(getAutoFillVariables.fulfilled, (state) => {
        // Variables are handled by the component that requested them
      })
      .addCase(getAutoFillVariables.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

// Actions
export const { clearError, resetState, setCurrentInstance, clearCurrentInstance } = contractInstancesSlice.actions;

// Selectors
export const selectContractInstances = (state: { contractInstances: ContractInstancesState }) =>
  state.contractInstances.instances;
export const selectContractInstancesLoading = (state: { contractInstances: ContractInstancesState }) =>
  state.contractInstances.isLoading;
export const selectContractInstancesError = (state: { contractInstances: ContractInstancesState }) =>
  state.contractInstances.error;
export const selectIsGeneratingContract = (state: { contractInstances: ContractInstancesState }) =>
  state.contractInstances.isGenerating;
export const selectUpdatingInstanceId = (state: { contractInstances: ContractInstancesState }) =>
  state.contractInstances.isUpdating;
export const selectCurrentContractInstance = (state: { contractInstances: ContractInstancesState }) =>
  state.contractInstances.currentInstance;

// Helper selectors
export const selectContractInstanceById = (
  state: { contractInstances: ContractInstancesState },
  instanceId: string
) => state.contractInstances.instances.find((instance) => instance._id === instanceId);

export const selectContractInstancesByStatus = (
  state: { contractInstances: ContractInstancesState },
  status: ContractInstance['status']
) => state.contractInstances.instances.filter((instance) => instance.status === status);

export const selectContractInstancesByLead = (
  state: { contractInstances: ContractInstancesState },
  leadId: string
) => state.contractInstances.instances.filter((instance) => instance.leadId === leadId);

export default contractInstancesSlice.reducer;
