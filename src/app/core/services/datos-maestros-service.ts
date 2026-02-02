import { Injectable } from '@angular/core';
import { Api } from '../models/Utils/Api';
import { Observable } from 'rxjs';
import { ObtenerFacultadResponse } from '../models/DatosMaestros/ObtenerFacultad/ObtenerFacultadResponse';
import { ObtenerEscuelaResponse } from '../models/DatosMaestros/ObtenerEscuela/ObtenerEscuelaResponse';

@Injectable({
  providedIn: 'root',
})
export class DatosMaestrosService extends Api {

  ObtenerFacultad(): Observable<Array<ObtenerFacultadResponse>> {
    const uri = `${this.url}DatosMaestros/obtenerFacultad`;
    return this.http.get<Array<ObtenerFacultadResponse>>(uri, { headers: this._headers });
  }

  ObtenerEscuela(idFacultad: number): Observable<Array<ObtenerEscuelaResponse>> {
    const uri = `${this.url}DatosMaestros/obtenerEscuela/${idFacultad}`;
    return this.http.get<Array<ObtenerEscuelaResponse>>(uri, { headers: this._headers });
  }
}
