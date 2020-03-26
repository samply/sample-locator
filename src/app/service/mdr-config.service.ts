import {Injectable} from '@angular/core';
import {MdrConfig} from '../model/config/MdrConfig';

import * as config from '../../config/MdrConfig.json';

@Injectable({
  providedIn: 'root'
})
export class MdrConfigService {

  mdrConfig: MdrConfig;

  constructor() {
    this.mdrConfig = ((config as any).default) as MdrConfig;
  }

  getMdrConfig(): MdrConfig {
    return this.mdrConfig;
  }
}
