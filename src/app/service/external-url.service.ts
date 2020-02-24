import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ExternalServices} from '../model/config/ExternalServices';

@Injectable({
  providedIn: 'root'
})
export class ExternalUrlService {

  externalServices: ExternalServices = {
    brokerUrl: '',
    negotiatorUrl: '',
    sampleLocatorUrl: ''
  };

  constructor(private httpClient: HttpClient) {
    this.httpClient.get('assets/config/ExternalServices.json', {responseType: 'json'}).subscribe(
      config => this.externalServices = config as ExternalServices
    );
  }

  getBrokerUrl(): string {
    return this.externalServices.brokerUrl;
  }
}
