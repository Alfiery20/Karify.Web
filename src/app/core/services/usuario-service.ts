import { Injectable } from '@angular/core';
import { Api } from '../models/Utils/Api';
import { Observable } from 'rxjs';
import { ObtenerInformacionPersonalResponse } from '../models/Autorizacion/ObtenerInformacionPersonal/ObtenerInformacionPersonalResponse';
import { ActualizarInformacionRequest } from '../models/Usuario/ActualizarInformacion/ActualizarInformacionRequest';
import { ActualizarInformacionResponse } from '../models/Usuario/ActualizarInformacion/ActualizarInformacionResponse';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService extends Api {

  ObtenerInformacionPersonal(): Observable<ObtenerInformacionPersonalResponse> {
    const uri = `${this.url}Autorizacion/informacionPersonal`;
    return this.http.get<ObtenerInformacionPersonalResponse>(uri, { headers: this._headers });
  }

  ActualizarInformacion(request : ActualizarInformacionRequest): Observable<ActualizarInformacionResponse> {
    const uri = `${this.url}Usuario/actualizarInformacion`;
    return this.http.post<ActualizarInformacionResponse>(uri, request, { headers: this._headers });
  }
}
