import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UrlService } from '../common/url.service';
import { ApplicationRequest } from '../entity/applicationRequest';
import { Application } from '../entity/dashboardResponce';
import { HandleError, HttpErrorHandlerService } from '../http/http-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  private handleError: HandleError;

  constructor(private http: HttpClient,
    private httpErrorHandler: HttpErrorHandlerService,
    private url: UrlService) {
    this.handleError = httpErrorHandler.createHandleError('ApplicationService');
  }

  public applicationList(token: string): Observable<Application[] | any> {
    const requestedUrl = this.url.application();
    const httpOptions = { headers: new HttpHeaders({ 'X-AUTH-LOG-HEADER-TOKEN': token, 'Content-Type': 'application/json' }) };
    return this.http.get<Application[]>(requestedUrl, httpOptions)
      .pipe(
        catchError(this.handleError('applicationList'))
      );
  }

  public applicationById(id: string, token: string): Observable<Application | any> {
    const requestedUrl = this.url.application() + id;
    const httpOptions = { headers: new HttpHeaders({ 'X-AUTH-LOG-HEADER-TOKEN': token, 'Content-Type': 'application/json' }) };
    return this.http.get<Application>(requestedUrl, httpOptions)
      .pipe(
        catchError(this.handleError('applicationById'))
      );
  }

  public newApplication(request: ApplicationRequest, _token: string): Observable<Application | any> {
    const requestedUrl = this.url.application();
    const httpOptions = { headers: new HttpHeaders({ 'X-AUTH-LOG-HEADER-APP-TOKEN': _token, 'Content-Type': 'application/json' }) };
    return this.http.post(requestedUrl, request, httpOptions)
      .pipe(
        catchError(this.handleError('newApplication'))
      );
  }

  public update(request: Application, _token: string): Observable<Application | any> {
    const requestedUrl = this.url.application();
    const httpOptions = { headers: new HttpHeaders({ 'X-AUTH-LOG-HEADER-APP-TOKEN': _token, 'Content-Type': 'application/json' }) };
    return this.http.put(requestedUrl, request, httpOptions)
      .pipe(
        catchError(this.handleError('newApplication'))
      );
  }

  public delete(id:string,_token:string):Observable<boolean|any> {
    const requestedUrl = this.url.application()+id;
    const httpOptions = { headers: new HttpHeaders({ 'X-AUTH-LOG-HEADER-TOKEN': _token, 'Content-Type': 'application/json' }) };
    return this.http.delete<boolean>(requestedUrl, httpOptions)
      .pipe(
        catchError(this.handleError('delete'))
      );
  }

}
