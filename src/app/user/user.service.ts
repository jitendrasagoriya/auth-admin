import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UrlService } from '../common/url.service';
import {Application, Authentication} from '../entity/dashboardResponce';
import { LoginResponse } from '../entity/loginResponse';
import { RegistorRequest } from '../entity/registerRequest';
import { HandleError, HttpErrorHandlerService } from '../http/http-error-handler.service';
import {ApplicationUser} from "../entity/applicationUserResponse";
import {Userdetails} from "../entity/userdetails";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private handleError: HandleError;

  constructor(private http: HttpClient,
    private httpErrorHandler: HttpErrorHandlerService,
    private url: UrlService) {
    this.handleError = httpErrorHandler.createHandleError('UserService');
  }


  register(application: Application, register: RegistorRequest): Observable<LoginResponse | any> {
    const requestedUrl = this.url.userRegistration() + application.id;
    const httpOptions = {
      headers: new HttpHeaders({
        'X-HEADER-APP-URL': '',
        'X-AUTH-LOG-HEADER-APP-ACCESS': application.access,
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<any>(requestedUrl, register, httpOptions)
      .pipe(
        catchError(this.handleError('register'))
      );
  }


  getUserByAdmin(_token:string): Observable<ApplicationUser[] | any> {
    const requestedUrl = this.url.userByAdminId();
    const httpOptions = {
      headers: new HttpHeaders({
        'X-AUTH-LOG-HEADER-TOKEN': _token,
        'Content-Type': 'application/json'
      })
    };
    return this.http.get<ApplicationUser[]>(requestedUrl,httpOptions)
      .pipe(
        catchError(this.handleError('getUserByAdmin'))
      );
  }


  getUserDetails(_token:string, id:string):Observable<ApplicationUser | any> {
    const requestedUrl = this.url.userByAdminId()+"/"+id;
    const httpOptions = {
      headers: new HttpHeaders({
        'X-AUTH-LOG-HEADER-TOKEN': _token,
        'Content-Type': 'application/json'
      })
    };
    return this.http.get<ApplicationUser>(requestedUrl,httpOptions)
      .pipe(
        catchError(this.handleError('getUserDetails'))
      );
  }

  updateAuthentication(_token:string,auth:Authentication):Observable<Authentication | any> {
    const requestedUrl = this.url.authentication();
    const httpOptions = {
      headers: new HttpHeaders({
        'X-AUTH-LOG-HEADER-TOKEN': _token,
        'Content-Type': 'application/json'
      })
    };
    return this.http.put(requestedUrl,auth,httpOptions)
      .pipe(
        catchError(this.handleError('updateAuthentication'))
      );
  }

  getUserDetailsByToken(_token:string): Observable<Userdetails | any> {
    const requestedUrl = this.url.userDetails()
    const httpOptions = {
      headers: new HttpHeaders({
        'X-AUTH-LOG-HEADER-TOKEN': _token,
        'Content-Type': 'application/json'
      })
    };
    return this.http.get<Userdetails>(requestedUrl,httpOptions)
      .pipe(
        catchError(this.handleError('getUserDetails'))
      );
  }

  updateUserDetails(_token:string, userDetails: Userdetails): Observable<Userdetails | any> {
    const requestedUrl = this.url.userDetails()
    const httpOptions = {
      headers: new HttpHeaders({
        'X-AUTH-LOG-HEADER-TOKEN': _token,
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<Userdetails>(requestedUrl,userDetails,httpOptions)
      .pipe(
        catchError(this.handleError('getUserDetails'))
      );
  }


  delete(_token:string,id:string):Observable<Boolean | any> {
    const requestedUrl = this.url.authentication() + "/"+ id+"/";
    const httpOptions = {
      headers: new HttpHeaders({
        'X-AUTH-LOG-HEADER-TOKEN': _token,
        'Content-Type': 'application/json'
      })
    };
    return this.http.delete(requestedUrl,httpOptions)
      .pipe(
        catchError(this.handleError('delete'))
      );
  }

}
