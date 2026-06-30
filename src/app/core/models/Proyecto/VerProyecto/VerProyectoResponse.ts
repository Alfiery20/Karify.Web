export interface VerProyectoResponse {
  idProyecto: number;
  nombre: string;
  descripcion: string;
  estado: string;
  profesor: number;
  nombreProfesor: string;
  cotesista: number;
  nombreCotesista: string;
  nombreArchivo: string;
  fechaRegistro: Date;
  esCotesista: boolean;
}
