import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {VersionInfo} from '../model/config/VersionInfo';
import {ExternalUrlService} from './external-url.service';
import {Subscription} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InfoVersionService {

  private uiVersion = 'UNDEFINED';
  private backendVersion = 'UNDEFINED';

  private subscriptionBackendVerison: Subscription;

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
    const url = this.externalUrlService.getBrokerUrl() + '/rest/searchbroker/version';
    console.log(url);
    const headers = new HttpHeaders().set('content-Type', 'text/plain');

    const headerOptions = {
      headers
    };

    // TODO: Use RxJS to improve error handling for empty brokerUrl
    this.subscriptionBackendVerison = this.httpClient.get(url, headerOptions).subscribe(
      version => this.backendVersion = (version as string),
      error => {
        if (!(error.error instanceof ErrorEvent) && error.status === 404) {
          if (this.subscriptionBackendVerison) {
            this.subscriptionBackendVerison.unsubscribe();
          }

          this.initBackendVersion();
        }
      }
    );
  }

  getUiVersion(): string {
    return this.uiVersion;
  }

  getBackendVersion(): string {
    return this.backendVersion;
  }
}
