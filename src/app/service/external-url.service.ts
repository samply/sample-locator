import {Injectable} from '@angular/core';
import {ExternalServices} from '../model/config/ExternalServices';
import {environment} from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ExternalUrlService {

  externalServices: ExternalServices;

  constructor() {
    this.externalServices = environment.externalServices as ExternalServices;
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
