import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { LocalStorageService } from '../services/local-storage-service';
import { GuardDecryp } from '../models/Guard/guard.decryp';
import { jwtDecode } from 'jwt-decode';
import { InicioSesionCommandResponse } from '../models/Autenticacion/InicioSesion/InicioSesionResponse';

export const authorizeGuard: CanActivateChildFn = (childRoute, state) => {
  const localServi = inject(LocalStorageService);
  const router = inject(Router);

  var token = localServi.getItem('token');
  var user = localServi.getItem('usuario') as InicioSesionCommandResponse;
  var url = state.url.split('/')[2] ?? '/intranet';

  if (token) {
    const decoded = jwtDecode<GuardDecryp>(token);

    if (decoded.esNecesarioLlenar == 'True') {
      router.navigate(['/intranet/configuracion']);
      return true;
    }
    const esRutaPrincipal = state.url === '/intranet';
    const tienePermiso = user.menus.some((p) => p.ruta === url);

    if (esRutaPrincipal || tienePermiso) {
      return true;
    }
    return true;
  } else {
    router.navigate(['/']);
    return true;
  }
};
