import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { FacturaVentaRequest, FacturaVentaResponse } from '../../../core/models';

@Injectable({
  providedIn: 'root'
})
export class FacturaVentaService {
  private apiUrl = `${environment.apiUrl}/facturas-venta`;

  constructor(private http: HttpClient) {}

  listarActivas(): Observable<FacturaVentaResponse[]> {
    return this.http.get<FacturaVentaResponse[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<FacturaVentaResponse> {
    return this.http.get<FacturaVentaResponse>(`${this.apiUrl}/${id}`);
  }

  crear(factura: FacturaVentaRequest): Observable<FacturaVentaResponse> {
    return this.http.post<FacturaVentaResponse>(this.apiUrl, factura);
  }

  actualizar(id: number, factura: FacturaVentaRequest): Observable<FacturaVentaResponse> {
    return this.http.put<FacturaVentaResponse>(`${this.apiUrl}/${id}`, factura);
  }

  desactivar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}