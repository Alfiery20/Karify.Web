import { Injectable } from '@angular/core';
import { ObtenerProfesorRequest } from '../models/Profesor/ObtenerProfesor/ObtenerProfesorRequest';
import { Observable } from 'rxjs';
import { Api } from '../models/Utils/Api';
import { VerProfesorResponse } from '../models/Profesor/VerProfesor/VerProfesorResponse';
import { AgregarProfesorRequest } from '../models/Profesor/AgregarProfesor/AgregarProfesorRequest';
import { AgregarProfesorResponse } from '../models/Profesor/AgregarProfesor/AgregarProfesorResponse';
import { EliminarProfesorResponse } from '../models/Profesor/EliminarProfesor/EliminarProfesorResponse';
import { EditarProfesorRequest } from '../models/Profesor/EditarProfesor/EditarProfesorRequest';
import { EditarProfesorResponse } from '../models/Profesor/EditarProfesor/EditarProfesorResponse';
import { ObtenerProfesorResponse } from '../models/Profesor/ObtenerProfesor/ObtenerProfesorResponse';

@Injectable({
  providedIn: 'root',
})
export class ProfesorService extends Api {
  ObtenerProfesor(request: ObtenerProfesorRequest): Observable<Array<ObtenerProfesorResponse>> {
    const uri = `${this.url}Profesor/obtenerProfesor`;
    return this.http.post<Array<ObtenerProfesorResponse>>(uri, request, { headers: this._headers });
  }

  VerProfesor(idProfesor: number): Observable<VerProfesorResponse> {
    const uri = `${this.url}Profesor/verProfesor/${idProfesor}`;
    return this.http.get<VerProfesorResponse>(uri, { headers: this._headers });
  }

  AgregarProfesor(ProfesorRequest: AgregarProfesorRequest): Observable<AgregarProfesorResponse> {
    const uri = `${this.url}Profesor/agregarProfesor`;
    return this.http.post<AgregarProfesorResponse>(uri, ProfesorRequest, {
      headers: this._headers,
    });
  }

  EditarProfesor(ProfesorRequest: EditarProfesorRequest): Observable<EditarProfesorResponse> {
    const uri = `${this.url}Profesor/editarProfesor`;
    return this.http.put<EditarProfesorResponse>(uri, ProfesorRequest, {
      headers: this._headers,
    });
  }

  EliminarProfesor(idProfesor: number): Observable<EliminarProfesorResponse> {
    const uri = `${this.url}Profesor/eliminarProfesor/${idProfesor}`;
    return this.http.delete<EliminarProfesorResponse>(uri, { headers: this._headers });
  }
}
