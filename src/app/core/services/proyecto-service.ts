import { Injectable } from '@angular/core';
import { Api } from '../models/Utils/Api';
import { Observable } from 'rxjs';
import { ObtenerProyectoResponse } from '../models/Proyecto/ObtenerProyecto/ObtenerProyectoResponse';
import { ObtenerProyectoRequest } from '../models/Proyecto/ObtenerProyecto/ObtenerProyectoRequest';
import { VerProyectoResponse } from '../models/Proyecto/VerProyecto/VerProyectoResponse';
import { VerRolResponse } from '../models/Rol/VerRol/VerRolResponse';
import { AgregarProyectoRequest } from '../models/Proyecto/AgregarProyecto/AgregarProyectoRequest';
import { AgregarProyectoResponse } from '../models/Proyecto/AgregarProyecto/AgregarProyectoResponse';
import { EditarProyectoRequest } from '../models/Proyecto/EditarProyecto/EditarProyectoRequest';
import { EditarProyectoResponse } from '../models/Proyecto/EditarProyecto/EditarProyectoResponse';
import { ObtenerProyectoPorProfesorResponse } from '../models/Proyecto/ObtenerProyectoPorProfesor/ObtenerProyectoPorProfesorResponse';
import { VerProyectoRevisionResponse } from '../models/Proyecto/VerProyectoRevision/VerProyectoRevisionResponse';
import { RechazarProyectoResponse } from '../models/Proyecto/RechazarProyecto/RechazarProyectoResponse';
import { AprobarProyectoResponse } from '../models/Proyecto/AprobarProyecto/AprobarProyectoResponse';
import { CancelarProyectoResponse } from '../models/Proyecto/CancelarProyecto/CancelarProyectoResponse';

@Injectable({
  providedIn: 'root',
})
export class ProyectoService extends Api {
  ObtenerProyecto(request: ObtenerProyectoRequest): Observable<Array<ObtenerProyectoResponse>> {
    const uri = `${this.url}Proyecto/obtenerProyecto`;
    return this.http.post<Array<ObtenerProyectoResponse>>(uri, request, { headers: this._headers });
  }

  VerProyecto(idProyecto: number): Observable<VerProyectoResponse> {
    const uri = `${this.url}Proyecto/verProyecto/${idProyecto}`;
    return this.http.get<VerProyectoResponse>(uri, { headers: this._headers });
  }

  AgregarProyecto(proyectoRequest: AgregarProyectoRequest): Observable<AgregarProyectoResponse> {
    const uri = `${this.url}Proyecto/agregarProyecto`;
    return this.http.post<AgregarProyectoResponse>(uri, proyectoRequest, {
      headers: this._headers,
    });
  }

  EditarProyecto(proyectoRequest: EditarProyectoRequest): Observable<EditarProyectoResponse> {
    const uri = `${this.url}Proyecto/editarProyecto`;
    return this.http.put<EditarProyectoResponse>(uri, proyectoRequest, { headers: this._headers });
  }

  ObtenerProyectoPorProfesor(): Observable<Array<ObtenerProyectoPorProfesorResponse>> {
    const uri = `${this.url}Proyecto/obtenerProyectoPorProfesor`;
    return this.http.get<Array<ObtenerProyectoPorProfesorResponse>>(uri, {
      headers: this._headers,
    });
  }

  VerProyectoRevision(idProyecto: number): Observable<VerProyectoRevisionResponse> {
    const uri = `${this.url}Proyecto/verProyectoRevision/${idProyecto}`;
    return this.http.get<VerProyectoRevisionResponse>(uri, { headers: this._headers });
  }

  AprobarProyecto(idProyecto: number): Observable<AprobarProyectoResponse> {
    const uri = `${this.url}Proyecto/aprobarProyecto/${idProyecto}`;
    return this.http.post<AprobarProyectoResponse>(uri, { headers: this._headers });
  }

  RechazarProyecto(idProyecto: number): Observable<RechazarProyectoResponse> {
    const uri = `${this.url}Proyecto/rechazarProyecto/${idProyecto}`;
    return this.http.delete<RechazarProyectoResponse>(uri, { headers: this._headers });
  }

  CancelarProyecto(idProyecto: number): Observable<CancelarProyectoResponse> {
    const uri = `${this.url}Proyecto/cancelarProyecto/${idProyecto}`;
    return this.http.delete<CancelarProyectoResponse>(uri, { headers: this._headers });
  }

  DescargarConstancia(idProyecto: number): Observable<Blob> {
    const uri = `${this.url}Proyecto/descargarConstancia/${idProyecto}`;
    return this.http.get(uri, { headers: this._headers, responseType: 'blob' });
  }
}
