import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "./store";
import { User } from "../../types";

interface AuthState {
  token: string | null;
  user: Partial<User>;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: sessionStorage.getItem('token') ?? null,
  user: {
    Name: sessionStorage.getItem('name') ?? "John",
    Email: "",
    Password: "",
    CreatedAt: "",
    UpdatedAt: "",
    id: sessionStorage.getItem('id') ?? undefined, 
    RoleName: 'Editor',
  },
  loading: false,
  error: null,
};

const url = `${import.meta.env.VITE_API_URL}/auth/`;

// Async Thunk for Login
export const login = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; password: string }, thunkAPI) => {
    try {
      const response = await axios.post<{ token: string; user: User }>(url + "login", {
        Email: credentials.email,
        Password: credentials.password,
      });
      return response.data;
    } catch (error: unknown) { 
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data.message || "Login failed");
      }
      return thunkAPI.rejectWithValue("Login failed");
    }
  }
);


export const register = createAsyncThunk(
  "auth/register",
  async (newUser: { Name: string; Email: string; Password: string; RoleName: string }, thunkAPI) => {
    try {
      const response = await axios.post(url + "register", {
        UserName: newUser.Name,
        Email: newUser.Email,
        Password: newUser.Password,
        RoleName: "Editor",
      });
      return response.data;
    } catch (error: unknown) { 
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data || "Registration failed");
      }
      return thunkAPI.rejectWithValue("Registration failed");
    }
  }
);



export const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async (credential: string, thunkAPI) => {
    try {
      const response = await axios.post<{ token: string; user: User }>(`${url}google-login`, {
        credential
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data.message || "Google login failed");
      }
      return thunkAPI.rejectWithValue("Google login failed");
    }
  }
);


export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (
    { currentPassword, newPassword }: { currentPassword: string; newPassword: string },
    thunkAPI
  ) => {
    try {
      const response = await axios.post(`${url}change-password`, {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        return thunkAPI.rejectWithValue(error.response.data.message || "Failed to change password");
      }
      return thunkAPI.rejectWithValue("Failed to change password");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = sessionStorage.getItem('token') ?? null;
      state.user = { Name: sessionStorage.getItem('name') ?? "John", Email: "", Password: "", CreatedAt: "", UpdatedAt: "", id: '0', RoleName: 'Editor' };
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;

        if (action.payload) {
          // אם השגיאה כוללת מידע
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const errorPayload = action.payload as any;  // אם השגיאה מכילה מידע, כמו תשובת ה־HTTP
          const status = errorPayload.response?.status;

          if (status === 401) {
            state.error = "user does'nt exist, check mail and password"; // טיפול בשגיאת 401
          } else {
            state.error = "connecting error, please try again"; // טיפול בשגיאות אחרות
          }
        } else {
          state.error = "oops sorry, try later"; // במקרה של שגיאה כלשהי ללא סטטוס ספציפי
        }
      })


      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action: PayloadAction<{ token: string; user: User }>) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        sessionStorage.setItem("token", action.payload.token);
        sessionStorage.setItem("name", action.payload.user.Name);
        sessionStorage.setItem("id", action.payload.user.id || "0");
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Google login failed";
      })



      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action: PayloadAction<{ token: string, user: User }>) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Registration failed";
      })
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Failed to change password";
      });

  },
});

export const { logout } = authSlice.actions;
export const selectAuth = (state: RootState) => state.user;
export default authSlice.reducer;
