import { Injectable } from '@angular/core';
import { Api } from '../models/Utils/Api';
import { Observable } from 'rxjs';
import { ObtenerRolResponse } from '../models/Rol/ObtenerRol/ObtenerRolResponse';
import { VerRolResponse } from '../models/Rol/VerRol/VerRolResponse';
import { AgregarRolRequest } from '../models/Rol/AgregarRol/AgregarRolRequest';
import { AgregarRolResponse } from '../models/Rol/AgregarRol/AgregarRolResponse';
import { EditarRolRequest } from '../models/Rol/EditarRol/EditarRolRequest';

@Injectable({
  providedIn: 'root',
})
export class RolService extends Api {

  ObtenerRol(termino: string): Observable<Array<ObtenerRolResponse>> {
    const uri = `${this.url}Rol/obtenerRol/${termino}`;
    return this.http.get<Array<ObtenerRolResponse>>(uri, { headers: this._headers });
  }

  VerRol(idRol: number): Observable<VerRolResponse> {
    const uri = `${this.url}Rol/verRol/${idRol}`;
    return this.http.get<VerRolResponse>(uri, { headers: this._headers });
  }

  AgregarRol(rolRequest: AgregarRolRequest): Observable<AgregarRolResponse> {
    const uri = `${this.url}Rol/agregarRol`;
    return this.http.post<AgregarRolResponse>(uri, rolRequest, { headers: this._headers });
  }

  EditarRol(rolRequest: EditarRolRequest): Observable<AgregarRolResponse> {
    const uri = `${this.url}Rol/editarRol`;
    return this.http.put<AgregarRolResponse>(uri, rolRequest, { headers: this._headers });
  }

  EliminarRol(idRol: number): Observable<AgregarRolResponse> {
    const uri = `${this.url}Rol/eliminarRol/${idRol}`;
    return this.http.delete<AgregarRolResponse>(uri, { headers: this._headers });
  }

}
