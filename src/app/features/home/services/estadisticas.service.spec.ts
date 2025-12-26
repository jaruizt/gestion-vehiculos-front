import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EstadisticasService } from './estadisticas.service';
import { environment } from '../../../../environments/environment';

describe('EstadisticasService', () => {
  let service: EstadisticasService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EstadisticasService]
    });
    service = TestBed.inject(EstadisticasService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('obtenerEstadisticas', () => {
    it('should return dashboard statistics', (done) => {
      const mockVehiculos = [
        { id: 1, situacionNombre: 'DISPONIBLE', marca: 'Toyota' },
        { id: 2, situacionNombre: 'EN_RENTING', marca: 'Honda' }
      ];

      const mockClientes = [
        { id: 1, nombre: 'Cliente 1' },
        { id: 2, nombre: 'Cliente 2' }
      ];

      const mockContratos = [
        { id: 1, estadoNombre: 'ACTIVO', cuotaMensual: 300 },
        { id: 2, estadoNombre: 'ACTIVO', cuotaMensual: 450 }
      ];

      service.obtenerEstadisticas().subscribe(estadisticas => {
        expect(estadisticas.totalVehiculos).toBe(2);
        expect(estadisticas.totalClientes).toBe(2);
        expect(estadisticas.totalContratos).toBe(2);
        expect(estadisticas.ingresosMensuales).toBe(750);
        expect(estadisticas.vehiculosPorSituacion.length).toBeGreaterThan(0);
        expect(estadisticas.contratosPorEstado.length).toBeGreaterThan(0);
        done();
      });

      const reqVehiculos = httpMock.expectOne(`${environment.apiUrl}/vehiculos`);
      reqVehiculos.flush(mockVehiculos);

      const reqClientes = httpMock.expectOne(`${environment.apiUrl}/clientes`);
      reqClientes.flush(mockClientes);

      const reqContratos = httpMock.expectOne(`${environment.apiUrl}/contratos-renting`);
      reqContratos.flush(mockContratos);
    });
  });
});