import { CanActivateFn } from '@angular/router';

export const authSpreadGuard: CanActivateFn = (route, state) => {
 
  const token = sessionStorage.getItem('token');
  if (token) {
    return false;
  }
  return true;
};
