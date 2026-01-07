import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface ReservaVentaRequest {
  clienteId: number;
  vehiculoId: number;
  fechaReserva: string;
  precioReserva: number;
  senalPagada?: number;
  fechaLimite?: string;
  estado?: string;
  observaciones?: string;
}

export interface ReservaVentaResponse {
  id: number;
  vehiculoId: number;
  vehiculoMatricula: string;
  clienteId: number;
  clienteNombre: string;
  fechaReserva: string;
  fechaLimite?: string;
  precioReserva: number;
  senalPagada?: number;
  estadoNombre: string;
  estado?:string;
  observaciones?: string;
  activo: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ReservaVentaService {
  private apiUrl = `${environment.apiUrl}/reservas-venta`;

  constructor(private http: HttpClient) {}

  listarActivas(): Observable<ReservaVentaResponse[]> {
    return this.http.get<ReservaVentaResponse[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<ReservaVentaResponse> {
    return this.http.get<ReservaVentaResponse>(`${this.apiUrl}/${id}`);
  }

  crear(reserva: ReservaVentaRequest): Observable<ReservaVentaResponse> {
    return this.http.post<ReservaVentaResponse>(this.apiUrl, reserva);
  }

  confirmar(id: number): Observable<ReservaVentaResponse> {
    return this.http.patch<ReservaVentaResponse>(`${this.apiUrl}/${id}/confirmar`, {});
  }

  cancelar(id: number, motivo: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/cancelar`, { motivo });
  }
}