import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ObtenerRolResponse } from '../../../core/models/Rol/ObtenerRol/ObtenerRolResponse';
import { RolService } from '../../../core/services/rol-service';
import { LogIn, LucideAngularModule, Plus } from 'lucide-angular';
import {
  AgregarRolRequest,
  PermisoNuevo,
} from '../../../core/models/Rol/AgregarRol/AgregarRolRequest';
import { AlertaServices } from '../../../core/services/alerta-services';
import { EditarRolRequest } from '../../../core/models/Rol/EditarRol/EditarRolRequest';
import { VerPermiso, VerRolResponse } from '../../../core/models/Rol/VerRol/VerRolResponse';
import { Permiso } from '../../../core/models/Guard/guard.decryp';

@Component({
  selector: 'app-gestion-permisos',
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-permisos.html',
  styleUrl: './gestion-permisos.scss',
})
export class GestionPermisos implements OnInit {
  sidebarOpen = false;
  searchTerm = '';
  roles: ObtenerRolResponse[] = [];

  rolesPaginados: ObtenerRolResponse[] = [];
  paginaActual = 1;
  registrosPorPagina = 5;
  totalPaginas = 1;

  isModalOpen = false;

  editarRolSeleccionado: EditarRolRequest = {} as EditarRolRequest;

  rolSeleccionado: VerRolResponse = {} as VerRolResponse;

  idRolSeleccionado = 0;

  tituloModal = 'Agregar';

  constructor(
    private rolService: RolService,
    private alertService: AlertaServices,
  ) {
    this.actualizarPaginacion();
  }

  ngOnInit(): void {
    this.buscar();
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  buscar() {
    this.rolService.ObtenerRol(this.searchTerm).subscribe((response) => {
      this.roles = response;
      const filtrados = this.roles.filter((u) =>
        u.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()),
      );
      this.paginaActual = 1;
      this.totalPaginas = Math.ceil(filtrados.length / this.registrosPorPagina);
      this.rolesPaginados = filtrados.slice(0, this.registrosPorPagina);
    });
  }

  actualizarPaginacion() {
    this.totalPaginas = Math.ceil(this.roles.length / this.registrosPorPagina);
    const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
    this.rolesPaginados = this.roles.slice(inicio, inicio + this.registrosPorPagina);
  }

  paginaAnterior() {
    if (this.paginaActual > 1) {
      this.paginaActual--;
      this.actualizarPaginacion();
    }
  }

  paginaSiguiente() {
    if (this.paginaActual < this.totalPaginas) {
      this.paginaActual++;
      this.actualizarPaginacion();
    }
  }

  asignarPermisos(rol: ObtenerRolResponse) {
    alert(`Asignar permisos a: ${rol.nombre}`);
  }

  abrirModal() {
    this.verRol(0);
    this.isModalOpen = true;
  }

  cerrarModal() {
    this.isModalOpen = false;
    this.rolSeleccionado = {} as VerRolResponse;
    this.idRolSeleccionado = 0;
  }

  guardarRol() {
    if (this.idRolSeleccionado) {
      this.editarRol();
    } else {
      this.registrarRol();
    }
  }

  registrarRol() {
    if (!this.rolSeleccionado.nombre) return;
    var rolNuevo: AgregarRolRequest = {
      nombre: this.rolSeleccionado.nombre,
      permisos: this.mappearPermisos(this.rolSeleccionado.permisos),
    };
    this.rolService.AgregarRol(rolNuevo).subscribe((response) => {
      if (response.mensaje == 'OK') {
        this.alertService.success('Rol agregado correctamente.');
      } else {
        this.alertService.error('Rol no ha sido agregado correctamente.');
      }
      this.cerrarModal();
      this.buscar();
    });
  }

  editarRol() {
    if (!this.rolSeleccionado.nombre) return;
    var rolNuevo: EditarRolRequest = {
      idRol: this.idRolSeleccionado,
      nombre: this.rolSeleccionado.nombre,
      permisos: this.mappearPermisos(this.rolSeleccionado.permisos),
    };
    this.rolService.EditarRol(rolNuevo).subscribe((response) => {
      if (response.mensaje == 'OK') {
        this.alertService.success('Rol editado correctamente.');
      } else {
        this.alertService.error('Rol no ha sido editado correctamente.');
      }
      this.buscar();
    });
    this.cerrarModal();
  }

  verRol(id: number) {
    this.idRolSeleccionado = id;
    this.tituloModal = id ? 'Editar' : 'Agregar';
    this.rolService.VerRol(this.idRolSeleccionado).subscribe((response) => {
      this.rolSeleccionado = response;
      this.isModalOpen = true;
    });
  }

  mappearPermisos(permisoVer: VerPermiso[]): PermisoNuevo[] {
    var permisosNuevos: PermisoNuevo[] = [];
    permisoVer.forEach((permiso) => {
      if (permiso.isPermiso) {
        permisosNuevos.push({ idRuta: permiso.idRuta });
      }
    });
    return permisosNuevos;
  }

  eliminarRol(rol: ObtenerRolResponse) {
    this.alertService.confirm(
      `¿Estás seguro de ${rol.estado ? 'desactivar' : 'activar'} el rol ${rol.nombre}?`,
      () => {
        this.rolService.EliminarRol(rol.id).subscribe((response) => {
          if (response.mensaje == 'OK') {
            this.alertService.success(`Rol ${rol.estado ? 'desactivado' : 'activado'} correctamente.`);
            this.buscar();
          } else {
            this.alertService.error(`Rol no ha sido ${rol.estado ? 'desactivado' : 'activado'} correctamente.`);
          }
        });
      },
    );
  }
}
