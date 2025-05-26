import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectUser = createSelector(
  selectAuthState,
  (state) => state.user
);

export const selectIsLoggedIn = createSelector(
  selectUser,
  (user) => !!user
);

export const selectAuthLoading = createSelector(
  selectAuthState,
  (state) => state.loading
);

export const selectAuthMessage = createSelector(
  selectAuthState,
  (state) => state.error ? null : state.message
);

export const selectAuthError = createSelector(
  selectAuthState,
  (state) => state.error
);

export const selectIsRegistering = createSelector(
  selectAuthState,
  (state) => state.isRegistering 
);

export const selectLogout = createSelector(
  selectAuthState,
  (state) => state.message === 'Logout successful' ? state.message : null 
);
