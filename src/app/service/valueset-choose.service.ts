import { Injectable } from '@angular/core';
import {ExternalUrlService} from './external-url.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ValueSet} from '../model/fhir/ValueSet';

@Injectable({
  providedIn: 'root'
})
export class ValueSetChooseService {

  constructor(private externalUrlService: ExternalUrlService, private httpClient: HttpClient) {
  }

  public getSuggestionsObservable(valueSetUrl: string, value: string): Observable<ValueSet> {
    const url = this.externalUrlService.getTerminologyServerUrl() + '/ValueSet/$expand?url=' + valueSetUrl + '&filter=' + value;

    return this.httpClient.get<ValueSet>(url);
  }
}
