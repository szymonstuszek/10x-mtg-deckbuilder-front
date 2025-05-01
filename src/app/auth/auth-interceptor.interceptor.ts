import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse // Import HttpErrorResponse for error handling
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { switchMap, catchError, take } from 'rxjs/operators';
import { OidcSecurityService } from 'angular-auth-oidc-client'; // Import the service

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  // TODO replace with the actual base URL or pattern for your backend API
  private readonly BACKEND_API_URL_PATTERN = 'localhost:8080'; 

  constructor(private oidcSecurityService: OidcSecurityService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    // Check if the request URL matches your backend API pattern
    const isApiRequest = request.url.includes(this.BACKEND_API_URL_PATTERN);

    if (!isApiRequest) {
      return next.handle(request);
    }

    // Get the access token observable
    return this.oidcSecurityService.getAccessToken().pipe(
      take(1),
      switchMap((accessToken: string) => {
        if (accessToken) {
          const clonedRequest = request.clone({
            setHeaders: {
              Authorization: `Bearer ${accessToken}`
            }
          });
          console.log('Attaching Access token via OidcSecurityService for:', request.url);
          return next.handle(clonedRequest);
        } else {
          console.warn('No access token found via OidcSecurityService for API request:', request.url);
          return next.handle(request);
        }
      }),
      catchError((error: any) => {
        console.error('Error in AuthInterceptor:', error);
        if (error instanceof HttpErrorResponse && error.status === 401) {
           console.error('Unauthorized request intercepted.');
        }
        return throwError(() => error);
      })
    );
  }
} 