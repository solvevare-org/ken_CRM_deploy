import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api, { handleApiError } from "../../utils/api";
import { Lead, Realtor, RealtorState } from "../../types/realtorTypes";

// API base URL - adjust according to your setup
const API_BASE_URL = "/api/realtor"; // or your API base URL

// Async Thunks
export const fetchRealtors = createAsyncThunk(
  "realtor/fetchRealtors",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/realtors");
      return response.data.data as Realtor[];
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchRealtorLeads = createAsyncThunk(
  "realtor/fetchRealtorLeads",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_BASE_URL}/leads`);
      return response.data.data as Lead[];
    } catch (error) {
      console.log(error);
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const fetchLeadsByTag = createAsyncThunk(
  "realtor/fetchLeadsByTag",
  async (tag: string, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `${API_BASE_URL}/leads/tag?tag=${encodeURIComponent(tag)}`
      );
      return { leads: response.data.data as Lead[], tag };
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const generateClientLink = createAsyncThunk(
  "realtor/generateClientLink",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_BASE_URL}/generate-link`);
      return response.data.data as string;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const deleteLead = createAsyncThunk(
  "realtor/deleteLead",
  async (leadId: string, { rejectWithValue }) => {
    try {
      await api.delete(`/leads/${leadId}`);
      return leadId;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const addLeadToCampaign = createAsyncThunk(
  "realtor/addLeadToCampaign",
  async (
    { leadId, tag }: { leadId: string; tag: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.patch(`/leads/${leadId}/${tag}`);
      return { leadId, tag, updatedLead: response.data.data as Lead };
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

const initialState: RealtorState = {
  realtors: [],
  realtorsLoading: false,
  realtorsError: null,

  leads: [],
  leadsLoading: false,
  leadsError: null,

  taggedLeads: [],
  taggedLeadsLoading: false,
  taggedLeadsError: null,
  currentTag: null,

  clientLink: null,
  clientLinkLoading: false,
  clientLinkError: null,

  deleteLeadLoading: false,
  deleteLeadError: null,

  addToCampaignLoading: false,
  addToCampaignError: null,
};

// Slice
const realtorSlice = createSlice({
  name: "realtor",
  initialState,
  reducers: {
    // Clear errors
    clearRealtorsError: (state) => {
      state.realtorsError = null;
    },
    clearLeadsError: (state) => {
      state.leadsError = null;
    },
    clearTaggedLeadsError: (state) => {
      state.taggedLeadsError = null;
    },
    clearClientLinkError: (state) => {
      state.clientLinkError = null;
    },
    clearDeleteLeadError: (state) => {
      state.deleteLeadError = null;
    },
    clearAddToCampaignError: (state) => {
      state.addToCampaignError = null;
    },

    // Clear data
    clearLeads: (state) => {
      state.leads = [];
      state.leadsError = null;
    },
    clearTaggedLeads: (state) => {
      state.taggedLeads = [];
      state.taggedLeadsError = null;
      state.currentTag = null;
    },
    clearClientLink: (state) => {
      state.clientLink = null;
      state.clientLinkError = null;
    },

    // Reset all state
    resetRealtorState: () => initialState,
  },
  extraReducers: (builder) => {
    // Fetch Realtors
    builder
      .addCase(fetchRealtors.pending, (state) => {
        state.realtorsLoading = true;
        state.realtorsError = null;
      })
      .addCase(
        fetchRealtors.fulfilled,
        (state, action: PayloadAction<Realtor[]>) => {
          state.realtorsLoading = false;
          state.realtors = action.payload;
          state.realtorsError = null;
        }
      )
      .addCase(fetchRealtors.rejected, (state, action) => {
        state.realtorsLoading = false;
        state.realtorsError = action.payload as string;
      });

    // Fetch Realtor Leads
    builder
      .addCase(fetchRealtorLeads.pending, (state) => {
        state.leadsLoading = true;
        state.leadsError = null;
      })
      .addCase(
        fetchRealtorLeads.fulfilled,
        (state, action: PayloadAction<Lead[]>) => {
          state.leadsLoading = false;
          state.leads = action.payload;
          state.leadsError = null;
        }
      )
      .addCase(fetchRealtorLeads.rejected, (state, action) => {
        state.leadsLoading = false;
        state.leadsError = action.payload as string;
      });

    // Fetch Leads by Tag
    builder
      .addCase(fetchLeadsByTag.pending, (state) => {
        state.taggedLeadsLoading = true;
        state.taggedLeadsError = null;
      })
      .addCase(
        fetchLeadsByTag.fulfilled,
        (state, action: PayloadAction<{ leads: Lead[]; tag: string }>) => {
          state.taggedLeadsLoading = false;
          state.taggedLeads = action.payload.leads;
          state.currentTag = action.payload.tag;
          state.taggedLeadsError = null;
        }
      )
      .addCase(fetchLeadsByTag.rejected, (state, action) => {
        state.taggedLeadsLoading = false;
        state.taggedLeadsError = action.payload as string;
      });

    // Generate Client Link
    builder
      .addCase(generateClientLink.pending, (state) => {
        state.clientLinkLoading = true;
        state.clientLinkError = null;
      })
      .addCase(
        generateClientLink.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.clientLinkLoading = false;
          state.clientLink = action.payload;
          state.clientLinkError = null;
        }
      )
      .addCase(generateClientLink.rejected, (state, action) => {
        state.clientLinkLoading = false;
        state.clientLinkError = action.payload as string;
      });

    // Delete Lead
    builder
      .addCase(deleteLead.pending, (state) => {
        state.deleteLeadLoading = true;
        state.deleteLeadError = null;
      })
      .addCase(deleteLead.fulfilled, (state, action: PayloadAction<string>) => {
        state.deleteLeadLoading = false;
        state.deleteLeadError = null;

        // Remove the deleted lead from both leads arrays
        const deletedLeadId = action.payload;
        state.leads = state.leads.filter((lead) => lead._id !== deletedLeadId);
        state.taggedLeads = state.taggedLeads.filter(
          (lead) => lead._id !== deletedLeadId
        );
      })
      .addCase(deleteLead.rejected, (state, action) => {
        state.deleteLeadLoading = false;
        state.deleteLeadError = action.payload as string;
      });

    // Add Lead to Campaign
    builder
      .addCase(addLeadToCampaign.pending, (state) => {
        state.addToCampaignLoading = true;
        state.addToCampaignError = null;
      })
      .addCase(
        addLeadToCampaign.fulfilled,
        (
          state,
          action: PayloadAction<{
            leadId: string;
            tag: string;
            updatedLead: Lead;
          }>
        ) => {
          state.addToCampaignLoading = false;
          state.addToCampaignError = null;

          const { leadId, updatedLead } = action.payload;

          // Update the lead in the leads array
          const leadIndex = state.leads.findIndex(
            (lead) => lead._id === leadId
          );
          if (leadIndex !== -1) {
            state.leads[leadIndex] = updatedLead;
          }

          // Update the lead in the tagged leads array if it exists
          const taggedLeadIndex = state.taggedLeads.findIndex(
            (lead) => lead._id === leadId
          );
          if (taggedLeadIndex !== -1) {
            state.taggedLeads[taggedLeadIndex] = updatedLead;
          }
        }
      )
      .addCase(addLeadToCampaign.rejected, (state, action) => {
        state.addToCampaignLoading = false;
        state.addToCampaignError = action.payload as string;
      });
  },
});

// Export actions
export const {
  clearRealtorsError,
  clearLeadsError,
  clearTaggedLeadsError,
  clearClientLinkError,
  clearDeleteLeadError,
  clearAddToCampaignError,
  clearLeads,
  clearTaggedLeads,
  clearClientLink,
  resetRealtorState,
} = realtorSlice.actions;

// Export reducer
export default realtorSlice.reducer;

// Selectors
export const selectRealtors = (state: { realtor: RealtorState }) =>
  state.realtor.realtors;
export const selectRealtorsLoading = (state: { realtor: RealtorState }) =>
  state.realtor.realtorsLoading;
export const selectRealtorsError = (state: { realtor: RealtorState }) =>
  state.realtor.realtorsError;

export const selectLeads = (state: { realtor: RealtorState }) =>
  state.realtor.leads;
export const selectLeadsLoading = (state: { realtor: RealtorState }) =>
  state.realtor.leadsLoading;
export const selectLeadsError = (state: { realtor: RealtorState }) =>
  state.realtor.leadsError;

export const selectTaggedLeads = (state: { realtor: RealtorState }) =>
  state.realtor.taggedLeads;
export const selectTaggedLeadsLoading = (state: { realtor: RealtorState }) =>
  state.realtor.taggedLeadsLoading;
export const selectTaggedLeadsError = (state: { realtor: RealtorState }) =>
  state.realtor.taggedLeadsError;
export const selectCurrentTag = (state: { realtor: RealtorState }) =>
  state.realtor.currentTag;

export const selectClientLink = (state: { realtor: RealtorState }) =>
  state.realtor.clientLink;
export const selectClientLinkLoading = (state: { realtor: RealtorState }) =>
  state.realtor.clientLinkLoading;
export const selectClientLinkError = (state: { realtor: RealtorState }) =>
  state.realtor.clientLinkError;

export const selectDeleteLeadLoading = (state: { realtor: RealtorState }) =>
  state.realtor.deleteLeadLoading;
export const selectDeleteLeadError = (state: { realtor: RealtorState }) =>
  state.realtor.deleteLeadError;

export const selectAddToCampaignLoading = (state: { realtor: RealtorState }) =>
  state.realtor.addToCampaignLoading;
export const selectAddToCampaignError = (state: { realtor: RealtorState }) =>
  state.realtor.addToCampaignError;
