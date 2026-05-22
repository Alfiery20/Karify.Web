import { CommonModule } from '@angular/common';
import { Component, NgModule, OnInit } from '@angular/core';
import { ObtenerRolResponse } from '../../../core/models/Rol/ObtenerRol/ObtenerRolResponse';
import { FormsModule } from '@angular/forms';
import { ObtenerProyectoRequest } from '../../../core/models/Proyecto/ObtenerProyecto/ObtenerProyectoRequest';
import { ObtenerProyectoResponse } from '../../../core/models/Proyecto/ObtenerProyecto/ObtenerProyectoResponse';
import { VerProyectoResponse } from '../../../core/models/Proyecto/VerProyecto/VerProyectoResponse';
import { ProyectoService } from '../../../core/services/proyecto-service';
import { DatosMaestrosService } from '../../../core/services/datos-maestros-service';
import { ObtenerProfesorResponse } from '../../../core/models/DatosMaestros/ObtenerProfesor/ObtenerProfesorResponse';

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

  searchProyecto: string = '';
  searchProfesor: string = '';
  isModalProyectoOpen: boolean = false;

  profesores: ObtenerProfesorResponse[] = [];

  paginaActual: number = 1;
  elementosPorPagina: number = 5;
  totalPaginas: number = 1;

  constructor(
    private proyectoService: ProyectoService,
    private datosmaestrosService: DatosMaestrosService,
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
    this.cargarProfesores();
    this.proyectoSeleccionado = {} as VerProyectoResponse;
    this.isModalProyectoOpen = true;
  }

  editarProyecto(proyecto: ObtenerProyectoResponse): void {
    this.proyectoSeleccionado = {
      idProyecto: proyecto.id,
      nombre: proyecto.nombre,
      descripcion: proyecto.descripcion,
      profesor: 0,
      fechaRegistro: new Date(proyecto.fechaRegistro),
    };
    this.isModalProyectoOpen = true;
  }

  revisarProyecto(proyecto: ObtenerProyectoResponse): void {
    alert(`Revisando proyecto: ${proyecto.nombre}`);
  }

  eliminarProyecto(proyecto: ObtenerProyectoResponse): void {
    this.proyectos = this.proyectos.filter((p) => p.id !== proyecto.id);
    this.actualizarPaginacion();
  }

  guardarProyecto(): void {
    if (this.proyectoSeleccionado.idProyecto === 0) {
      const nuevoId =
        this.proyectos.length > 0 ? Math.max(...this.proyectos.map((p) => p.id)) + 1 : 1;
      this.proyectoSeleccionado.idProyecto = nuevoId;
    } else {
      const index = this.proyectos.findIndex((p) => p.id === this.proyectoSeleccionado.idProyecto);
    }
    this.cerrarModalProyecto();
    this.actualizarPaginacion();
  }

  cerrarModalProyecto(): void {
    this.isModalProyectoOpen = false;
  }
}
