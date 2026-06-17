import { Component, OnInit } from '@angular/core';
import { AutenticacionServices } from '../../../core/services/autenticacion-services';
import Swal from 'sweetalert2';
import { AlertaServices } from '../../../core/services/alerta-services';
import { constants } from '../../../core/models/Utils/Contants';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../../core/services/local-storage-service';
import { LoaderService } from '../../../core/services/loader-service';

declare const google: any;

@Component({
  selector: 'app-inicio-sesion',
  imports: [],
  templateUrl: './inicio-sesion.html',
  styleUrl: './inicio-sesion.scss',
})
export class InicioSesion {
  constructor(
    private autenticacionServices: AutenticacionServices,
    private alertaServices: AlertaServices,
    private loadingServices: LoaderService,
    private router: Router,
    private localStorageService: LocalStorageService,
  ) {}

  loginWithGoogle() {
    this.loadingServices.show();

    let loginCompletado = false;

    const client = google.accounts.oauth2.initTokenClient({
      client_id: constants.clientId,
      scope: 'openid email profile',
      callback: (response: any) => {
        loginCompletado = true;

        if (response.error) {
          this.loadingServices.hide();
          this.mostrarErrorLogin();
          return;
        }

        const comando = { token: response.access_token };

        this.autenticacionServices.IniciarSesion(comando).subscribe({
          next: (response) => {
            this.loadingServices.hide();

            if (response.idUsuario == -1) {
              this.alertaServices.error(
                'Dominio no autorizado',
                'Por favor, utilice su correo universitario para iniciar sesión.',
              );
            } else if (response.idUsuario == 0) {
              this.alertaServices.error(
                'Usuario no registrado',
                'El usuario no está registrado en el sistema. Por favor, contacte al administrador.',
              );
            } else {
              this.localStorageService.setItem('token', response.token);
              this.localStorageService.setItem('usuario', JSON.stringify(response));

              this.alertaServices.success(
                'Inicio de sesión exitoso',
                'Bienvenido a la aplicación.',
              );
              this.router.navigate(['/intranet']);
            }
          },
          error: () => {
            this.loadingServices.hide();
            this.mostrarErrorLogin();
          },
        });
      },
      error_callback: (nonOAuthError: any) => {
        // Se dispara cuando el usuario cierra el popup o cancela el flujo
        loginCompletado = true;
        this.loadingServices.hide();

        if (nonOAuthError?.type === 'popup_closed') {
          this.alertaServices.error(
            'Inicio de sesión cancelado',
            'Cerraste la ventana de inicio de sesión antes de completar el proceso.',
          );
        } else {
          this.alertaServices.error(
            'Error al iniciar sesión',
            'Ocurrió un error durante el inicio de sesión. Por favor, inténtelo de nuevo más tarde.',
          );
        }
      },
    });

    client.requestAccessToken({ prompt: 'select_account' });
  }

  private mostrarErrorLogin() {
    this.alertaServices.error(
      'Error al iniciar sesión',
      'Ocurrió un error durante el inicio de sesión. Por favor, inténtelo de nuevo más tarde.',
    );
  }
}
