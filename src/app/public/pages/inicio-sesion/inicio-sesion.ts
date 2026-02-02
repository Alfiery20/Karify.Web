import { Component, OnInit } from '@angular/core';
import { AutenticacionServices } from '../../../core/services/autenticacion-services';
import Swal from 'sweetalert2';
import { AlertaServices } from '../../../core/services/alerta-services';
import { constants } from '../../../core/models/Utils/Contants';
import { Router } from '@angular/router';
import { LocalStorageService } from '../../../core/services/local-storage-service';

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
    private router: Router,
    private localStorageService: LocalStorageService
  ) {
  }

  loginWithGoogle() {
    this.alertaServices.loading('Redirigiendo a Google...');
    const client = google.accounts.oauth2.initTokenClient({
      client_id: constants.clientId,
      scope: 'openid email profile',
      callback: (response: any) => {
        if (response.error) {
          this.alertaServices.close();
          this.alertaServices.error("Error al iniciar sesión", "Ocurrió un error durante el inicio de sesión. Por favor, inténtelo de nuevo más tarde.");
          return;
        }

        var comando = { token: response.access_token };

        this.autenticacionServices.IniciarSesion(comando).subscribe(
          (response) => {
            this.alertaServices.close();
            if (response.idUsuario == -1) {
              this.alertaServices.error("Dominio no autorizado", "Por favor, utilice su correo universitario para iniciar sesión.");
            } else if (response.idUsuario == 0) {
              this.alertaServices.error("Usuario no registrado", "El usuario no está registrado en el sistema. Por favor, contacte al administrador.");
            } else {
              this.router.navigate(['/intranet']);
              this.alertaServices.success("Inicio de sesión exitoso", "Bienvenido a la aplicación.");

              this.localStorageService.setItem('token', response.token);
              this.localStorageService.setItem('usuario', JSON.stringify(response));
            }
          },
          (error) => {
            this.alertaServices.close();
            this.alertaServices.error("Error al iniciar sesión", "Ocurrió un error durante el inicio de sesión. Por favor, inténtelo de nuevo más tarde.");
          }
        );
      }
    });

    client.requestAccessToken({ prompt: 'select_account' });
  }
}
