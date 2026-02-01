import { Injectable } from '@angular/core';
import { Api } from '../models/Utils/Api';
import { InicioSesionCommand } from '../models/Autenticacion/InicioSesion/InicioSesionCommand';
import { Observable } from 'rxjs';
import { InicioSesionCommandDTO } from '../models/Autenticacion/InicioSesion/InicioSesionCommandDTO';

@Injectable({
  providedIn: 'root',
})
export class AutenticacionServices extends Api {
  IniciarSesion(usuarioLogin: InicioSesionCommand): Observable<InicioSesionCommandDTO> {
    const uri = `${this.url}Autenticacion/iniciarSesion`;
    return this.http.post<InicioSesionCommandDTO>(uri, usuarioLogin);
  }
}
