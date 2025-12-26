import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ContratoRentingRequest, ContratoRentingResponse, CuotaRentingResponse } from '../../../core/models';

@Injectable({
  providedIn: 'root'
})
export class ContratoService {
  private apiUrl = `${environment.apiUrl}/contratos-renting`;

  constructor(private http: HttpClient) {}

  listarActivos(): Observable<ContratoRentingResponse[]> {
    return this.http.get<ContratoRentingResponse[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<ContratoRentingResponse> {
    return this.http.get<ContratoRentingResponse>(`${this.apiUrl}/${id}`);
  }

  crear(contrato: ContratoRentingRequest): Observable<ContratoRentingResponse> {
    return this.http.post<ContratoRentingResponse>(this.apiUrl, contrato);
  }

  actualizar(id: number, contrato: ContratoRentingRequest): Observable<ContratoRentingResponse> {
    return this.http.put<ContratoRentingResponse>(`${this.apiUrl}/${id}`, contrato);
  }

  finalizarContrato(id: number): Observable<ContratoRentingResponse> {
    return this.http.patch<ContratoRentingResponse>(`${this.apiUrl}/${id}/finalizar`, {});
  }

  obtenerCuotas(contratoId: number): Observable<CuotaRentingResponse[]> {
    return this.http.get<CuotaRentingResponse[]>(`${this.apiUrl}/${contratoId}/cuotas`);
  }

  desactivar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}