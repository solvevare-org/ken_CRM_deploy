import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import api, { handleApiError } from '../../utils/api';
import { BookmarkResponse } from '../../types';

interface BookmarkState {
  bookmarkedProperties: Set<string>;
  bookmarks: BookmarkResponse['data']['bookmarks'];
  loading: boolean;
  error: string | null;
  bookmarkLoading: Set<string>;
}

const initialState: BookmarkState = {
  bookmarkedProperties: new Set<string>(),
  bookmarks: [],
  loading: false,
  error: null,
  bookmarkLoading: new Set<string>(),
};

// Async thunks
export const fetchBookmarks = createAsyncThunk(
  'bookmark/fetchBookmarks',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/bookmarks/');
      return response.data as BookmarkResponse;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const addBookmark = createAsyncThunk(
  'bookmark/addBookmark',
  async (propertyId: string, { rejectWithValue }) => {
    try {
      await api.post(`/api/bookmarks/${propertyId}`);
      return propertyId;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

export const removeBookmark = createAsyncThunk(
  'bookmark/removeBookmark',
  async (propertyId: string, { rejectWithValue }) => {
    try {
      await api.delete(`/api/bookmarks/${propertyId}`);
      return propertyId;
    } catch (error) {
      return rejectWithValue(handleApiError(error));
    }
  }
);

const bookmarkSlice = createSlice({
  name: 'bookmark',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setBookmarkLoading: (state, action: PayloadAction<{ propertyId: string; isLoading: boolean }>) => {
      const { propertyId, isLoading } = action.payload;
      const newSet = new Set(state.bookmarkLoading);
      if (isLoading) {
        newSet.add(propertyId);
      } else {
        newSet.delete(propertyId);
      }
      state.bookmarkLoading = newSet;
    },
  },
  extraReducers: (builder) => {
    // Fetch bookmarks
    builder
      .addCase(fetchBookmarks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookmarks.fulfilled, (state, action) => {
        state.loading = false;
        state.bookmarks = action.payload.data.bookmarks;
        state.bookmarkedProperties = new Set(
          action.payload.data.bookmarks.map(b => b.property._id)
        );
      })
      .addCase(fetchBookmarks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Add bookmark
    builder
      .addCase(addBookmark.pending, (state, action) => {
        const propertyId = action.meta.arg;
        const newSet = new Set(state.bookmarkLoading);
        newSet.add(propertyId);
        state.bookmarkLoading = newSet;
      })
      .addCase(addBookmark.fulfilled, (state, action) => {
        const propertyId = action.payload;
        const newBookmarkedSet = new Set(state.bookmarkedProperties);
        newBookmarkedSet.add(propertyId);
        state.bookmarkedProperties = newBookmarkedSet;
        
        const newLoadingSet = new Set(state.bookmarkLoading);
        newLoadingSet.delete(propertyId);
        state.bookmarkLoading = newLoadingSet;
      })
      .addCase(addBookmark.rejected, (state, action) => {
        const propertyId = action.meta.arg;
        const newSet = new Set(state.bookmarkLoading);
        newSet.delete(propertyId);
        state.bookmarkLoading = newSet;
        state.error = action.payload as string;
      });

    // Remove bookmark
    builder
      .addCase(removeBookmark.pending, (state, action) => {
        const propertyId = action.meta.arg;
        const newSet = new Set(state.bookmarkLoading);
        newSet.add(propertyId);
        state.bookmarkLoading = newSet;
      })
      .addCase(removeBookmark.fulfilled, (state, action) => {
        const propertyId = action.payload;
        const newBookmarkedSet = new Set(state.bookmarkedProperties);
        newBookmarkedSet.delete(propertyId);
        state.bookmarkedProperties = newBookmarkedSet;
        
        const newLoadingSet = new Set(state.bookmarkLoading);
        newLoadingSet.delete(propertyId);
        state.bookmarkLoading = newLoadingSet;
      })
      .addCase(removeBookmark.rejected, (state, action) => {
        const propertyId = action.meta.arg;
        const newSet = new Set(state.bookmarkLoading);
        newSet.delete(propertyId);
        state.bookmarkLoading = newSet;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setBookmarkLoading } = bookmarkSlice.actions;

// Selectors
export const selectBookmarkedProperties = (state: { bookmark: BookmarkState }) => 
  state.bookmark.bookmarkedProperties;
export const selectBookmarksLoading = (state: { bookmark: BookmarkState }) => 
  state.bookmark.loading;
export const selectBookmarksError = (state: { bookmark: BookmarkState }) => 
  state.bookmark.error;
export const selectBookmarkLoading = (state: { bookmark: BookmarkState }) => 
  state.bookmark.bookmarkLoading;
export const selectBookmarksData = (state: { bookmark: BookmarkState }) => 
  state.bookmark.bookmarks;

export default bookmarkSlice.reducer;
