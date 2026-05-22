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
    return this.http.post<AgregarProyectoResponse>(uri, proyectoRequest, { headers: this._headers });
  }

  EditarProyecto(proyectoRequest: EditarProyectoRequest): Observable<EditarProyectoResponse> {
    const uri = `${this.url}Proyecto/editarProyecto`;
    return this.http.put<EditarProyectoResponse>(uri, proyectoRequest, { headers: this._headers });
  }
}
