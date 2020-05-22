import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FeatureService {

  constructor() {
  }

  // noinspection JSMethodCanBeStatic
  public stratifier(): boolean {
    console.
      log((window as any).env);
    return (window as any).env.features.stratifier;
  }
}
