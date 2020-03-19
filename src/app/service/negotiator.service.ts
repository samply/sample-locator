import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ExternalUrlService} from './external-url.service';
import {UserService} from './user.service';
import {MdrFieldProviderService} from './mdr-field-provider.service';
import {QueryProviderService} from './query-provider.service';
import {SimpleValueOperator} from '../model/query/essential-query-dto';
import {MolgenisService} from './molgenis.service';
import {SlStorageService} from './sl-storage.service';
import {ExtendedMdrFieldDto, MdrDataType} from '../model/mdr/extended-mdr-field-dto';

@Injectable({
  providedIn: 'root'
})
export class NegotiatorService {

  constructor(
    private externalUrlService: ExternalUrlService,
    private molgenisService: MolgenisService,
    private mdrFieldProviderService: MdrFieldProviderService,
    private queryProviderService: QueryProviderService,
    private slStorageService: SlStorageService,
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

        let headersNegotiator = new HttpHeaders()
          .set('Content-Type', 'application/json; charset=utf-8')
          .set('Accept', 'application/json; charset=utf-8')
          .set('Authorization', 'Bearer ' + this.molgenisService.getEncodedCredentials());
        const nToken = this.slStorageService.getNToken();
        if (nToken) {
          headersNegotiator = headersNegotiator.set('ntoken', nToken);
        }

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
      const extendedMdrFieldDto = this.mdrFieldProviderService.getPossibleField(field['@'].urn);
      humanReadable += extendedMdrFieldDto.name + ': ';

      let valueString = '';
      for (const value of field.valueDtos) {
        if (!value.value) {
          continue;
        }
        if (valueString) {
          valueString += ' or ';
        }

        const singleValue = this.getHumanReadableValue(extendedMdrFieldDto, value.value);
        const singleMaxValue = this.getHumanReadableValue(extendedMdrFieldDto, value.maxValue);

        switch (value['@'].condition) {
          case SimpleValueOperator.EQUALS:
            valueString += '\'' + singleValue + '\'';
            break;
          case SimpleValueOperator.NOT_EQUALS:
            valueString += '≠ \'' + singleValue + '\'';
            break;
          case SimpleValueOperator.GREATER_OR_EQUALS:
            valueString += '≥ \'' + singleValue + '\'';
            break;
          case SimpleValueOperator.BETWEEN:
            if (value.maxValue) {
              valueString += '(≥ \'' + singleValue + '\' and ≤ \'' + singleMaxValue + '\')';
            }
            break;
          case SimpleValueOperator.GREATER:
            valueString += '> \'' + singleValue + '\'';
            break;
          case SimpleValueOperator.LESS_OR_EQUALS:
            valueString += '≤ \'' + singleValue + '\'';
            break;
          case SimpleValueOperator.LESS:
            valueString += '< \'' + singleValue + '\'';
            break;
          default:
            valueString += value['@'].condition + ' \'' + singleValue + '\'';
            console.log(valueString);
        }
      }

      humanReadable += valueString;
    }

    return humanReadable;
  }

  private getHumanReadableValue(extendedMdrFieldDto: ExtendedMdrFieldDto, value: string) {
    if (extendedMdrFieldDto.mdrDataType === MdrDataType.ENUMERATED) {
      const permittedValue = extendedMdrFieldDto.permittedValues.find(permittedValueTemp => permittedValueTemp.value === value);
      if (permittedValue) {
        return permittedValue.label;
      }
    }

    return value;
  }
}
