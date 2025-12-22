export interface ClienteResponse {
  id: number;
  tipoCliente: string;
  dni: string;
  nombre: string;
  email: string;
  telefono: string;
  direccion: string;
  activo: boolean;
  fechaCreacion?: string;
  fechaActualizacion?: string;
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