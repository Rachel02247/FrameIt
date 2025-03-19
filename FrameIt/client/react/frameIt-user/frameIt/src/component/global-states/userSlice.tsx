import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { User } from "../../types"; // Adjust the import path as necessary
import { RootState } from "./store";

const url = "http://localhost:5282/users"; // Adjust the URL to your API endpoint

// Add user
export const addUser = createAsyncThunk('users/add', async (user: Partial<User>, thunkApi) => {
  try {
    const response = await axios.post(url, user);
    return response.data as User;
  } catch (error) {
    return thunkApi.rejectWithValue(error);
  }
});

const userSlice = createSlice({
  name: 'users',
  initialState: {
    list: [] as User[],
    loading: false,
    error: null as null | string,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.error = null;
        // Add the new user to the list after successful addition
        state.list.push(action.payload);
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to add user";
      });
  },
});

export const selectUsers = (state: RootState) => state.user;
export default userSlice.reducer;
