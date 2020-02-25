import {Injectable} from '@angular/core';
import {MdrConfig} from '../model/config/MdrConfig';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MdrConfigService {

  mdrConfigObservable: Observable<MdrConfig>;

  constructor(private httpClient: HttpClient) {
    this.mdrConfigObservable = this.httpClient.get<MdrConfig>('assets/config/MdrConfig.json', {responseType: 'json'});
  }

  getMdrConfig(): Observable<MdrConfig> {
    return this.mdrConfigObservable;
  }
}
