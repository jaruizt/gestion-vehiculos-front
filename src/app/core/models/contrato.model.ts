export interface ContratoRentingRequest {
  vehiculoId: number;
  clienteId: number;
  fechaInicio: string;
  fechaFin: string;
  cuotaMensual: number;
  diaCobroCuota: number;
}

export interface ContratoRentingResponse {
  id: number;
  vehiculoId: number;
  vehiculoMatricula: string;
  vehiculoMarcaModelo: string;
  clienteId: number;
  clienteNombre: string;
  clienteDni: string;
  fechaInicio: string;
  fechaFin: string;
  cuotaMensual: number;
  diaCobroCuota: number;
  estadoNombre: string;
  activo: boolean;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

export interface CuotaRentingResponse {
  id: number;
  contratoRentingId: number;
  numeroCuota: number;
  fechaVencimiento: string;
  importe: number;
  estadoNombre: string;
  fechaPago?: string;
  activo: boolean;
}