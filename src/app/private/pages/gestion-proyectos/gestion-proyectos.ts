import { CommonModule } from '@angular/common';
import { Component, LOCALE_ID, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ObtenerProyectoRequest } from '../../../core/models/Proyecto/ObtenerProyecto/ObtenerProyectoRequest';
import { ObtenerProyectoResponse } from '../../../core/models/Proyecto/ObtenerProyecto/ObtenerProyectoResponse';
import { VerProyectoResponse } from '../../../core/models/Proyecto/VerProyecto/VerProyectoResponse';
import { ProyectoService } from '../../../core/services/proyecto-service';
import { DatosMaestrosService } from '../../../core/services/datos-maestros-service';
import { ObtenerProfesorResponse } from '../../../core/models/DatosMaestros/ObtenerProfesor/ObtenerProfesorResponse';
import { AgregarProyectoRequest } from '../../../core/models/Proyecto/AgregarProyecto/AgregarProyectoRequest';
import { AlertaServices } from '../../../core/services/alerta-services';
import { EditarProyectoRequest } from '../../../core/models/Proyecto/EditarProyecto/EditarProyectoRequest';
import { Constantes } from '../../../core/Utils/Constants';
import { ObtenerAlumnoResponse } from '../../../core/models/DatosMaestros/ObtenerAlumno/ObtenerAlumnoResponse';
import { VerProyectoRevisionResponse } from '../../../core/models/Proyecto/VerProyectoRevision/VerProyectoRevisionResponse';

@Component({
  selector: 'app-gestion-proyectos',
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-proyectos.html',
  styleUrl: './gestion-proyectos.scss',
})
export class GestionProyectos implements OnInit {
  proyectos: ObtenerProyectoResponse[] = [];

  proyectosPaginados: ObtenerProyectoResponse[] = [];
  proyectoSeleccionado: VerProyectoResponse = {} as VerProyectoResponse;

  profesorSeleccionado: ObtenerProfesorResponse = {} as ObtenerProfesorResponse;
  alumnoSeleccionado: ObtenerAlumnoResponse = {} as ObtenerAlumnoResponse;

  revisionSeleccionada: VerProyectoRevisionResponse = {} as VerProyectoRevisionResponse;

  searchProyecto: string = '';
  searchProfesor: string = '';
  searchAlumno: string = '';

  isModalProyectoOpen: boolean = false;
  isModalOpen: boolean = false;

  profesores: ObtenerProfesorResponse[] = [];
  alumnos: ObtenerAlumnoResponse[] = [];

  paginaActual: number = 1;
  elementosPorPagina: number = 5;
  totalPaginas: number = 1;

  debounceTimer: any;

  archivoSeleccionado: File | null = null;
  archivoBase64: string | null = null;

  constructor(
    private proyectoService: ProyectoService,
    private datosmaestrosService: DatosMaestrosService,
    private alertService: AlertaServices,
  ) {
    this.actualizarPaginacion();
  }

  ngOnInit(): void {
    this.cargarProyectos();
  }

  cargarProfesores(): void {
    this.datosmaestrosService.ObtenerProfesor(this.searchProfesor).subscribe((profesores) => {
      this.profesores = profesores;
    });
  }

  cargarAlumno(): void {
    this.datosmaestrosService.ObtenerAlumno(this.searchAlumno).subscribe((alumnos) => {
      this.alumnos = alumnos;
    });
  }

  cargarProyectos(): void {
    var request: ObtenerProyectoRequest = {
      nombre: this.searchProyecto,
    };
    this.proyectoService.ObtenerProyecto(request).subscribe((proyectos) => {
      this.proyectos = proyectos;
      this.actualizarPaginacion();
    });
  }

  actualizarPaginacion(): void {
    this.totalPaginas = Math.ceil(this.proyectos.length / this.elementosPorPagina);
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    this.proyectosPaginados = this.proyectos.slice(inicio, fin);
  }

