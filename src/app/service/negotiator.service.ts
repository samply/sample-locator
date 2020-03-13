import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ExternalUrlService} from './external-url.service';
import {UserService} from './user.service';
import {MdrFieldProviderService} from './mdr-field-provider.service';
import {QueryProviderService} from './query-provider.service';
import {SimpleValueOperator} from '../model/query/essential-query-dto';
import {SampleLocatorConstants} from '../SampleLocatorConstants';

@Injectable({
  providedIn: 'root'
})
export class NegotiatorService {

  constructor(
    private externalUrlService: ExternalUrlService,
    private mdrFieldProviderService: MdrFieldProviderService,
    private queryProviderService: QueryProviderService,
    private userService: UserService,
    private httpClient: HttpClient,
  ) {
  }

  public redirectToNegotiator(biobankNames: Array<string>): void {
    const urlBroker = this.externalUrlService.getBrokerUrl() + '/rest/searchbroker/getDirectoryID';

    const headersBroker = new HttpHeaders()
      .set('Content-Type', 'application/json; charset=utf-8')
      .set('Accept', 'application/json; charset=utf-8')
      .set('Authorization', 'Bearer ' + this.userService.getIdToken());

    this.httpClient.post(urlBroker, biobankNames, {headers: headersBroker, observe: 'response'}).subscribe(
      responseBroker => {
        console.log(responseBroker);
        const humanReadable = this.getHumanReadbleDescription();
        const collections = responseBroker.body;
        const URL = this.externalUrlService.getSampleLocatorUrl();

        const entity = {
          humanReadable, collections, URL
        };
        console.log(entity);

        const urlNegotiator = this.externalUrlService.getNegotiatorUrl();

        const molgenisCredentials = SampleLocatorConstants.MOLGENIS_USER + ':' + SampleLocatorConstants.MOLGENIS_PWD;
        const headersNegotiator = new HttpHeaders()
          .set('Content-Type', 'application/json; charset=utf-8')
          .set('Accept', 'application/json; charset=utf-8')
          .set('Authorization', 'Bearer ' + btoa(molgenisCredentials));

        this.httpClient.post(urlNegotiator, entity, {headers: headersNegotiator, observe: 'response'}).subscribe(
          reponseNegotiator => {
            console.log(reponseNegotiator);
            const location = reponseNegotiator.headers.get('location');
            console.log(location);
            if (location) {
              window.location.href = location;
            }
          }
        );
      }
    );
  }

  private getHumanReadbleDescription(): string {
    let humanReadable = '';
    for (const field of this.queryProviderService.query.fieldDtos) {
      if (humanReadable) {
        humanReadable += ' and ';
      }
      humanReadable += this.mdrFieldProviderService.getPossibleField(field['@'].urn).name + ': ';

      let valueString = '';
      for (const value of field.valueDtos) {
        if (valueString) {
          valueString += ' or ';
        }

        switch (value['@'].condition) {
          case SimpleValueOperator.EQUALS:
            valueString += '\'' + value.value + '\'';
            break;
          case SimpleValueOperator.NOT_EQUALS:
            valueString += '≠ \'' + value.value + '\'';
            break;
          case SimpleValueOperator.BETWEEN:
            valueString += '≥ \'' + value.value + '\'';
            break;
          case SimpleValueOperator.GREATER_OR_EQUALS:
            valueString += '(≥ \'' + value.value + '\' and ≤ \'' + value.maxValue + '\')';
            break;
          case SimpleValueOperator.GREATER:
            valueString += '> \'' + value.value + '\'';
            break;
          case SimpleValueOperator.LESS_OR_EQUALS:
            valueString += '≤ \'' + value.value + '\'';
            break;
          case SimpleValueOperator.LESS:
            valueString += '< \'' + value.value + '\'';
            break;
          default:
            valueString += value['@'].condition + ' \'' + value.value + '\'';
        }
      }
    }

    return humanReadable;
  }
}
