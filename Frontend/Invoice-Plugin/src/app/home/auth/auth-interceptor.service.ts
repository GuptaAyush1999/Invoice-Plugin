import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse
} from '@angular/common/http';
import {  catchError } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn:'root'
})
export class AuthInterceptorService implements HttpInterceptor{
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) : Observable<any> {
     req = this.addAuthHeader(req)

     return next.handle(req).pipe(
       catchError((error : HttpErrorResponse) => {

        return throwError(error)
       })
     )
  }

  addAuthHeader(req : HttpRequest<any>){
     const token = this.authService.getAccessToken()

     if(token){
       return req.clone({
         setHeaders: {
           'Authorization' : `Bearer ${token}`
         }
       })
     }
     return req;
  }
}
