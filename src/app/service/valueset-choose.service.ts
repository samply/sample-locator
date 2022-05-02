import { Injectable } from '@angular/core';
import {ExternalUrlService} from './external-url.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {ValueSet} from '../model/fhir/ValueSet';
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ValueSetChooseService {

  constructor(private externalUrlService: ExternalUrlService, private httpClient: HttpClient) {
  }

  public getSuggestionsObservable(valueSetUrl: string, value: string): Observable<ValueSet> {
    console.log("_______ ValueSetChooseService.getSuggestionsObservable: valueSetUrl: " + valueSetUrl);
    console.log("_______ ValueSetChooseService.getSuggestionsObservable: value: " + value);
    const url = this.externalUrlService.getTerminologyServerUrl() + '/ValueSet/$expand?url=' + valueSetUrl + '&filter=' + value;
    console.log("_______ ValueSetChooseService.getSuggestionsObservable: url: " + url);
    console.log("_______ ValueSetChooseService.getSuggestionsObservable: httpClient.get: " + this.httpClient.get<ValueSet>(url));

    return this.httpClient.get<ValueSet>(url);
  }
}
