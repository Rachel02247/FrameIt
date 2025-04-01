// import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
// import axios from "axios";
// import { User } from "../../types"; // Adjust the import path as necessary
// import { RootState } from "./store";

// const url = "http://localhost:5282/users"; // Adjust the URL to your API endpoint

// // Add user
// export const addUser = createAsyncThunk('users/add', async (user: Partial<User>, thunkApi) => {
//   try {
//     const response = await axios.post(url, user);
//     return response.data as User;
//   } catch (error) {
//     return thunkApi.rejectWithValue(error);
//   }
// });

// const userSlice = createSlice({
//   name: 'users',
//   initialState: {
//     list: [] as User[],
//     loading: false,
//     error: null as null | string,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(addUser.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(addUser.fulfilled, (state, action: PayloadAction<User>) => {
//         state.loading = false;
//         state.error = null;
//         // Add the new user to the list after successful addition
//         state.list.push(action.payload);
//       })
//       .addCase(addUser.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.error.message || "Failed to add user";
//       });
//   },
// });

// export const selectUsers = (state: RootState) => state.user;
// export default userSlice.reducer;


import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "./store";
import { User } from "../types";

interface AuthState {
  token: string | null;
  user: Partial<User>;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: sessionStorage.getItem('token') ?? null,
  user: { Name: sessionStorage.getItem('name') ?? "John", Email: "", Password: "", CreatedAt: "", UpdatedAt: "", id: '0', RoleName: 'Editor' },
  loading: false,
  error: null,
};

const url = "http://localhost:5282/auth/";

// Async Thunk for Login
export const login = createAsyncThunk(
  "auth/login",
  async (credentials: { email: string; password: string }, thunkAPI) => {
    try {
      const response = await axios.post<{ token: string; user: User }>(url + "login", {
        Email: credentials.email,
        Password: credentials.password
      });
      console.log(response);
      return response.data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

// Async Thunk for Register
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
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data || "Registration failed");
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
      });
  },
});

export const { logout } = authSlice.actions;
export const selectAuth = (state: RootState) => state.user;
export default authSlice.reducer;
