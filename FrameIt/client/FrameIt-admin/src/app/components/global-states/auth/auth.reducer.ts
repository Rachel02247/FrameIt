import { createReducer, on } from '@ngrx/store';
import * as AuthActions from './auth.action';
import { initialState } from './auth.state';



export const authReducer = createReducer(
  initialState,

  on(AuthActions.requestLogin, (state) => ({
    ...state,
    loading: true,
    error: null,
    message: null,

  })),


  on(AuthActions.loginSuccess, (state, { user }) => ({
    ...state,
    loading: false,
    user,
    error: null,
    message: null,
    isLogin: true,
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
