import { createAction, props } from '@ngrx/store';
import { AuthUser } from '../../../models/authUser';

export const requestLogin = createAction(
  '[Auth] Request Login',
  props<{ email: string; password: string }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: AuthUser }>()
);

export const logout = createAction(
  '[Auth] logout Success',
  props<{ message?: string }>()
);

export const authRequestFailure = createAction(
  '[Auth] Auth Request Failure',
  props<{ error: string }>()
);
