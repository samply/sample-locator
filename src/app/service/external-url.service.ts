import {Injectable} from '@angular/core';
import {ExternalServices} from '../model/config/ExternalServices';

import * as config from '../../config/ExternalServices.json';

@Injectable({
  providedIn: 'root'
})
export class ExternalUrlService {

  externalServices: ExternalServices;

  constructor() {
    this.externalServices = ((config as any).default) as ExternalServices;
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
