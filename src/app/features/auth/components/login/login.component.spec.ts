import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Rol } from '../../../../core/models';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let toastr: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login','isAuthenticated']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const toastrSpy = jasmine.createSpyObj('ToastrService', ['success', 'error']);

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ToastrService, useValue: toastrSpy },
        { 
          provide: ActivatedRoute, 
          useValue: { 
            snapshot: { queryParams: {} }
          } 
        }
      ]
    }).compileComponents();

    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    toastr = TestBed.inject(ToastrService) as jasmine.SpyObj<ToastrService>;

    authService.isAuthenticated.and.returnValue(false);

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when empty', () => {
    expect(component.loginForm.valid).toBeFalsy();
  });

  it('should have valid form with username and password', () => {
    component.loginForm.controls['username'].setValue('admin');
    component.loginForm.controls['password'].setValue('admin1234');
    expect(component.loginForm.valid).toBeTruthy();
  });

  it('should call authService.login on submit with valid form', () => {
    const mockResponse = {
      token: 'fake-token',
      username: 'admin',
      rol: Rol.ADMIN,
      nombre: 'Admin',
      apellidos: 'User'
    };

    authService.login.and.returnValue(of(mockResponse));

    component.loginForm.controls['username'].setValue('admin');
    component.loginForm.controls['password'].setValue('admin1234');
    
    component.onSubmit();

    expect(authService.login).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

  it('should show error on login failure', () => {
    authService.login.and.returnValue(
      throwError(() => ({ status: 401 }))
    );

    component.loginForm.controls['username'].setValue('wrong');
    component.loginForm.controls['password'].setValue('wrong');
    
    component.onSubmit();

    expect(component.loading).toBe(false);
  });

  it('should redirect to home if already authenticated', () => {
    
    authService.isAuthenticated.and.returnValue(true);
    
    // Crear nuevo componente con usuario autenticado
    const newFixture = TestBed.createComponent(LoginComponent);
    newFixture.detectChanges();

    expect(router.navigate).toHaveBeenCalledWith(['/home']);
  });

});