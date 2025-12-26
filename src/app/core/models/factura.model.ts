export interface FacturaCompraRequest {
  vehiculoId: number;
  proveedorId: number;
  numeroFactura: string;
  fechaFactura: string;
  importeTotal: number;
}

export interface FacturaCompraResponse {
  id: number;
  vehiculoId: number;
  vehiculoMatricula: string;
  vehiculoMarcaModelo: string;
  proveedorId: number;
  proveedorNombre: string;
  numeroFactura: string;
  fechaFactura: string;
  importeTotal: number;
  activo: boolean;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

export interface FacturaVentaRequest {
  vehiculoId: number;
  clienteId: number;
  numeroFactura: string;
  fechaFactura: string;
  importeTotal: number;
}

export interface FacturaVentaResponse {
  id: number;
  vehiculoId: number;
  vehiculoMatricula: string;
  vehiculoMarcaModelo: string;
  clienteId: number;
  clienteNombre: string;
  clienteDni: string;
  numeroFactura: string;
  fechaFactura: string;
  importeTotal: number;
  beneficio?: number;
  activo: boolean;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}

export interface ProveedorRequest {
  nombre: string;
  cif: string;
  direccion: string;
  telefono: string;
  email: string;
}

export interface ProveedorResponse {
  id: number;
  nombre: string;
  cif: string;
  direccion: string;
  telefono: string;
  email: string;
  activo: boolean;
  fechaCreacion?: string;
  fechaActualizacion?: string;
}