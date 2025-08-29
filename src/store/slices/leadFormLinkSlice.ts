import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  FormLink,
  FormLinksState,
  GenerateFormLinkRequest,
} from "../../types/leadFormLinkTypes";
import api, { handleApiError } from "../../utils/api";

// API base URL - adjust according to your setup
const API_BASE_URL = "/api/lead-form"; // or your API base URL

// Async Thunks
export const generateFormLink = createAsyncThunk(
  "formLinks/generate",
  async (data: GenerateFormLinkRequest = {}, { rejectWithValue }) => {
    try {
      const response = await api.post(`${API_BASE_URL}/links`, data);
      console.log("link generate", response);
      return response.data.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchFormLinks = createAsyncThunk(
  "formLinks/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_BASE_URL}/links`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const deleteFormLink = createAsyncThunk(
  "formLinks/delete",
  async (linkId: string, { rejectWithValue }) => {
    try {
      await api.delete(`${API_BASE_URL}/links/${linkId}`);
      return linkId;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

// Initial state
const initialState: FormLinksState = {
  links: [],
  isLoading: false,
  error: null,
  isGenerating: false,
  isDeleting: null,
};

// Slice
const formLinksSlice = createSlice({
  name: "formLinks",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    // Generate Form Link
    builder
      .addCase(generateFormLink.pending, (state) => {
        state.isGenerating = true;
        state.error = null;
      })
      .addCase(
        generateFormLink.fulfilled,
        (state, action: PayloadAction<FormLink>) => {
          state.isGenerating = false;
          state.links.unshift(action.payload); // Add to beginning of array
        }
      )
      .addCase(generateFormLink.rejected, (state, action) => {
        state.isGenerating = false;
        state.error = action.payload as string;
      });

    // Fetch Form Links
    builder
      .addCase(fetchFormLinks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchFormLinks.fulfilled,
        (state, action: PayloadAction<FormLink[]>) => {
          state.isLoading = false;
          state.links = action.payload;
        }
      )
      .addCase(fetchFormLinks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete Form Link
    builder
      .addCase(deleteFormLink.pending, (state, action) => {
        state.isDeleting = action.meta.arg;
        state.error = null;
      })
      .addCase(
        deleteFormLink.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.isDeleting = null;
          state.links = state.links.filter(
            (link) => link._id !== action.payload
          );
        }
      )
      .addCase(deleteFormLink.rejected, (state, action) => {
        state.isDeleting = null;
        state.error = action.payload as string;
      });
  },
});

// Actions
export const { clearError, resetState } = formLinksSlice.actions;

// Selectors
export const selectFormLinks = (state: { formLinks: FormLinksState }) =>
  state.formLinks.links;
export const selectFormLinksLoading = (state: { formLinks: FormLinksState }) =>
  state.formLinks.isLoading;
export const selectFormLinksError = (state: { formLinks: FormLinksState }) =>
  state.formLinks.error;
export const selectIsGeneratingLink = (state: { formLinks: FormLinksState }) =>
  state.formLinks.isGenerating;
export const selectDeletingLinkId = (state: { formLinks: FormLinksState }) =>
  state.formLinks.isDeleting;

// Helper selectors
export const selectFormLinkById = (
  state: { formLinks: FormLinksState },
  linkId: string
) => state.formLinks.links.find((link) => link._id === linkId);

export const selectFormLinksByFormId = (
  state: { formLinks: FormLinksState },
  formId: string
) => state.formLinks.links.filter((link) => link.formId._id === formId);

export default formLinksSlice.reducer;
