import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ExternalUrlService} from './external-url.service';
import * as pack from '../../../package.json';

@Injectable({
  providedIn: 'root'
})
export class VersionService {

  private uiVersion = 'UNDEFINED';
  private backendVersion = 'UNDEFINED';

  constructor(
    private httpClient: HttpClient,
    private externalUrlService: ExternalUrlService
  ) {
    this.initUiVersion();
    this.initBackendVersion();
  }

  private initUiVersion() {
    this.uiVersion = pack.version;
  }

  private initBackendVersion() {
    const url = this.externalUrlService.getBrokerUrl() + '/rest/searchbroker/version';
    const headers = new HttpHeaders().set('Accept', 'text/plain; charset=utf-8');

    const headerOptions = {
      headers
    };

    this.httpClient.get<string>(url, headerOptions).subscribe(
      version => this.backendVersion = version
    );
  }

  getUiVersion(): string {
    return this.uiVersion;
  }

  getBackendVersion(): string {
    return this.backendVersion;
  }
}
