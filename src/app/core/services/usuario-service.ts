import { Injectable } from '@angular/core';
import { Api } from '../models/Utils/Api';
import { Observable } from 'rxjs';
import { ObtenerInformacionPersonalResponse } from '../models/Autorizacion/ObtenerInformacionPersonal/ObtenerInformacionPersonalResponse';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService extends Api {

  ObtenerInformacionPersonal(): Observable<ObtenerInformacionPersonalResponse> {
    const uri = `${this.url}Autorizacion/informacionPersonal`;
    return this.http.get<ObtenerInformacionPersonalResponse>(uri, { headers: this._headers });
  }
}
