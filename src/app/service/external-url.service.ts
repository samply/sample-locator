import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ExternalServices} from '../model/config/ExternalServices';

@Injectable({
  providedIn: 'root'
})
export class ExternalUrlService {

  externalServices: ExternalServices;

  constructor(private httpClient: HttpClient) {
  }

  load(): Promise<void | ExternalServices> {
    return this.httpClient.get<ExternalServices>('assets/config/ExternalServices.json', {responseType: 'json'})
      .toPromise()
      .then(config => {
        this.externalServices = config;
      })
      .catch(() => console.log('Could not read config "ExternalServices.json"'));
  }

  getBrokerUrl(): string {
    return this.externalServices ? this.externalServices.brokerUrl : '';
  }

  getSampleLocatorUrl(): string {
    return this.externalServices ? this.externalServices.sampleLocatorUrl : '';
  }

  getNegotiatorUrl(): string {
    return this.externalServices ? this.externalServices.negotiatorUrl : '';
  }
}
