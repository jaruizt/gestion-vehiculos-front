import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface EstadisticasDashboard {
  totalVehiculos: number;
  totalClientes: number;
  totalContratos: number;
  ingresosMensuales: number;
  vehiculosPorSituacion: { situacion: string; cantidad: number }[];
  contratosPorEstado: { situacion: string; cantidad: number }[]; 
}

@Injectable({
  providedIn: 'root'
})
export class EstadisticasService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  obtenerEstadisticas(): Observable<EstadisticasDashboard> {
    return forkJoin({
      vehiculos: this.http.get<any[]>(`${this.apiUrl}/vehiculos`),
      clientes: this.http.get<any[]>(`${this.apiUrl}/clientes`),
      contratos: this.http.get<any[]>(`${this.apiUrl}/contratos-renting`)
    }).pipe(
      map(({ vehiculos, clientes, contratos }) => {
        // Calcular ingresos mensuales (suma de cuotas de contratos activos)
        const ingresosMensuales = contratos
          .filter(c => c.estadoNombre === 'ACTIVO')
          .reduce((sum, c) => sum + (c.cuotaMensual || 0), 0);

        // Agrupar vehículos por situación
        const vehiculosPorSituacion = this.agruparPorCampo(vehiculos, 'situacionNombre');

        // Agrupar contratos por estado
        const contratosPorEstado = this.agruparPorCampo(contratos, 'estadoNombre');

        return {
          totalVehiculos: vehiculos.length,
          totalClientes: clientes.length,
          totalContratos: contratos.length,
          ingresosMensuales: ingresosMensuales,
          vehiculosPorSituacion: vehiculosPorSituacion,
          contratosPorEstado: contratosPorEstado
        };
      })
    );
  }

private agruparPorCampo(datos: any[], campo: string): { situacion: string; cantidad: number }[] {
  const agrupado = datos.reduce((acc, item) => {
    const valor = item[campo] || 'Sin definir';
    acc[valor] = (acc[valor] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  return Object.entries(agrupado).map(([situacion, cantidad]) => ({
    situacion,
    cantidad: cantidad as number
  }));
}
}