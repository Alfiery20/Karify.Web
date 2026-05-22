import { Component, OnInit } from '@angular/core';
import { ObtenerProfesorRequest } from '../../../core/models/Profesor/ObtenerProfesor/ObtenerProfesorRequest';
import { VerProfesorResponse } from '../../../core/models/Profesor/VerProfesor/VerProfesorResponse';
import { ObtenerProfesorResponse } from '../../../core/models/DatosMaestros/ObtenerProfesor/ObtenerProfesorResponse';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfesorService } from '../../../core/services/profesor-service';
import { AlertaServices } from '../../../core/services/alerta-services';
import { AgregarProfesorRequest } from '../../../core/models/Profesor/AgregarProfesor/AgregarProfesorRequest';
import { DatosMaestrosService } from '../../../core/services/datos-maestros-service';
import { ObtenerFacultadResponse } from '../../../core/models/DatosMaestros/ObtenerFacultad/ObtenerFacultadResponse';
import { ObtenerEscuelaResponse } from '../../../core/models/DatosMaestros/ObtenerEscuela/ObtenerEscuelaResponse';

@Component({
  selector: 'app-gestion-profesores',
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-profesores.html',
  styleUrl: './gestion-profesores.scss',
})
export class GestionProfesores implements OnInit {
  profesores: ObtenerProfesorResponse[] = [];

  profesoresPaginados: ObtenerProfesorResponse[] = [];
  profesorSeleccionado: VerProfesorResponse = {} as VerProfesorResponse;

  facultades: ObtenerFacultadResponse[] = [];
  escuelas: ObtenerEscuelaResponse[] = [];

  facultadSeleccionada: number = 0;
  escuelaSeleccionada: number = 0;

  searchProfesor: string = '';
  isModalProfesorOpen: boolean = false;

  paginaActual: number = 1;
  elementosPorPagina: number = 10;
  totalPaginas: number = 1;

  ngOnInit(): void {
    this.datosMaestrosService.ObtenerFacultad().subscribe((response) => {
      this.facultades = response;
      this.buscarProfesor();
    });
  }

  constructor(
    private profesorService: ProfesorService,
    private alertaService: AlertaServices,
    private datosMaestrosService: DatosMaestrosService,
  ) {
    this.actualizarPaginacion();
  }

  actualizarPaginacion(): void {
    this.totalPaginas = Math.ceil(this.profesores.length / this.elementosPorPagina);
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    this.profesoresPaginados = this.profesores.slice(inicio, fin);
  }

  paginaAnteriorProfesor(): void {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.actualizarPaginacion();
    }
  }

  paginaSiguienteProfesor(): void {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
      this.actualizarPaginacion();
    }
  }

  buscarProfesor(): void {
    var request: ObtenerProfesorRequest = {
      nombre: this.searchProfesor,
      idFacultad: this.facultadSeleccionada,
      idEscuela: this.escuelaSeleccionada,
    };
    this.profesorService.ObtenerProfesor(request).subscribe((response) => {
      this.profesores = response;
      this.profesoresPaginados = this.profesores.slice(0, this.elementosPorPagina);
      this.totalPaginas = Math.ceil(this.profesores.length / this.elementosPorPagina);
      this.paginaActual = 1;
    });
  }

  abrirModalProfesor(): void {
    this.profesorSeleccionado = {} as VerProfesorResponse;
    this.isModalProfesorOpen = true;
  }

  eliminarProfesor(Profesor: ObtenerProfesorResponse): void {
    this.alertaService.confirm(
      '¿Estás seguro de ' + (Profesor.estado ? 'desactivar' : 'activar') + ' este profesor?',
      () => {
        this.profesorService.EliminarProfesor(Profesor.idProfesor).subscribe((response) => {
          if (response.mensaje == 'OK') {
            this.alertaService.success(
              'Profesor' + (Profesor.estado ? ' desactivado' : ' activado') + ' correctamente',
            );
            this.buscarProfesor();
            this.actualizarPaginacion();
          } else {
            this.alertaService.error('Error al eliminar el profesor');
          }
        });
      },
    );
  }

  guardarProfesor(): void {
    var request: AgregarProfesorRequest = {
      nombre: this.profesorSeleccionado.nombre,
      apellidoPaterno: this.profesorSeleccionado.apellidoPaterno,
      apellidoMaterno: this.profesorSeleccionado.apellidoMaterno,
      emeal: this.profesorSeleccionado.correo,
      idRol: 2,
    };

    this.profesorService.AgregarProfesor(request).subscribe((response) => {
      if (response.mensaje == 'OK') {
        this.alertaService.success('Profesor agregado correctamente');
        this.buscarProfesor();
        this.cerrarModalProfesor();
        this.actualizarPaginacion();
      } else {
        this.alertaService.error('Error al agregar el profesor');
      }
    });
  }

  onFacultadChange(event: Event): void {
    const idFacultad = (event.target as HTMLSelectElement).value;
    this.datosMaestrosService.ObtenerEscuela(Number(idFacultad)).subscribe((response) => {
      this.escuelas = response;
    });
  }

  cerrarModalProfesor(): void {
    this.isModalProfesorOpen = false;
  }
}
