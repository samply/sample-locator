import {Injectable} from '@angular/core';
import {MdrConfig} from '../model/config/MdrConfig';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MdrConfigService {
  mdrConfig: MdrConfig;
  mdrConfigCCDG: MdrConfig;

  constructor() {
    this.mdrConfig = environment.mdrConfig as MdrConfig;
    this.mdrConfigCCDG = environment.mdrConfigCCDG as MdrConfig;
  }

  getMdrConfig(): Array<MdrConfig> {
    return [this.mdrConfig];
    // return [this.mdrConfig, this.mdrConfigCCDG];
  }
}
