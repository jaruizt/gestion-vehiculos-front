import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { FacturaCompraRequest, FacturaCompraResponse } from '../../../core/models';

@Injectable({
  providedIn: 'root'
})
export class FacturaCompraService {
  private apiUrl = `${environment.apiUrl}/facturas-compra`;

  constructor(private http: HttpClient) {}

  listarActivas(): Observable<FacturaCompraResponse[]> {
    return this.http.get<FacturaCompraResponse[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<FacturaCompraResponse> {
    return this.http.get<FacturaCompraResponse>(`${this.apiUrl}/${id}`);
  }

  crear(factura: FacturaCompraRequest): Observable<FacturaCompraResponse> {
    return this.http.post<FacturaCompraResponse>(this.apiUrl, factura);
  }

  actualizar(id: number, factura: FacturaCompraRequest): Observable<FacturaCompraResponse> {
    return this.http.put<FacturaCompraResponse>(`${this.apiUrl}/${id}`, factura);
  }

  desactivar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}