
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { Tag, MyFile } from '../types';

interface TagState {
  collections: Tag[];
  files: MyFile[];
  selectedTagId: number;
  loading: boolean;
  error: string | null;
}

const initialState: TagState = {
  collections: [],
  files: [],
  selectedTagId: 0,
  loading: false,
  error: null,
};

const API_URL = import.meta.env.VITE_API_URL;

// Async thunks for API calls
export const fetchUserCollections = createAsyncThunk(
  'tags/fetchUserCollections',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/tags/myCollections/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching tags:", error);
      return rejectWithValue('Failed to fetch collections');
    }
  }
);

export const fetchCollectionFiles = createAsyncThunk(
  'tags/fetchCollectionFiles',
  async (tagId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/tags/${tagId}/collection`);
      return response.data;
    } catch (error) {
      console.error('Failed fetching collection:', error);
      return rejectWithValue('Failed to fetch files');
    }
  }
);

export const addFileToCollection = createAsyncThunk(
  'tags/addFileToCollection',
  async ({ fileId, tagId }: { fileId: string, tagId: number }, { rejectWithValue }) => {
    try {
      await axios.put(`${API_URL}/files/${fileId}`, { id: fileId, tagId });
      return { fileId, tagId };
    } catch (error) {
      console.error("Failed to add to collection:", error);
      return rejectWithValue('Failed to add file to collection');
    }
  }
);

const tagSlice = createSlice({
  name: 'tags',
  initialState,
  reducers: {
    setSelectedTag: (state, action: PayloadAction<number>) => {
      state.selectedTagId = action.payload;
    },
    sortFiles: (state, action: PayloadAction<'asc' | 'desc'>) => {
      const sortOrder = action.payload;
      state.files.sort((a, b) => {
        if (sortOrder === 'asc') {
          return a.fileName.localeCompare(b.fileName);
        } else {
          return b.fileName.localeCompare(a.fileName);
        }
      });
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Collections
      .addCase(fetchUserCollections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserCollections.fulfilled, (state, action) => {
        state.collections = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserCollections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Files
      .addCase(fetchCollectionFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCollectionFiles.fulfilled, (state, action) => {
        state.files = action.payload;
        state.loading = false;
      })
      .addCase(fetchCollectionFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setSelectedTag, sortFiles } = tagSlice.actions;
export default tagSlice.reducer;
