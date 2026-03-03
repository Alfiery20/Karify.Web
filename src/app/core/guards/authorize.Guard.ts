import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { LocalStorageService } from '../services/local-storage-service';
import { GuardDecryp } from '../models/Guard/guard.decryp';
import { jwtDecode } from 'jwt-decode';

export const authorizeGuard: CanActivateChildFn = (childRoute, state) => {
  const localServi = inject(LocalStorageService);
  const router = inject(Router);

  var token = localServi.getItem('token');
  var url = (state.url).split('/')[2] ?? '/intranet';

  if (token) {
    const decoded = jwtDecode<GuardDecryp>(token);
    console.log(decoded.esNecesarioLlenar == 'False');
    
    if (decoded.esNecesarioLlenar == 'True') {
      router.navigate(['/intranet/configuracion']);
      return true
    }
    return true
  } else {
    router.navigate(['/']);
    return true;
  }
};
