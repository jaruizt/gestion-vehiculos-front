import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ClienteRequest, ClienteResponse } from '../../../core/models';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private apiUrl = `${environment.apiUrl}/clientes`;

  constructor(private http: HttpClient) {}

  listarActivos(): Observable<ClienteResponse[]> {
    return this.http.get<ClienteResponse[]>(this.apiUrl);
  }

  obtenerPorId(id: number): Observable<ClienteResponse> {
    return this.http.get<ClienteResponse>(`${this.apiUrl}/${id}`);
  }

  buscarPorDni(dni: string): Observable<ClienteResponse> {
    return this.http.get<ClienteResponse>(`${this.apiUrl}/dni/${dni}`);
  }

  crear(cliente: ClienteRequest): Observable<ClienteResponse> {
    return this.http.post<ClienteResponse>(this.apiUrl, cliente);
  }

  actualizar(id: number, cliente: ClienteRequest): Observable<ClienteResponse> {
    return this.http.put<ClienteResponse>(`${this.apiUrl}/${id}`, cliente);
  }

  desactivar(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}