import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "./store";
import { MyFile } from "../../types";

interface FileState {
  files: MyFile[];
  loading: boolean;
  error: string | null;
}

const initialState: FileState = {
  files: [],
  loading: false,
  error: null,
};

const API_URL_BASE = `${import.meta.env.VITE_API_URL}/files`;

// Async Thunks
export const fetchFilesByUserId = createAsyncThunk(
  "files/fetchFilesByUserId",
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL_BASE}/myfiles/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching files by user ID:", error);
      return rejectWithValue("Failed to fetch files");
    }
  }
);

export const uploadFiles = createAsyncThunk(
  "files/uploadFiles",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL_BASE}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error uploading files:", error);
      return rejectWithValue("Failed to upload files");
    }
  }
);

export const getFileDownloadUrl = createAsyncThunk(
  "files/getFileDownloadUrl",
  async (s3Key: string, { rejectWithValue }) => {
    try {
      console.log("bfor gtFileDownloadUrl");
      console.log("s3Key", s3Key);
      
      const response = await axios.get(`${API_URL_BASE}/${s3Key}/download`);
      console.log("in getFileDownloadUrl");
      console.log(response.data);
      
      return response.data;
    } catch (error) {
      console.error("Error fetching file download URL:", error);
      return rejectWithValue("Failed to fetch file download URL");
    }
  }
);

export const deleteFile = createAsyncThunk(
  "files/deleteFile",
  async (fileId: string, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL_BASE}/${fileId}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting file:", error);
      return rejectWithValue("Failed to delete file");
    }
  }
);

const fileSlice = createSlice({
  name: "files",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Files
      .addCase(fetchFilesByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilesByUserId.fulfilled, (state, action: PayloadAction<MyFile[]>) => {
        state.files = action.payload;
        state.loading = false;
      })
      .addCase(fetchFilesByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Upload Files
      .addCase(uploadFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadFiles.fulfilled, (state, action: PayloadAction<MyFile[]>) => {
        state.files.push(...action.payload);
        state.loading = false;
      })
      .addCase(uploadFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Get File Download URL
      .addCase(getFileDownloadUrl.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFileDownloadUrl.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(getFileDownloadUrl.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Delete File
      .addCase(deleteFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFile.fulfilled, (state, action: PayloadAction<string>) => {
        state.files = state.files.filter((file) => file.id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const selectFiles = (state: RootState) => state.files.files;
export default fileSlice.reducer;