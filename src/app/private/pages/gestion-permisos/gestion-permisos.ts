import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ObtenerRolResponse } from '../../../core/models/Rol/ObtenerRol/ObtenerRolResponse';
import { RolService } from '../../../core/services/rol-service';
import { LucideAngularModule, Plus } from 'lucide-angular';
import { AgregarRolRequest } from '../../../core/models/Rol/AgregarRol/AgregarRolRequest';
import { AlertaServices } from '../../../core/services/alerta-services';

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

  agregarRol: AgregarRolRequest = {} as AgregarRolRequest;

  constructor(
    private rolService: RolService,
    private alertService: AlertaServices
  ) {
    this.actualizarPaginacion();
  }

  ngOnInit(): void {
    this.rolService.ObtenerRol(this.searchTerm).subscribe(
      (response) => {
        this.roles = response;
        this.buscar()
      }
    )
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  buscar() {
    const filtrados = this.roles.filter(u =>
      u.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
    this.paginaActual = 1;
    this.totalPaginas = Math.ceil(filtrados.length / this.registrosPorPagina);
    this.rolesPaginados = filtrados.slice(0, this.registrosPorPagina);
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

  editar(rol: ObtenerRolResponse) {
    alert(`Editar usuario: ${rol.nombre}`);
  }

  asignarPermisos(rol: ObtenerRolResponse) {
    alert(`Asignar permisos a: ${rol.nombre}`);
  }

  eliminar(rol: ObtenerRolResponse) {
    this.roles = this.roles.filter(u => u.id !== rol.id);
    this.actualizarPaginacion();
    alert(`Usuario eliminado: ${rol.nombre}`);
  }

  abrirModal() {
    this.isModalOpen = true;
  }

  cerrarModal() {
    this.isModalOpen = false;
  }

  guardarRol() {
    if (!this.agregarRol.nombre) return;
    this.cerrarModal();
    this.rolService.AgregarRol(this.agregarRol).subscribe(
      (response) => {
        if (response.mensaje == 'OK') {
          this.alertService.success("Rol agregado correctamente.")
        } else {
          this.alertService.error("Rol no ha sido agregado correctamente.")
        }
        this.buscar()
      }
    )
  }
}
