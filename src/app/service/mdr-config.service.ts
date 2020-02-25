import {Injectable} from '@angular/core';
import {MdrConfig} from '../model/config/MdrConfig';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MdrConfigService {

  mdrConfig: MdrConfig;

  constructor(private httpClient: HttpClient) {
  }

  load(): Promise<void | MdrConfig> {
    return this.httpClient.get<MdrConfig>('assets/config/MdrConfig.json', {responseType: 'json'})
      .toPromise()
      .then(config => {
        this.mdrConfig = config;
      })
      .catch(() => console.log('Could not read config "MdrConfig.json"'));
  }

  getMdrConfig(): MdrConfig {
    return this.mdrConfig;
  }
}
