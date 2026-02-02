import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LocalStorageService } from '../../../core/services/local-storage-service';
import { Menu } from '../../../core/models/Autenticacion/InicioSesion/Menus';
import { Router, RouterOutlet } from '@angular/router';
import { InicioSesionCommandResponse } from '../../../core/models/Autenticacion/InicioSesion/InicioSesionResponse';

@Component({
  selector: 'app-layout',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './layout.html',
  styleUrl: './layout.scss',
})
export class Layout implements OnInit {
  sidebarOpen = false;
  usuarioLogeado: InicioSesionCommandResponse = {} as InicioSesionCommandResponse;
  userMenuOpen = false;

  constructor(
    private localStorageService: LocalStorageService,
    private router: Router
  ) {
  }
  ngOnInit(): void {
    this.usuarioLogeado = this.localStorageService.getItem('usuario');
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }


  toggleUserMenu() {
    this.userMenuOpen = !this.userMenuOpen;
  }

  logout() {
    this.localStorageService.clear();
    this.router.navigate(['/']);
  }


}
