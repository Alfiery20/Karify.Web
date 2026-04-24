import { PermisoNuevo } from "../AgregarRol/AgregarRolRequest";

export interface EditarRolRequest {
  idRol: number;
  nombre: string;
  permisos: PermisoNuevo[];
}