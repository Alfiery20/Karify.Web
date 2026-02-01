export interface GuardDecryp {
    id: string,
    codigoUniversitario: string,
    tipo_documento: string,
    numero_documento: string,
    nombre: string,
    apellido_paterno: string,
    apellido_materno: string,
    correo: string,
    telefono: string,
    idEscuela: number,
    nombreEscuela: string,
    idFacultad: number,
    nombreFacultad: string,
    esNecesarioLLenar: boolean,
    // permisos: Permiso[],
    exp: number,
    iss: string
}

export interface Permiso {
    Id: number,
    Nombre: string,
    Ruta: string,
    IdMenuPadre: number,
    Orden: number,
    Icono: string,
    MenuHijo: Permiso[]
}