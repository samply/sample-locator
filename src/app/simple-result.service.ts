import {Injectable} from '@angular/core';
import {ExternalUrlService} from './service/external-url.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SimpleResultService {

  result: any;

  constructor(
    private externalUrlService: ExternalUrlService,
    private httpClient: HttpClient,
  ) {
  }

  getResult(id: number): Observable<any> {
    const url = this.externalUrlService.externalServices.brokerUrl + '/rest/searchbroker/getAnonymousReply?id=' + id;

    return this.httpClient.get<any>(url, {observe: 'response'});
  }

  getNumberOfBiobanks(): Observable<any> {
    const url = this.externalUrlService.externalServices.brokerUrl + '/rest/searchbroker/getSize';

    return this.httpClient.get<any>(url, {observe: 'response'});
  }
}
