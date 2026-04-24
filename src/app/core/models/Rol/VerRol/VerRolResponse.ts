export interface VerRolResponse {
    idRol: number,
    nombre: string,
    estado: true,
    permisos: VerPermiso[]
}

export interface VerPermiso {
    idRuta: number,
    ruta: string,
    isPermiso: true
}