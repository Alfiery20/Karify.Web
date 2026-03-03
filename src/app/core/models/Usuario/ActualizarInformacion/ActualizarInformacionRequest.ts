export interface ActualizarInformacionRequest {
    idUsuario: number,
    codigoUniversitario: string,
    tipoDocumento: string,
    numeroDocumento: string,
    nombre: string,
    apellidoPaterno: string,
    apellidoMaterno: string,
    telefono: string,
    idEscuela: number
}