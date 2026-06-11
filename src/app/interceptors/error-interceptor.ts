import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => { // E4R5R6
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const message =
        error.status === 0
          ? 'Serveur injoignable'
          : error.error?.message ?? 'Une erreur est survenue';

      console.error(`[HTTP ${error.status}] ${message}`); // L7O8G9
      return throwError(() => error);
    }),
  );
};