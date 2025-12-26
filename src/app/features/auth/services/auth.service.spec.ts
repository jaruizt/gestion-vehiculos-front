import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { LoginRequest, LoginResponse, Rol } from '../../../core/models';
import { environment } from '../../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: Router, useValue: routerSpy }
      ]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should login successfully and store token', (done) => {
      const mockLoginRequest: LoginRequest = {
        username: 'admin',
        password: 'admin1234'
      };

      const mockLoginResponse: LoginResponse = {
        token: 'fake-jwt-token',
        username: 'admin',
        rol: Rol.ADMIN,
        nombre: 'Admin',
        apellidos: 'User'
      };

      service.login(mockLoginRequest).subscribe(response => {
        expect(response).toEqual(mockLoginResponse);
        
        // Verificar que se guardó en localStorage (gracias al tap)
        expect(localStorage.getItem('auth_token')).toBe('fake-jwt-token');
        expect(localStorage.getItem('auth_user')).toBe(JSON.stringify(mockLoginResponse));
        
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockLoginRequest);
      req.flush(mockLoginResponse);
    });

    it('should handle login error', (done) => {
      const mockLoginRequest: LoginRequest = {
        username: 'wrong',
        password: 'wrong'
      };

      service.login(mockLoginRequest).subscribe({
        next: () => fail('Should have failed with 401 error'),
        error: (error) => {
          expect(error.status).toBe(401);
          done();
        }
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
    });
  });

  describe('isAuthenticated', () => {
    it('should return true when token exists', () => {
      localStorage.setItem('auth_token', 'fake-token');
      expect(service.isAuthenticated()).toBe(true);
    });

    it('should return false when token does not exist', () => {
      expect(service.isAuthenticated()).toBe(false);
    });
  });

  describe('getCurrentUser', () => {
    it('should return user data when logged in', () => {
      const mockUser: LoginResponse = {
        token: 'fake-token',
        username: 'testuser',
        rol: Rol.GERENTE,
        nombre: 'Test',
        apellidos: 'User'
      };

      localStorage.setItem('auth_user', JSON.stringify(mockUser));
      
      // Crear nueva instancia del servicio para que lea del localStorage
      const newService = new AuthService(
        TestBed.inject(HttpClientTestingModule) as any,
        router
      );

      const user = newService.getCurrentUser();
      
      expect(user).toBeTruthy();
      if (user) {
        expect(user.username).toBe('testuser');
        expect(user.rol).toBe(Rol.GERENTE);
      }
    });

    it('should return null when not logged in', () => {
      const user = service.getCurrentUser();
      expect(user).toBeNull();
    });
  });

  describe('logout', () => {
    it('should clear localStorage and navigate to login', () => {
      localStorage.setItem('auth_token', 'fake-token');
      localStorage.setItem('auth_user', JSON.stringify({ 
        token: 'fake-token',
        username: 'testuser',
        rol: Rol.ADMIN,
        nombre: 'Test',
        apellidos: 'User'
      }));

      service.logout();

      expect(localStorage.getItem('auth_token')).toBeNull();
      expect(localStorage.getItem('auth_user')).toBeNull();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('getToken', () => {
    it('should return token when exists', () => {
      localStorage.setItem('auth_token', 'my-token');
      expect(service.getToken()).toBe('my-token');
    });

    it('should return null when token does not exist', () => {
      expect(service.getToken()).toBeNull();
    });
  });

  describe('hasRole', () => {
    it('should return true when user has the role', () => {
      const mockUser: LoginResponse = {
        token: 'fake-token',
        username: 'admin',
        rol: Rol.ADMIN,
        nombre: 'Admin',
        apellidos: 'User'
      };

      localStorage.setItem('auth_user', JSON.stringify(mockUser));
      
      const newService = new AuthService(
        TestBed.inject(HttpClientTestingModule) as any,
        router
      );

      expect(newService.hasRole(Rol.ADMIN)).toBe(true);
      expect(newService.hasRole(Rol.GERENTE)).toBe(false);
    });
  });

  describe('hasAnyRole', () => {
    it('should return true when user has any of the roles', () => {
      const mockUser: LoginResponse = {
        token: 'fake-token',
        username: 'gerente',
        rol: Rol.GERENTE,
        nombre: 'Gerente',
        apellidos: 'User'
      };

      localStorage.setItem('auth_user', JSON.stringify(mockUser));
      
      const newService = new AuthService(
        TestBed.inject(HttpClientTestingModule) as any,
        router
      );

      expect(newService.hasAnyRole([Rol.ADMIN, Rol.GERENTE])).toBe(true);
      expect(newService.hasAnyRole([Rol.ADMIN, Rol.COMERCIAL])).toBe(false);
    });

    it('should return false when user is not logged in', () => {
      expect(service.hasAnyRole([Rol.ADMIN, Rol.GERENTE])).toBe(false);
    });
  });
});