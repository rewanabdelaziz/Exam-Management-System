import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
   const token = localStorage.getItem('token');
   const router = inject(Router);

  if (!token) {
    router.navigate(['/auth']);
    return false;
  }

  let payload;
  try {
    payload = JSON.parse(atob(token));
  } catch (e) {
    localStorage.removeItem('token');
    router.navigate(['/auth']);
    return false;
  }
  
  // check token expiration
  if (payload.exp < Date.now()) {
    localStorage.removeItem('token');
    router.navigate(['/auth']);
    return false;
  }

  // check role authorization
  const allowedRoles: string[] = route.data['roles'];
   if (allowedRoles && !allowedRoles.includes(payload.role)) {
    localStorage.removeItem('token');
    router.navigate(['/auth']); 
    return false;
  }


  return true;
};
