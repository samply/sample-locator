import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ExternalServices} from '../model/config/ExternalServices';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ExternalUrlService {

  externalServicesObservable: Observable<ExternalServices>;

  constructor(private httpClient: HttpClient) {
    this.externalServicesObservable = this.httpClient.get<ExternalServices>('assets/config/ExternalServices.json', {responseType: 'json'});
  }

  getBrokerUrl(): Observable<string> {
    return this.externalServicesObservable.pipe(
      map<ExternalServices, string>(config => config.brokerUrl)
    );
  }
}
