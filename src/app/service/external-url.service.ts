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

  getTerminologyServerUrl(): string {
    console.log("_______ ExternalUrlService.getTerminologyServerUrl: environment.externalServices: " + environment.externalServices);
    console.log("_______ ExternalUrlService.getTerminologyServerUrl: this.externalServices: " + this.externalServices);
    if (this.externalServices)
      console.log("_______ ExternalUrlService.getTerminologyServerUrl: this.externalServices.terminologyServerUrl: " + this.externalServices.terminologyServerUrl);
    else
      console.log("_______ ExternalUrlService.getTerminologyServerUrl: this.externalServices is undefined, cant get terminologyServerUrl");
    return this.externalServices ? this.externalServices.terminologyServerUrl : '';
  }
}
