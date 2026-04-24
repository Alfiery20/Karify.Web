export interface AgregarRolRequest {
  nombre: string;
  permisos: PermisoNuevo[];
}

export interface PermisoNuevo {
  idRuta: number;
}
