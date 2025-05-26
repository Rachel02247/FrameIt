console.log('AuthEffects file loaded');

import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import * as AuthActions from './auth.action';
import { AuthService } from '../../../servies/API/auth/auth.service';

@Injectable()
export class AuthEffects {
  login$: Actions;

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

    createEffect(
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

