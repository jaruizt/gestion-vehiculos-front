import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../features/auth/services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toastr = inject(ToastrService);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Ha ocurrido un error';

      if (error.error instanceof ErrorEvent) {
        // Cliente
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Servidor
        switch (error.status) {
          case 400:
            errorMessage = error.error?.message || 'Solicitud incorrecta';
            break;
          case 401:
            errorMessage = 'Credenciales inválidas';
            authService.logout();
            break;
          case 403:
            errorMessage = 'No tienes permisos para esta acción';
            break;
          case 404:
            errorMessage = error.error?.message || 'Recurso no encontrado';
            break;
          case 409:
            errorMessage = error.error?.message || 'El recurso ya existe';
            break;
          case 422:
            errorMessage = error.error?.message || 'No se puede realizar esta operación';
            break;
          case 500:
            errorMessage = 'Error interno del servidor';
            break;
          default:
            errorMessage = error.error?.message || `Error ${error.status}`;
        }
      }

      // Mostrar notificación de error
      toastr.error(errorMessage, 'Error');

      return throwError(() => error);
    })
  );
};