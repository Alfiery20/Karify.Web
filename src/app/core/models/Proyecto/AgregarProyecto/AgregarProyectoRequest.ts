export interface AgregarProyectoRequest {
  nombre: string;
  idAlumno: number;
  nombreCotesista: string;
  idCotesista: number;
  descripcion: string;
  nombreArchivo: string;
  archivoEncriptado: string;
  peso: number;
  idProfesor: number;
}
