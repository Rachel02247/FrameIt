import { AuthUser } from "./authUser";

export interface AuthState {
  loading: boolean;
  error: string | null;
  message: string | null;
  user: AuthUser | null;
  isRegistering?: boolean;
  isLogin?: boolean;
}