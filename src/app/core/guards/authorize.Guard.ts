import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocalStorageService } from '../services/local-storage-service';
import { GuardDecryp } from '../models/Guard/guard.decryp';
import { jwtDecode } from 'jwt-decode';
import { InicioSesionCommandResponse } from '../models/Autenticacion/InicioSesion/InicioSesionResponse';

export const authorizeGuard: CanActivateFn = (_route, state) => {
  const localServi = inject(LocalStorageService);
  const router = inject(Router);
  const token = localServi.getItem('token') as string | null;
  const user = localServi.getItem('usuario') as InicioSesionCommandResponse | null;
  const loginUrl = router.createUrlTree(['/']);

  if (!token || !user || !Array.isArray(user.menus)) {
    localServi.clear();
    return loginUrl;
  }

  let decoded: GuardDecryp;
  try {
    decoded = jwtDecode<GuardDecryp>(token);
  } catch {
    localServi.clear();
    return loginUrl;
  }

  if (!Number.isFinite(decoded.exp) || decoded.exp <= Date.now() / 1000) {
    localServi.clear();
    return loginUrl;
  }

  const route = state.url.split(/[?#]/, 1)[0].split('/')[2] ?? '';

  if (decoded.esNecesarioLlenar === 'True' && route !== 'configuracion') {
    return router.createUrlTree(['/intranet/configuracion']);
  }

  if (route === '' || route === 'configuracion') return true;

  return user.menus.some((menu) => menu.ruta === route)
    ? true
    : router.createUrlTree(['/intranet']);
};
