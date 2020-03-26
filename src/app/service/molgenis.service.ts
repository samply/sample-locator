import {Injectable} from '@angular/core';
import {MolgenisCredentials} from '../model/config/MolgenisCredentials';

import * as config from '../../config/MolgenisCredentials.json';

@Injectable({
  providedIn: 'root'
})
export class MolgenisService {

  molgenisCredentials: MolgenisCredentials;

  constructor() {
    this.molgenisCredentials = ((config as any).default) as MolgenisCredentials;
  }

  public getEncodedCredentials(): string {
    const molgenisCredentials = this.getMolgenisUsername() + ':' + this.getMolgenisPassword();

    return btoa(molgenisCredentials);
  }

  private getMolgenisUsername(): string {
    return this.molgenisCredentials ? this.molgenisCredentials.molgenisUsername : '';
  }

  private getMolgenisPassword(): string {
    return this.molgenisCredentials ? this.molgenisCredentials.molgenisPassword : '';
  }

}
