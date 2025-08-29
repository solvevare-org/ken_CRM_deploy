import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api, { handleApiError } from "../../utils/api";
import {
  ApiResponse,
  CreateWorkspaceData,
  RootState,
  SelectedWorkspaceResponse,
  Workspace,
  WorkspaceAvailability,
  WorkspaceState,
} from "../../types/workspaceTypes";

// Base API URL - adjust according to your backend configuration
const API_BASE_URL = "/api/workspaces";

// Async Thunks

// 1. Get all workspaces for a realtor
export const getWorkspaces = createAsyncThunk<
  ApiResponse<Workspace[]>,
  void,
  { rejectValue: string }
>("workspace/getWorkspaces", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get<ApiResponse<Workspace[]>>(API_BASE_URL);
    console.log(response);
    return response.data;
  } catch (error) {
    console.log(error);
    return rejectWithValue(handleApiError(error));
  }
});

// 2. Get workspace by name
export const getWorkspaceByName = createAsyncThunk<
  ApiResponse<Workspace>,
  string,
  { rejectValue: string }
>(
  "workspace/getWorkspaceByName",
  async (workspaceName: string, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<Workspace>>(
        `${API_BASE_URL}/name`,
        {
          params: { name: workspaceName },
        }
      );
      console.log("getWorkspaceByName", response);
      return response.data;
    } catch (error) {
      console.log("getWorkspaceByName error", error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

// 3. Create new workspace
export const createWorkspace = createAsyncThunk<
  ApiResponse<Workspace>,
  CreateWorkspaceData,
  { rejectValue: string }
>(
  "workspace/createWorkspace",
  async (workspaceData: CreateWorkspaceData, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<Workspace>>(
        API_BASE_URL,
        workspaceData
      );
      console.log("workspaec", response);
      return response.data;
    } catch (error) {
      console.log("workspace erorr", error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

// 4. Check if workspace name exists
export const checkWorkspaceExists = createAsyncThunk<
  ApiResponse<WorkspaceAvailability>,
  string,
  { rejectValue: string }
>(
  "workspace/checkWorkspaceExists",
  async (workspaceName: string, { rejectWithValue }) => {
    try {
      const response = await api.get<ApiResponse<WorkspaceAvailability>>(
        `${API_BASE_URL}/check-exist`,
        {
          params: { name: workspaceName },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// 5. Select workspace and get new JWT
export const selectWorkspace = createAsyncThunk<
  ApiResponse<SelectedWorkspaceResponse>,
  string,
  { rejectValue: string }
>(
  "workspace/selectWorkspace",
  async (workspaceId: string, { rejectWithValue }) => {
    try {
      const response = await api.post<ApiResponse<SelectedWorkspaceResponse>>(
        `${API_BASE_URL}/select`,
        { workspaceId }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Initial state
const initialState: WorkspaceState = {
  workspaces: [],
  currentWorkspace: null,
  selectedWorkspace: null,
  workspaceType: null,
  workspaceAvailability: {
    name: "",
    exists: false,
    available: true,
    message: "",
  },
  loading: {
    getWorkspaces: false,
    getWorkspaceByName: false,
    createWorkspace: false,
    checkWorkspaceExists: false,
    selectWorkspace: false,
  },
  error: {
    getWorkspaces: null,
    getWorkspaceByName: null,
    createWorkspace: null,
    checkWorkspaceExists: null,
    selectWorkspace: null,
  },
};

// Workspace slice
const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    setWorkspaceType: (state, action: PayloadAction<string>) => {
      state.workspaceType = action.payload;
    },
    // Clear errors
    clearError: (
      state,
      action: PayloadAction<{ operation?: keyof WorkspaceState["error"] }>
    ) => {
      const { operation } = action.payload;
      if (operation && state.error[operation]) {
        state.error[operation] = null;
      } else {
        // Clear all errors if no specific operation provided
        Object.keys(state.error).forEach((key) => {
          state.error[key as keyof WorkspaceState["error"]] = null;
        });
      }
    },

    // Clear workspace availability
    clearWorkspaceAvailability: (state) => {
      state.workspaceAvailability = {
        name: "",
        exists: false,
        available: true,
        message: "",
      };
    },

    // Set current workspace (for UI state management)
    setCurrentWorkspace: (state, action: PayloadAction<Workspace | null>) => {
      state.currentWorkspace = action.payload;
    },

    // Clear current workspace
    clearCurrentWorkspace: (state) => {
      state.currentWorkspace = null;
      state.selectedWorkspace = null;
    },

    // Reset workspace state
    resetWorkspaceState: () => {
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    // Get Workspaces
    builder
      .addCase(getWorkspaces.pending, (state) => {
        state.loading.getWorkspaces = true;
        state.error.getWorkspaces = null;
      })
      .addCase(getWorkspaces.fulfilled, (state, action) => {
        state.loading.getWorkspaces = false;
        state.workspaces = action.payload.data || [];
        state.error.getWorkspaces = null;
      })
      .addCase(getWorkspaces.rejected, (state, action) => {
        state.loading.getWorkspaces = false;
        state.error.getWorkspaces =
          action.payload || "Failed to fetch workspaces";
      });

    // Get Workspace By Name
    builder
      .addCase(getWorkspaceByName.pending, (state) => {
        state.loading.getWorkspaceByName = true;
        state.error.getWorkspaceByName = null;
      })
      .addCase(getWorkspaceByName.fulfilled, (state, action) => {
        state.loading.getWorkspaceByName = false;
        state.currentWorkspace = action.payload.data;
        state.error.getWorkspaceByName = null;
      })
      .addCase(getWorkspaceByName.rejected, (state, action) => {
        state.loading.getWorkspaceByName = false;
        state.error.getWorkspaceByName =
          action.payload || "Failed to fetch workspace";
        state.currentWorkspace = null;
      });

    // Create Workspace
    builder
      .addCase(createWorkspace.pending, (state) => {
        state.loading.createWorkspace = true;
        state.error.createWorkspace = null;
      })
      .addCase(createWorkspace.fulfilled, (state, action) => {
        state.loading.createWorkspace = false;
        // Add new workspace to the list
        state.workspaces.push(action.payload.data);
        state.error.createWorkspace = null;
      })
      .addCase(createWorkspace.rejected, (state, action) => {
        state.loading.createWorkspace = false;
        state.error.createWorkspace =
          action.payload || "Failed to create workspace";
      });

    // Check Workspace Exists
    builder
      .addCase(checkWorkspaceExists.pending, (state) => {
        state.loading.checkWorkspaceExists = true;
        state.error.checkWorkspaceExists = null;
      })
      .addCase(checkWorkspaceExists.fulfilled, (state, action) => {
        state.loading.checkWorkspaceExists = false;
        state.workspaceAvailability = {
          name: action.payload.data.name,
          exists: action.payload.data.exists,
          available: action.payload.data.available,
          message: action.payload.data.message,
        };
        state.error.checkWorkspaceExists = null;
      })
      .addCase(checkWorkspaceExists.rejected, (state, action) => {
        state.loading.checkWorkspaceExists = false;
        state.error.checkWorkspaceExists =
          action.payload || "Failed to check workspace availability";
      });

    // Select Workspace
    builder
      .addCase(selectWorkspace.pending, (state) => {
        state.loading.selectWorkspace = true;
        state.error.selectWorkspace = null;
      })
      .addCase(selectWorkspace.fulfilled, (state, action) => {
        state.loading.selectWorkspace = false;
        state.selectedWorkspace = action.payload.data.workspace;
        // Also set as current workspace for consistency
        const currentWorkspace: Workspace = {
          _id: action.payload.data.workspace.id,
          name: action.payload.data.workspace.name,
          type: "organization", // Default type, you might want to store this info
        };
        state.currentWorkspace = currentWorkspace;
        state.error.selectWorkspace = null;
        
        // The new token is automatically set in HTTP-only cookie by the backend
        // No need to store in localStorage as cookies work across subdomains
      })
      .addCase(selectWorkspace.rejected, (state, action) => {
        state.loading.selectWorkspace = false;
        state.error.selectWorkspace =
          action.payload || "Failed to select workspace";
      });
  },
});

// Export actions
export const {
  setWorkspaceType,
  clearError,
  clearWorkspaceAvailability,
  setCurrentWorkspace,
  clearCurrentWorkspace,
  resetWorkspaceState,
} = workspaceSlice.actions;

// Selectors with proper typing
export const selectWorkspaces = (state: RootState): Workspace[] =>
  state.workspace.workspaces;
export const selectCurrentWorkspace = (state: RootState): Workspace | null =>
  state.workspace.currentWorkspace;
export const selectSelectedWorkspace = (
  state: RootState
): SelectedWorkspaceResponse["workspace"] | null =>
  state.workspace.selectedWorkspace;
export const selectWorkspaceAvailability = (
  state: RootState
): WorkspaceAvailability => state.workspace.workspaceAvailability;
export const selectWorkspaceLoading = (
  state: RootState
): WorkspaceState["loading"] => state.workspace.loading;
export const selectWorkspaceError = (
  state: RootState
): WorkspaceState["error"] => state.workspace.error;

// Specific loading selectors
export const selectIsLoadingWorkspaces = (state: RootState): boolean =>
  state.workspace.loading.getWorkspaces;
export const selectIsLoadingWorkspaceByName = (state: RootState): boolean =>
  state.workspace.loading.getWorkspaceByName;
export const selectIsCreatingWorkspace = (state: RootState): boolean =>
  state.workspace.loading.createWorkspace;
export const selectIsCheckingWorkspace = (state: RootState): boolean =>
  state.workspace.loading.checkWorkspaceExists;
export const selectIsSelectingWorkspace = (state: RootState): boolean =>
  state.workspace.loading.selectWorkspace;

// Specific error selectors
export const selectWorkspacesError = (state: RootState): string | null =>
  state.workspace.error.getWorkspaces;
export const selectWorkspaceByNameError = (state: RootState): string | null =>
  state.workspace.error.getWorkspaceByName;
export const selectCreateWorkspaceError = (state: RootState): string | null =>
  state.workspace.error.createWorkspace;
export const selectCheckWorkspaceError = (state: RootState): string | null =>
  state.workspace.error.checkWorkspaceExists;
export const selectSelectWorkspaceError = (state: RootState): string | null =>
  state.workspace.error.selectWorkspace;

// Export reducer
export default workspaceSlice.reducer;
