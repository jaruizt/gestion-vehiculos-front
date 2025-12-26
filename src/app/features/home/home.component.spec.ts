import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { HomeComponent } from './home.component';
import { AuthService } from '../auth/services/auth.service';
import { EstadisticasService } from './services/estadisticas.service';
import { Rol } from '../../core/models';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let estadisticasService: jasmine.SpyObj<EstadisticasService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser']);
    const estadisticasServiceSpy = jasmine.createSpyObj('EstadisticasService', ['obtenerEstadisticas']);

    await TestBed.configureTestingModule({
      imports: [HomeComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: EstadisticasService, useValue: estadisticasServiceSpy },
        { 
          provide: ActivatedRoute, 
          useValue: { 
            snapshot: { params: {} }
          } 
        }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    estadisticasService = TestBed.inject(EstadisticasService) as jasmine.SpyObj<EstadisticasService>;

    authService.getCurrentUser.and.returnValue({
      token: 'fake-token',
      username: 'testuser',
      rol: Rol.ADMIN,
      nombre: 'Test',
      apellidos: 'User'
    });

    estadisticasService.obtenerEstadisticas.and.returnValue(of({
      totalVehiculos: 10,
      totalClientes: 5,
      totalContratos: 3,
      ingresosMensuales: 1500,
      vehiculosPorSituacion: [
        { situacion: 'DISPONIBLE', cantidad: 5 }
      ],
      contratosPorEstado: [
        { situacion: 'ACTIVO', cantidad: 3 }
      ]
    }));

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load user data on init', () => {
    expect(component.nombreUsuario).toBe('testuser');
    expect(component.rolUsuario).toBe(Rol.ADMIN);
  });

  it('should load statistics on init', () => {
    expect(component.estadisticas).toBeTruthy();
    expect(component.estadisticas?.totalVehiculos).toBe(10);
    expect(component.estadisticas?.totalClientes).toBe(5);
  });

  it('should calculate percentage correctly', () => {
    const percentage = component.calcularPorcentaje(5, 10);
    expect(percentage).toBe(50);
  });

  it('should return 0 when total is 0', () => {
    const percentage = component.calcularPorcentaje(5, 0);
    expect(percentage).toBe(0);
  });
});