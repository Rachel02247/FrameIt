import { createAction, props } from '@ngrx/store';
import { User } from '../../../models/user';

export const requestLogin = createAction(
  '[Auth] Request Login',
  props<{ email: string; password: string }>()
);

export const requestRegister = createAction(
  '[Auth] Request Register',
  props<{ email: string; password: string }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: User }>()
);
export const logout = createAction(
  '[Auth] logout Success',
  props<{ message?: string }>()
);

export const registerRequestSent = createAction(
  '[Auth] Register Request Sent',
  props<{ message: string }>()
);

export const authRequestFailure = createAction(
  '[Auth] Auth Request Failure',
  props<{ error: string }>()
);
