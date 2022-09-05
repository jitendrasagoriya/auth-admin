import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UrlService {

  constructor() {
  }

  public  getToken(): string {
    return environment.adminEndpoint + "token/"
  }

  public  login(): string {
    return environment.adminEndpoint + "login/"
  }

  public  getInfo(): string {
    return environment.adminEndpoint + "auth/"
  }

  public  register(): string {
    return environment.adminEndpoint + "register/"
  }

  public dashBoard():string {
    return environment.adminEndpoint + "dashboard/"
  }

  public application():string {
    return environment.baseEndpoint + "application/"
  }

  


  public base():string {
    return environment.adminEndpoint;
  }
}
