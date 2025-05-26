import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.action';
import { User } from '../../../models/user';

export interface AuthState {
  loading: boolean;
  error: string | null;
  message: string | null;
  user: User | null;
  isRegistering?: boolean;
}

export const initialState: AuthState = {
  loading: false,
  error: null,
  message: null,
  user: null,
  isRegistering: false,

};

export const authReducer = createReducer(
  initialState,

  on(AuthActions.requestLogin, (state) => ({
    ...state,
    loading: true,
    error: null,
    message: null,

  })),

  on(AuthActions.requestRegister, (state) => ({
    ...state,
    loading: true,
    error: null,
    message: null,
    isRegistering: true,

  })),

  on(AuthActions.loginSuccess, (state, { user }) => ({
    ...state,
    loading: false,
    user,
    error: null,
    message: null,
  })),

  on(AuthActions.registerRequestSent, (state, { message }) => ({
    ...state,
    loading: false,
    message,
    error: null,
  })),

  on(AuthActions.authRequestFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  
  on(AuthActions.logout, (state, { message }) => ({
    ...state,
    loading: false,
    message: message || 'Logout successfully',  
    user: null,
  }))
);
