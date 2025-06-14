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
      console.log("Fetching files for user ID:", userId);
      const response = await axios.get(`${API_URL_BASE}/myfiles/${userId}`);
      console.log("Fetched files:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching files by user ID:", error);
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch files");
      }
      return rejectWithValue("Failed to fetch files");
    }
  }
);

export const uploadFiles = createAsyncThunk(
  "files/uploadFiles",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      console.log("Uploading files... on fil slice");
      console.log(formData.keys());
      const response = await axios.post(`${API_URL_BASE}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);
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
      console.log("Fetching download URL for s3Key:", s3Key);
      const response = await axios.get(`${API_URL_BASE}/${s3Key}/download`);
      console.log("Fetched download URL:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching file download URL:", error);
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch file download URL");
      }
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
        console.log("Action payload:", action.payload);
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
      .addCase(uploadFiles.fulfilled, (state, action: PayloadAction<MyFile>) => {
        state.files.push(action.payload);
        state.loading = false;
      })
      .addCase(uploadFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getFileDownloadUrl.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFileDownloadUrl.fulfilled, (state, action) => {
        state.loading = false;

        const s3Key = action.meta.arg;
        const url = action.payload;
        const file = state.files.find((f) => f.s3Key === s3Key);
        if (file && !file.downloadUrl) {
          file.downloadUrl = url;
        }
      })
      .addCase(getFileDownloadUrl.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
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