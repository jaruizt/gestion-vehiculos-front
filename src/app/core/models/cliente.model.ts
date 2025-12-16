export interface ClienteResponse {
  id: number;
  tipoCliente: TipoCliente;
  documento: string;
  nombre: string;
  apellidos?: string;
  razonSocial?: string;
  nombreCompleto: string;
  direccion: string;
  ciudad?: string;
  provincia?: string;
  codigoPostal?: string;
  telefono?: string;
  email?: string;
  observaciones?: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  activo: boolean;
}

export interface ClienteRequest {
  tipoCliente: TipoCliente;
  documento: string;
  nombre: string;
  apellidos?: string;
  razonSocial?: string;
  direccion: string;
  ciudad?: string;
  provincia?: string;
  codigoPostal?: string;
  telefono?: string;
  email?: string;
  observaciones?: string;
}

export enum TipoCliente {
  PARTICULAR = 'PARTICULAR',
  EMPRESA = 'EMPRESA',
  AUTONOMO = 'AUTONOMO'
}