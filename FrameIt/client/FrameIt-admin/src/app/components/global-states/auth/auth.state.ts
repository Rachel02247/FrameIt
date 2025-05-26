import { AuthState } from "../../../models/authState";



export const initialState: AuthState = {
  loading: false,
  error: null,
  message: null,
  user: null,
  isRegistering: false,
  isLogin: false

};