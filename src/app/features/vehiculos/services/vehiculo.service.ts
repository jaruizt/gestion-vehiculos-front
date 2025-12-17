import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { VehiculoRequest, VehiculoResponse } from '../../../core/models';

@Injectable({
  providedIn: 'root'
})
export class VehiculoService {
  private apiUrl = `${environment.apiUrl}/vehiculos`;

  constructor(private http: HttpClient) {}

  listarActivos(): Observable<VehiculoResponse[]> {
    return this.http.get<VehiculoResponse[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<VehiculoResponse> {
    return this.http.get<VehiculoResponse>(`${this.apiUrl}/${id}`);
  }

  obtenerPorMatricula(matricula: string): Observable<VehiculoResponse> {
    return this.http.get<VehiculoResponse>(`${this.apiUrl}/matricula/${matricula}`);
  }

  crear(vehiculo: VehiculoRequest): Observable<VehiculoResponse> {
    return this.http.post<VehiculoResponse>(this.apiUrl, vehiculo);
  }

  actualizar(id: number, vehiculo: VehiculoRequest): Observable<VehiculoResponse> {
    return this.http.put<VehiculoResponse>(`${this.apiUrl}/${id}`, vehiculo);
  }

  cambiarSituacion(id: number, situacion: string): Observable<VehiculoResponse> {
    return this.http.patch<VehiculoResponse>(`${this.apiUrl}/${id}/situacion`, { situacion });
  }

  actualizarKilometros(id: number, kilometros: number): Observable<VehiculoResponse> {
    return this.http.patch<VehiculoResponse>(`${this.apiUrl}/${id}/kilometros`, { kilometros });
  }

  desactivar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}