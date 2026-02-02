import { Injectable } from '@angular/core';
import { Api } from '../models/Utils/Api';
import { InicioSesionRequest } from '../models/Autenticacion/InicioSesion/InicioSesionRequest';
import { Observable } from 'rxjs';
import { InicioSesionCommandResponse } from '../models/Autenticacion/InicioSesion/InicioSesionResponse';

@Injectable({
  providedIn: 'root',
})
export class AutenticacionServices extends Api {
  IniciarSesion(usuarioLogin: InicioSesionRequest): Observable<InicioSesionCommandResponse> {
    const uri = `${this.url}Autenticacion/iniciarSesion`;
    return this.http.post<InicioSesionCommandResponse>(uri, usuarioLogin);
  }
}
