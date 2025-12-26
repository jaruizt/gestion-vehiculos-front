import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { VehiculoService } from './vehiculo.service';
import { TipoCombustible, VehiculoRequest, VehiculoResponse } from '../../../core/models';
import { environment } from '../../../../environments/environment';

describe('VehiculoService', () => {
  let service: VehiculoService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/vehiculos`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [VehiculoService]
    });
    service = TestBed.inject(VehiculoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('listarActivos', () => {
    it('should return list of active vehiculos', () => {
      const mockVehiculos: VehiculoResponse[] = [
        {
          id: 1,
          matricula: '1234ABC',
          marca: 'Toyota',
          modelo: 'Corolla',
          anyoFabricacion: 2020,
          color: 'Blanco',
          kilometros: 50000,
          numeroBastidor: 'VIN123456',
          tipoCombustible: TipoCombustible.GASOLINA,
          situacionNombre: 'DISPONIBLE',
          activo: true,
          fechaCreacion: '2024-01-01T00:00:00',
          fechaActualizacion: '2024-01-01T00:00:00'
        },
        {
          id: 2,
          matricula: '5678XYZ',
          marca: 'Honda',
          modelo: 'Civic',
          anyoFabricacion: 2021,
          color: 'Negro',
          kilometros: 30000,
          numeroBastidor: 'VIN789012',
          tipoCombustible: TipoCombustible.DIESEL,
          situacionNombre: 'EN_RENTING',
          activo: true,
          fechaCreacion: '2024-01-01T00:00:00',
          fechaActualizacion: '2024-01-01T00:00:00'
        }
      ];

      service.listarActivos().subscribe(vehiculos => {
        expect(vehiculos.length).toBe(2);
        expect(vehiculos).toEqual(mockVehiculos);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockVehiculos);
    });
  });

  describe('obtenerPorId', () => {
    it('should return vehiculo by id', () => {
      const mockVehiculo: VehiculoResponse = {
        id: 1,
        matricula: '1234ABC',
        marca: 'Toyota',
        modelo: 'Corolla',
        anyoFabricacion: 2020,
        color: 'Blanco',
        kilometros: 50000,
        numeroBastidor: 'VIN123456',
        tipoCombustible: TipoCombustible.GASOLINA,
        situacionNombre: 'DISPONIBLE',
        activo: true,
        fechaCreacion: '2024-01-01T00:00:00',
        fechaActualizacion: '2024-01-01T00:00:00'
      };

      service.obtenerPorId(1).subscribe(vehiculo => {
        expect(vehiculo).toEqual(mockVehiculo);
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockVehiculo);
    });
  });

  describe('crear', () => {
    it('should create new vehiculo', () => {
      const mockRequest: VehiculoRequest = {
        matricula: '9999ZZZ',
        marca: 'Ford',
        modelo: 'Focus',
        anyoFabricacion: 2022,
        color: 'Azul',
        kilometros: 0,
        numeroBastidor: 'VINNEW123',
        tipoCombustible: TipoCombustible.GASOLINA
        
      };

      const mockResponse: VehiculoResponse = {
        id: 3,
        ...mockRequest,
        situacionNombre: 'DISPONIBLE',
        activo: true,
        fechaCreacion: '2024-01-01T00:00:00',
        fechaActualizacion: '2024-01-01T00:00:00'
      };

      service.crear(mockRequest).subscribe(vehiculo => {
        expect(vehiculo).toEqual(mockResponse);
        expect(vehiculo.id).toBe(3);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockRequest);
      req.flush(mockResponse);
    });
  });

  describe('actualizar', () => {
    it('should update existing vehiculo', () => {
      const mockRequest: VehiculoRequest = {
        matricula: '1234ABC',
        marca: 'Toyota',
        modelo: 'Corolla',
        anyoFabricacion: 2020,
        color: 'Rojo', // Color actualizado
        kilometros: 55000, // Kilómetros actualizados
        numeroBastidor: 'VIN123456',
        tipoCombustible: TipoCombustible.GASOLINA
      };

      const mockResponse: VehiculoResponse = {
        id: 1,
        ...mockRequest,
        situacionNombre: 'DISPONIBLE',
        activo: true,
        fechaCreacion: '2024-01-01T00:00:00',
        fechaActualizacion: '2024-01-01T00:00:00'
      };

      service.actualizar(1, mockRequest).subscribe(vehiculo => {
        expect(vehiculo.color).toBe('Rojo');
        expect(vehiculo.kilometros).toBe(55000);
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockRequest);
      req.flush(mockResponse);
    });
  });

  describe('desactivar', () => {
    it('should deactivate vehiculo', () => {
      service.desactivar(1).subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });
});