  paginaAnteriorProyecto(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.actualizarPaginacion();
    }
  }

  paginaSiguienteProyecto(): void {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
      this.actualizarPaginacion();
    }
  }

  onProfesorInput(): void {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.cargarProfesores();
    }, 300);
  }

  onAlumnoInput(): void {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.cargarAlumno();
    }, 300);
  }

  seleccionarProfesor(profesor: ObtenerProfesorResponse): void {
    this.searchProfesor = profesor.nombre;
    this.profesorSeleccionado = profesor;
    this.profesores = [];
  }

  seleccionarAlumno(alumno: ObtenerAlumnoResponse): void {
    this.searchAlumno = alumno.nombre;
    this.alumnoSeleccionado = alumno;
    this.alumnos = [];
  }

  buscarProyecto(): void {
    if (this.searchProyecto.trim() === '') {
      this.actualizarPaginacion();
    } else {
      const filtrados = this.proyectos.filter((p) =>
        p.nombre.toLowerCase().includes(this.searchProyecto.toLowerCase()),
      );
      this.proyectosPaginados = filtrados;
      this.totalPaginas = Math.ceil(filtrados.length / this.elementosPorPagina);
      this.paginaActual = 1;
    }
  }

  abrirModalProyecto(): void {
    this.proyectoSeleccionado = {} as VerProyectoResponse;
    this.profesorSeleccionado = {} as ObtenerProfesorResponse;
    this.alumnoSeleccionado = {} as ObtenerAlumnoResponse;

    this.searchAlumno = '';
    this.searchProfesor = '';
    this.archivoSeleccionado = null;

    this.isModalProyectoOpen = true;
  }

  verProyecto(idProyecto: number): void {
    this.proyectoService.VerProyecto(idProyecto).subscribe((proyecto) => {
      this.proyectoSeleccionado = proyecto;

      this.archivoSeleccionado = {
        name: proyecto.nombreArchivo,
      } as File;
      this.seleccionarProfesor({
        codigo: proyecto.profesor,
        nombre: proyecto.nombreProfesor,
      } as ObtenerProfesorResponse);

      this.seleccionarAlumno({
        codigo: proyecto.cotesista,
        nombre: proyecto.nombreCotesista,
      } as ObtenerProfesorResponse);
      this.isModalProyectoOpen = true;
    });
  }

  cancelarProyecto(idProyecto: number): void {
    this.alertService.confirm('¿Está seguro de cancelar el proyecto?', () => {
      this.proyectoService.CancelarProyecto(idProyecto).subscribe((response) => {
        if (response.mensaje === 'OK') {
          this.alertService.success('Proyecto cancelado exitosamente');
          this.cargarProyectos();
        } else {
          this.alertService.error('Error al cancelar el proyecto');
        }
      });
    });
  }

  guardarProyecto(): void {
    if (
      this.proyectoSeleccionado.idProyecto == 0 ||
      this.proyectoSeleccionado.idProyecto == undefined
    ) {
      this.agregarProyecto();
    } else {
      this.editarProyecto();
    }
  }

  agregarProyecto(): void {
    var request: AgregarProyectoRequest = {
      nombre: this.proyectoSeleccionado.nombre || '',
      descripcion: this.proyectoSeleccionado.descripcion || '',
      nombreCotesista: this.searchAlumno,
      idCotesista: this.alumnoSeleccionado.codigo || 0,
      nombreArchivo: this.archivoSeleccionado?.name || '',
      archivoEncriptado: this.archivoBase64 || '',
      peso: this.archivoSeleccionado?.size || 0,
      idProfesor: this.profesorSeleccionado.codigo || 0,
      idAlumno: 0,
    };
    this.proyectoService.AgregarProyecto(request).subscribe((response) => {
      if (response.mensaje === 'OK') {
        this.alertService.success('Proyecto agregado exitosamente');
        this.cerrarModalProyecto();
        this.cargarProyectos();
        this.eliminarArchivo();
      } else if (response.mensaje === 'E1') {
        this.alertService.error(
          'El Alumno cotesista, no puede ser el mismo que el que esta registrando el proyecto',
        );
      } else {
        this.alertService.error('Error al agregar el proyecto');
      }
    });
  }

  editarProyecto(): void {
    var request: EditarProyectoRequest = {
      idProyecto: this.proyectoSeleccionado.idProyecto,
      nombre: this.proyectoSeleccionado.nombre || '',
      idCotesista: this.alumnoSeleccionado.codigo || 0,
      descripcion: this.proyectoSeleccionado.descripcion || '',
      idProfesor: this.profesorSeleccionado.codigo || 0,
    };
    this.proyectoService.EditarProyecto(request).subscribe((response) => {
      if (response.mensaje === 'OK') {
        this.alertService.success('Proyecto editado exitosamente');
        this.cerrarModalProyecto();
        this.cargarProyectos();
        this.eliminarArchivo();
      } else {
        this.alertService.error('Error al editar el proyecto');
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    const file = input.files[0];

    const tiposPermitidos = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!tiposPermitidos.includes(file.type)) {
      alert('Solo se permiten archivos PDF, DOC o DOCX');
      input.value = '';
      return;
    }

    this.archivoSeleccionado = file;

    const reader = new FileReader();

    reader.onload = () => {
      const resultado = reader.result as string;

      this.archivoBase64 = resultado.split(',')[1];
    };

    reader.readAsDataURL(file);
  }

  eliminarArchivo(): void {
    this.archivoSeleccionado = null;
    this.archivoBase64 = null;
  }

  eliminarAlumno(): void {
    this.searchAlumno = '';
    this.alumnos = [];
    this.alumnoSeleccionado = {} as ObtenerAlumnoResponse;
  }

  cerrarModalProyecto(): void {
    this.isModalProyectoOpen = false;
  }

  obtenerClaseEstado(estado: string): string {
    return Constantes.getClaseEstado(estado);
  }

  convertirEstado(estado: string): string {
    return Constantes.getEstadoProyecto(estado);
  }

  descargarConstancia(idProyecto: number): void {
    this.proyectoService.DescargarConstancia(idProyecto).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ConstanciaAutenticidad.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    });
  }

  verProyectoRevision(idProyecto: number): void {
    this.proyectoService.VerProyectoRevision(idProyecto).subscribe((response) => {
      this.revisionSeleccionada = {
        idProyecto: response.idProyecto,
        nombre: response.nombre,
        descripcion: response.descripcion,
        fechaRegistro: response.fechaRegistro,
        nombreArchivo: response.nombreArchivo,
        archivo: response.archivo,
        numeroDocumento: response.numeroDocumento,
        codigoUniversitario: response.codigoUniversitario,
        nombreAlumno: response.nombreAlumno,
        apellidoPateno: response.apellidoPateno,
        apellidoMaterno: response.apellidoMaterno,
      };
      this.abrirModalRevision(this.revisionSeleccionada);
    });
  }

  abrirModalRevision(revision: VerProyectoRevisionResponse): void {
    this.revisionSeleccionada = { ...revision };
    this.isModalOpen = true;
  }

  cerrarModal(): void {
    this.isModalOpen = false;
    this.revisionSeleccionada = {} as VerProyectoRevisionResponse;
  }

  aprobarProyecto(): void {
    this.proyectoService
      .AprobarProyectoCotesista(this.revisionSeleccionada.idProyecto)
      .subscribe((response) => {
        if (response.mensaje == 'OK') {
          this.alertService.success('Proyecto aprobado exitosamente');
        } else if (response.mensaje == 'E1') {
          this.alertService.error(
            'El proyecto no esta asignado al profesor logeado. No puedes aprobarlo.',
          );
        } else {
          this.alertService.error('Error al aprobar el proyecto');
        }
        this.cerrarModal();
        this.cargarProyectos();
      });
  }

  rechazarProyecto(): void {
    this.proyectoService
      .RechazarProyectoCotesista(this.revisionSeleccionada.idProyecto)
      .subscribe((response) => {
        if (response.mensaje == 'OK') {
          this.alertService.success('Proyecto rechazado exitosamente');
        } else if (response.mensaje == 'E1') {
          this.alertService.error(
            'El proyecto no esta asignado al profesor logeado. No puedes aprobarlo.',
          );
        } else {
          this.alertService.error('Error al rechazar el proyecto');
        }
        this.cerrarModal();
        this.cargarProyectos();
      });
  }
}
