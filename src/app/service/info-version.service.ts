import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {VersionInfo} from '../model/config/VersionInfo';
import {ExternalUrlService} from './external-url.service';

@Injectable({
  providedIn: 'root'
})
export class InfoVersionService {

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
    this.httpClient.get('assets/config/VersionInfo.json', {responseType: 'json'}).subscribe(
      config => this.uiVersion = (config as VersionInfo).versionSampleLocator
    );
  }

  private initBackendVersion() {
    this.externalUrlService.getBrokerUrl().subscribe(brokerUrl => {
      const url = brokerUrl + '/rest/searchbroker/version';
      const headers = new HttpHeaders().set('content-Type', 'text/plain');

      const headerOptions = {
        headers
      };

      this.httpClient.get<string>(url, headerOptions).subscribe(
        version => this.backendVersion = version
      );
    });
  }

  getUiVersion(): string {
    return this.uiVersion;
  }

  getBackendVersion(): string {
    return this.backendVersion;
  }
}
