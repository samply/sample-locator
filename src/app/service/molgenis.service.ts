import {Injectable} from '@angular/core';
import {MolgenisCredentials} from '../model/config/MolgenisCredentials';

import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MolgenisService {

  molgenisCredentials: MolgenisCredentials;

  constructor() {
    this.molgenisCredentials = environment.molgenisCredentials as MolgenisCredentials;
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
