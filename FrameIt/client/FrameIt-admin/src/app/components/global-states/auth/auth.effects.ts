console.log('AuthEffects file loaded');

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import * as AuthActions from './auth.action';
import { AuthService } from '../../../servies/auth/auth.service';

@Injectable()
export class AuthEffects {
  login$: any;
  register$: any;
  logout$: any;

  constructor(
    private actions$: Actions, 
    private authService: AuthService
  ) {
    this.login$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.requestLogin),
        mergeMap((action: { email: string; password: string }) =>
          this.authService.login(action.email, action.password).pipe(
            map(response => AuthActions.loginSuccess({ user: {
              token: response.token,
              id: '',
              email: '',
              password: ''
            } })),
            catchError(error =>
              of(AuthActions.authRequestFailure({ error: error.message || 'Login failed' }))
            )
          )
        )
      ));

    this.register$ = createEffect(() =>
      this.actions$.pipe(
        ofType(AuthActions.requestRegister),
        mergeMap(action =>
          this.authService.sendRegistrationRequest(action.email, action.password).pipe(
            map(() =>
              AuthActions.registerRequestSent({ message: 'Registration email sent successfully' })
            ),
            catchError(error =>
              of(AuthActions.authRequestFailure({ error: error.message || 'Register failed' }))
            )
          )
        )
      ));

    this.logout$ = createEffect(
      () =>
        this.actions$.pipe(
          ofType(AuthActions.logout),
          map(() => {
            sessionStorage.removeItem('token');
          })
        ),
      { dispatch: false }
    );
  }
}

