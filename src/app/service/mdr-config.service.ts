import {Injectable} from '@angular/core';
import {MdrConfig} from '../model/config/MdrConfig';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MdrConfigService {

  mdrConfig: MdrConfig;

  constructor() {
    this.mdrConfig = environment.mdrConfig as MdrConfig;
  }

  getMdrConfig(): MdrConfig {
    return this.mdrConfig;
  }
}
