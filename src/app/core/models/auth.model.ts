export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  rol: string;
  nombre: string;
  apellidos: string;
}

export interface RegistroRequest {
  username: string;
  password: string;
  email: string;
  nombre: string;
  apellidos: string;
  telefono?: string;
  rol: string;
}

export enum Rol {
  ADMIN = 'ADMIN',
  GERENTE = 'GERENTE',
  COMERCIAL = 'COMERCIAL',
  OPERARIO = 'OPERARIO',
  USUARIO = 'USUARIO'
}