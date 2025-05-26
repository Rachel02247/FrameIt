import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';
import { selectIsLoggedIn } from '../components/global-states/auth/auth.selectors';


export const authGuard: CanMatchFn = (route, segments) => {
  const store = inject(Store);

  return store.select(selectIsLoggedIn).pipe(
    take(1),
    map(isLoggedIn => {
      return !!isLoggedIn || !!sessionStorage.getItem('token');
    })
  );
};
