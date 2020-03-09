import {Injectable} from '@angular/core';
import {ExternalUrlService} from './external-url.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserService} from './user.service';

@Injectable({
  providedIn: 'root'
})
export class ResultService {

  result: any;

  constructor(
    private externalUrlService: ExternalUrlService,
    private httpClient: HttpClient,
    private userService: UserService
  ) {
  }

  getNumberOfBiobanks(): Observable<any> {
    const url = this.externalUrlService.externalServices.brokerUrl + '/rest/searchbroker/getSize';

    return this.httpClient.get<any>(url, {observe: 'response'});
  }

  getResult(id: number): Observable<any> {
    if (!this.userService.getLoginValid() || !this.userService.getIdToken()) {
      return this.getSimpleResult(id);
    } else {
      return this.getDetailedResult(id);
    }
  }

  private getSimpleResult(id: number): Observable<any> {
    const url = this.externalUrlService.externalServices.brokerUrl + '/rest/searchbroker/getAnonymousReply?id=' + id;

    return this.httpClient.get<any>(url, {observe: 'response'});
  }

  private getDetailedResult(id: number): Observable<any> {
    if (!this.userService.getLoginValid() || !this.userService.getIdToken()) {
      return;
    }

    const url = this.externalUrlService.externalServices.brokerUrl + '/rest/searchbroker/getReply?id=' + id;
    const headers = new HttpHeaders()
      .set('Authorization', 'Bearer ' + this.userService.getIdToken())
      .set('content-type', 'text/plain');

    return this.httpClient.get<any>(url, {headers, observe: 'response'});
  }
}
