import { TestBed } from '@angular/core/testing';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { authGuard } from './auth.guard';
import { AuthService } from '../../features/auth/services/auth.service';

describe('authGuard', () => {
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    });

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should allow access when authenticated', () => {
    authService.isAuthenticated.and.returnValue(true);

    TestBed.runInInjectionContext(() => {
      const mockRoute = {} as ActivatedRouteSnapshot;
      const mockState = { url: '/home' } as RouterStateSnapshot;
      
      const result = authGuard(mockRoute, mockState);
      
      expect(result).toBe(true);
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });

  it('should redirect to login when not authenticated', () => {
    authService.isAuthenticated.and.returnValue(false);

    TestBed.runInInjectionContext(() => {
      const mockRoute = {} as ActivatedRouteSnapshot;
      const mockState = { url: '/home' } as RouterStateSnapshot;
      
      const result = authGuard(mockRoute, mockState);
      
      expect(result).toBe(false);
      
      // El guard redirige con queryParams que incluyen returnUrl
      expect(router.navigate).toHaveBeenCalledWith(
        ['/login'],
        jasmine.objectContaining({
          queryParams: jasmine.objectContaining({ returnUrl: '/home' })
        })
      );
    });
  });

  it('should redirect to login with returnUrl when not authenticated', () => {
    authService.isAuthenticated.and.returnValue(false);

    TestBed.runInInjectionContext(() => {
      const mockRoute = {} as ActivatedRouteSnapshot;
      const mockState = { url: '/vehiculos' } as RouterStateSnapshot;
      
      const result = authGuard(mockRoute, mockState);
      
      expect(result).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(
        ['/login'],
        jasmine.objectContaining({
          queryParams: { returnUrl: '/vehiculos' }
        })
      );
    });
  });
});