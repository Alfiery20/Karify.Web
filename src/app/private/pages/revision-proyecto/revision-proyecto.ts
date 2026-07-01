import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ObtenerProyectoPorProfesorResponse } from '../../../core/models/Proyecto/ObtenerProyectoPorProfesor/ObtenerProyectoPorProfesorResponse';
import { ProyectoService } from '../../../core/services/proyecto-service';
import { VerProyectoRevisionResponse } from '../../../core/models/Proyecto/VerProyectoRevision/VerProyectoRevisionResponse';
import { AlertaServices } from '../../../core/services/alerta-services';
import { Constantes } from '../../../core/Utils/Constants';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-revision-proyecto',
  imports: [CommonModule, FormsModule],
  templateUrl: './revision-proyecto.html',
  styleUrl: './revision-proyecto.scss',
})
export class RevisionProyecto {
  revisiones: ObtenerProyectoPorProfesorResponse[] = [];

  revisionesPaginadas: ObtenerProyectoPorProfesorResponse[] = [];
  revisionSeleccionada: VerProyectoRevisionResponse = {} as VerProyectoRevisionResponse;

  paginaActual: number = 1;
  elementosPorPagina: number = 5;
  totalPaginas: number = 1;

  isModalOpen: boolean = false;

  searchProyecto: string = '';

  constructor(
    private proyectoService: ProyectoService,
    private alertService: AlertaServices,
  ) {
    this.obtenerProyectoARevisar();
  }
  buscarProyecto(): void {
    if (this.searchProyecto.trim() === '') {
      this.actualizarPaginacion();
    } else {
      const filtrados = this.revisiones.filter((p) =>
        p.nombre.toLowerCase().includes(this.searchProyecto.toLowerCase()),
      );
      this.revisionesPaginadas = filtrados;
      this.totalPaginas = Math.ceil(filtrados.length / this.elementosPorPagina);
      this.paginaActual = 1;
    }
  }

  obtenerProyectoARevisar() {
    this.proyectoService.ObtenerProyectoPorProfesor().subscribe((response) => {
      this.revisiones = response;
      this.actualizarPaginacion();
    });
  }

  actualizarPaginacion(): void {
    this.totalPaginas = Math.ceil(this.revisiones.length / this.elementosPorPagina);
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    this.revisionesPaginadas = [...this.revisiones.slice(inicio, fin)];
  }

  paginaAnterior(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.actualizarPaginacion();
    }
  }

  paginaSiguiente(): void {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
      this.actualizarPaginacion();
    }
  }

  abrirModalRevision(revision: VerProyectoRevisionResponse): void {
    this.revisionSeleccionada = { ...revision };
    this.isModalOpen = true;
  }

  cerrarModal(): void {
    this.isModalOpen = false;
    this.revisionSeleccionada = {} as VerProyectoRevisionResponse;
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

  private actualizarEstado(revision: ObtenerProyectoPorProfesorResponse): void {
    const index = this.revisiones.findIndex((r) => r.id === revision.id);
    if (index !== -1) {
      this.revisiones[index] = { ...revision };
      this.actualizarPaginacion();
    }
  }

  convertirEstado(estado: string): string {
    return Constantes.getEstadoProyecto(estado);
  }

  obtenerClaseEstado(estado: string): string {
    return Constantes.getClaseEstado(estado);
  }

  descargarArchivo(proyecto: VerProyectoRevisionResponse): void {
    if (!proyecto.archivo) return;

    const byteCharacters = atob(proyecto.archivo);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // Detecta tipo según extensión
    let mimeType = 'application/pdf';
    if (proyecto.nombreArchivo.endsWith('.doc')) mimeType = 'application/msword';
    if (proyecto.nombreArchivo.endsWith('.docx'))
      mimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

    const blob = new Blob([byteArray], { type: mimeType });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = proyecto.nombreArchivo || 'documento';
    a.click();

    window.URL.revokeObjectURL(url);
  }

  aprobarProyecto(): void {
    this.proyectoService
      .AprobarProyecto(this.revisionSeleccionada.idProyecto)
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
        this.obtenerProyectoARevisar();
      });
  }

  rechazarProyecto(): void {
    this.proyectoService
      .RechazarProyecto(this.revisionSeleccionada.idProyecto)
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
        this.obtenerProyectoARevisar();
      });
  }
}
