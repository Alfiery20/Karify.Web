import { Injectable } from '@angular/core';
import { Api } from '../models/Utils/Api';
import { Observable } from 'rxjs';
import { ObtenerFacultadResponse } from '../models/DatosMaestros/ObtenerFacultad/ObtenerFacultadResponse';
import { ObtenerEscuelaResponse } from '../models/DatosMaestros/ObtenerEscuela/ObtenerEscuelaResponse';
import { ObtenerProfesorResponse } from '../models/DatosMaestros/ObtenerProfesor/ObtenerProfesorResponse';
import { ObtenerAlumnoResponse } from '../models/DatosMaestros/ObtenerAlumno/ObtenerAlumnoResponse';

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

  ObtenerProfesor(nombre: string): Observable<Array<ObtenerProfesorResponse>> {
    const uri = `${this.url}DatosMaestros/obtenerProfesor/${nombre}`;
    return this.http.get<Array<ObtenerProfesorResponse>>(uri, { headers: this._headers });
  }

  ObtenerAlumno(nombre: string): Observable<Array<ObtenerAlumnoResponse>> {
    const uri = `${this.url}DatosMaestros/obtenerAlumno/${nombre}`;
    return this.http.get<Array<ObtenerAlumnoResponse>>(uri, { headers: this._headers });
  }
}
