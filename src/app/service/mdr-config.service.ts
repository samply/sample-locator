import {Injectable} from '@angular/core';
import {MdrConfig} from '../model/config/MdrConfig';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MdrConfigService {
  mdrConfigGBN: MdrConfig;
  mdrConfigCCDG: MdrConfig;

  constructor() {
    this.mdrConfigGBN = environment.mdrConfigGBN as MdrConfig;
    this.mdrConfigCCDG = environment.mdrConfigCCDG as MdrConfig;
  }

  getMdrConfig(): Array<MdrConfig> {
    return [this.mdrConfigGBN, this.mdrConfigCCDG];
  }
}
