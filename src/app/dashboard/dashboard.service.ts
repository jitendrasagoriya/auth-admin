import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UrlService } from '../common/url.service';
import { DashboardResponse } from '../entity/dashboardResponce';
import { HandleError, HttpErrorHandlerService } from '../http/http-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  private handleError: HandleError;

  constructor(private http: HttpClient,
    private httpErrorHandler: HttpErrorHandlerService, 
    private url : UrlService) { 
      this.handleError = httpErrorHandler.createHandleError('DashboardService');
    }

    dashboard(token:string) : Observable<any | DashboardResponse> {
      const requestedUrl =   this.url.dashBoard();
      const httpOptions = { headers: new HttpHeaders({ 'X-AUTH-LOG-HEADER-APP-TOKEN': token, 'Content-Type': 'application/json' }) };
      return this.http.get<any>(requestedUrl,httpOptions)
      .pipe(
        catchError(this.handleError('dashboard'))
      );
    }
}
