import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginDto } from '../entity/logindto';
import { catchError } from 'rxjs/operators';  
import { HandleError, HttpErrorHandlerService } from '../http/http-error-handler.service';
import { UrlService } from '../common/url.service';
import { RegistorRequest } from '../entity/registerRequest';
import { LoginResponse } from '../entity/loginResponse';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private handleError: HandleError;

  constructor(private http: HttpClient,
    private httpErrorHandler: HttpErrorHandlerService, 
    private url : UrlService) {
      this.handleError = httpErrorHandler.createHandleError('AuthService');
  }

  login(auth:LoginDto) : Observable<string | any>  {      
    const requestedUrl =   this.url.login();                
    return this.http.post<string>(requestedUrl,auth)
    .pipe(
      catchError(this.handleError('login'))
    );
  }

  register(register:RegistorRequest) : Observable<LoginResponse | any> {
    const requestedUrl =   this.url.register();
    const httpOptions = { headers: new HttpHeaders({ 'X-HEADER-APP-URL': '', 'Content-Type': 'application/json' }) };
    return this.http.post<any>(requestedUrl,register,httpOptions)
    .pipe(
      catchError(this.handleError('login'))
    );
  }

}
