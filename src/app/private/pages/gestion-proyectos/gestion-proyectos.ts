import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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

  searchProyecto: string = '';
  searchProfesor: string = '';
  isModalProyectoOpen: boolean = false;

  profesores: ObtenerProfesorResponse[] = [];

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

  seleccionarProfesor(profesor: ObtenerProfesorResponse): void {
    this.searchProfesor = profesor.nombre;
    this.profesorSeleccionado = profesor;
    this.profesores = [];
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
      this.isModalProyectoOpen = true;
    });
  }

  cancelarProyecto(idProyecto: number): void {
    this.alertService.confirm('¿Está seguro de cancelar el proyecto?', () => {
      this.proyectoService.CancelarProyecto(idProyecto).subscribe((response) => {
        if (response.mensaje === 'OK') {
          this.alertService.success('Proyecto cancelado exitosamente');
        } else {
          this.alertService.error('Error al cancelar el proyecto');
        }
      });
      this.cargarProyectos();
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
      } else {
        this.alertService.error('Error al agregar el proyecto');
      }
    });
  }

  editarProyecto(): void {
    var request: EditarProyectoRequest = {
      idProyecto: this.proyectoSeleccionado.idProyecto,
      nombre: this.proyectoSeleccionado.nombre || '',
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

  cerrarModalProyecto(): void {
    this.isModalProyectoOpen = false;
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
}
