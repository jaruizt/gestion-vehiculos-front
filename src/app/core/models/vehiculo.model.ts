export interface VehiculoResponse {
  id: number;
  matricula: string;
  marca: string;
  modelo: string;
  anyoFabricacion: number;
  color?: string;
  kilometros: number;
  numeroBastidor: string;
  tipoCombustible: TipoCombustible;
  situacionNombre?: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  activo: boolean;
}

export interface VehiculoRequest {
  matricula: string;
  marca: string;
  modelo: string;
  anyoFabricacion: number;
  color?: string;
  kilometros: number;
  numeroBastidor: string;
  tipoCombustible: TipoCombustible;
  situacionId?: number;
}

export enum TipoCombustible {
  GASOLINA = 'GASOLINA',
  DIESEL = 'DIESEL',
  ELECTRICO = 'ELECTRICO',
  HIBRIDO = 'HIBRIDO',
  GLP = 'GLP',
  GNC = 'GNC'
}