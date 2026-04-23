export interface VerRolResponse {
    idRol: number,
    nombre: string,
    estado: true,
    permisos: Permiso[]
}

export interface Permiso {
    idRuta: number,
    ruta: string,
    isPermiso: true
}