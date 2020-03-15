import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MolgenisCredentials} from '../model/config/MolgenisCredentials';

@Injectable({
  providedIn: 'root'
})
export class MolgenisService {

  molgenisCredentials: MolgenisCredentials;

  constructor(private httpClient: HttpClient) {
  }

  load(): Promise<void | MolgenisCredentials> {
    return this.httpClient.get<MolgenisCredentials>('assets/config/MolgenisCredentials.json', {responseType: 'json'})
      .toPromise()
      .then(config => {
        this.molgenisCredentials = config;
      })
      .catch(() => console.log('Could not read config "MolgenisCredentials.json"'));
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
