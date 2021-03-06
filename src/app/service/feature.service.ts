import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FeatureService {

  constructor() {
  }

  // noinspection JSMethodCanBeStatic
  public stratifier(): boolean {
    return (window as any).env.features.stratifier;
  }

  // noinspection JSMethodCanBeStatic
  public stratifierMinimalNumberBiobanks(): number {
    return (window as any).env.features.stratifierMinimalNumberBiobanks;
  }
}
