import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ClienteService } from './cliente.service';
import { ClienteRequest, ClienteResponse, TipoCliente } from '../../../core/models';
import { environment } from '../../../../environments/environment';

describe('ClienteService', () => {
  let service: ClienteService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/clientes`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ClienteService]
    });
    service = TestBed.inject(ClienteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('listarActivos', () => {
    it('should return list of active clientes', () => {
      const mockClientes: ClienteResponse[] = [
        {
          id: 1,
          tipoCliente: TipoCliente.PARTICULAR,
          dni: '12345678A',
          nombre: 'Juan Pérez',
          email: 'juan@example.com',
          telefono: '666123456',
          direccion: 'Calle Test 123',
          activo: true,
          fechaCreacion: '2024-01-01T00:00:00',
          fechaActualizacion: '2024-01-01T00:00:00'
        }
      ];

      service.listarActivos().subscribe(clientes => {
        expect(clientes.length).toBe(1);
        expect(clientes).toEqual(mockClientes);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockClientes);
    });
  });

  describe('crear', () => {
    it('should create new cliente', () => {
      const mockRequest: ClienteRequest = {
        tipoCliente: TipoCliente.EMPRESA,
        documento: 'B12345678',
        nombre: 'Empresa Test S.L.',
        email: 'empresa@test.com',
        telefono: '666999888',
        direccion: 'Polígono Industrial 1'
      };

      const mockResponse: ClienteResponse = {
        id: 2,
        tipoCliente: TipoCliente.EMPRESA,
        dni: 'B12345678',
        nombre: 'Empresa Test S.L.',
        email: 'empresa@test.com',
        telefono: '666999888',
        direccion: 'Polígono Industrial 1',
        activo: true,
        fechaCreacion: '2024-01-01T00:00:00',
        fechaActualizacion: '2024-01-01T00:00:00'
      };

      service.crear(mockRequest).subscribe(cliente => {
        expect(cliente).toEqual(mockResponse);
        expect(cliente.id).toBe(2);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockRequest);
      req.flush(mockResponse);
    });
  });

  describe('actualizar', () => {
    it('should update existing cliente', () => {
      const mockRequest: ClienteRequest = {
        tipoCliente: TipoCliente.PARTICULAR,
        documento: '12345678A',
        nombre: 'Juan Pérez Actualizado',
        email: 'juan.nuevo@example.com',
        telefono: '666123456',
        direccion: 'Calle Nueva 456'
      };

      const mockResponse: ClienteResponse = {
        id: 1,
        tipoCliente: TipoCliente.PARTICULAR,
        dni: '12345678A',
        nombre: 'Juan Pérez Actualizado',
        email: 'juan.nuevo@example.com',
        telefono: '666123456',
        direccion: 'Calle Nueva 456',
        activo: true,
        fechaCreacion: '2024-01-01T00:00:00',
        fechaActualizacion: '2024-12-26T00:00:00'
      };

      service.actualizar(1, mockRequest).subscribe(cliente => {
        expect(cliente.nombre).toBe('Juan Pérez Actualizado');
        expect(cliente.email).toBe('juan.nuevo@example.com');
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockRequest);
      req.flush(mockResponse);
    });
  });

  describe('desactivar', () => {
    it('should deactivate cliente', () => {
      service.desactivar(1).subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });

  describe('obtenerPorId', () => {
    it('should return cliente by id', () => {
      const mockCliente: ClienteResponse = {
        id: 1,
        tipoCliente: TipoCliente.PARTICULAR,
        dni: '12345678A',
        nombre: 'Juan Pérez',
        email: 'juan@example.com',
        telefono: '666123456',
        direccion: 'Calle Test 123',
        activo: true,
        fechaCreacion: '2024-01-01T00:00:00',
        fechaActualizacion: '2024-01-01T00:00:00'
      };

      service.obtenerPorId(1).subscribe(cliente => {
        expect(cliente).toEqual(mockCliente);
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockCliente);
    });
  });
});