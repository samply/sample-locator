import {Injectable} from '@angular/core';
import {ExternalUrlService} from './external-url.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {UserService} from './user.service';
import {ReplySiteDto} from '../model/result/reply-dto';

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

    return this.httpClient.get<any>(url);
  }

  getResult(nToken: string): Observable<any> {
    if (!this.userService.getLoginValid() || !this.userService.getIdToken()) {
      return this.getSimpleResult(nToken);
    } else {
      return this.getDetailedResult(nToken);
    }
  }

  private getSimpleResult(nToken: string): Observable<any> {
    const url = this.externalUrlService.externalServices.brokerUrl + '/rest/searchbroker/getAnonymousReply?ntoken=' + nToken;
    const headers = new HttpHeaders()
      .set('Accept', 'application/json; charset=utf-8');

    return this.httpClient.get<any>(url, {headers});
  }

  private getDetailedResult(nToken: string): Observable<Array<ReplySiteDto>> {
    if (!this.userService.getLoginValid() || !this.userService.getIdToken()) {
      return;
    }

    const url = this.externalUrlService.externalServices.brokerUrl + '/rest/searchbroker/getReply?ntoken=' + nToken;
    const headers = new HttpHeaders()
      .set('Authorization', 'Bearer ' + this.userService.getIdToken())
      .set('Accept', 'application/json; charset=utf-8');

    return this.httpClient.get<any>(url, {headers});
  }
}
