import { Menu } from "./Menus";

export interface InicioSesionCommandResponse {
    idUsuario: number,
    codigoUniversitario: string,
    tipoDocumento: string,
    numeroDocumento: string,
    nombre: string,
    apellidoPaterno: string,
    apellidoMaterno: string,
    correo: string,
    telefono: string,
    idEscuela: number,
    nombreEscuela: string,
    idFacultad: number,
    nombreFacultad: string,
    llenarPerfil: true,
    token: string,
    idRol: number,
    rol: string,
    menus: Menu[]
}