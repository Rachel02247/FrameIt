import { Platform } from '@angular/cdk/platform';
import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  
  const platform = inject(PLATFORM_ID);
  const router = inject(Router);
  
  if(isPlatformBrowser(platform)) {
    const token = sessionStorage.getItem('token');
    if (token) {
      return true;
    } else {
      router.navigate(['/auth']);
      return false;
    }
  }
  return false;
};
