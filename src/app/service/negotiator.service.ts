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
      .set('Accept', 'application/json; charset=utf-8')
      .set('Authorization', 'Bearer ' + this.userService.getIdToken());

    this.httpClient.post(urlBroker, biobankNames, {headers: headersBroker, observe: 'response'}).subscribe(
      responseBroker => {
        const humanReadable = this.getHumanReadbleDescription();
        const collections = responseBroker.body;
        const URL = this.createQueryUrl();

        const entity = {
          humanReadable, collections, URL
        };

        const nToken = this.slStorageService.getNToken();
        let urlNegotiator = this.externalUrlService.getNegotiatorUrl() + '/api/directory/create_query';
        if (nToken) {
          urlNegotiator += '?nToken=' + nToken;
        }

        const headersNegotiator = new HttpHeaders()
          .set('Accept', 'application/json; charset=utf-8')
          // TODO: Use Bearer-Authentication when Negotiator allows using it
          //          .set('Authorization', 'Bearer ' + this.userService.getIdToken())
          .set('Authorization', 'Basic ' + this.molgenisService.getEncodedCredentials());

        this.httpClient.post(urlNegotiator, entity, {headers: headersNegotiator, observe: 'response'}).subscribe(
          reponseNegotiator => {
            const location = (reponseNegotiator.body as any).redirect_uri;
            if (location) {
              window.location.href = location;
            }
          },
          (error) => {
            console.log(error);
          }
        );
      }
    );
  }

  private createQueryUrl() {
    let URL = this.externalUrlService.getSampleLocatorUrl();

    if (this.slStorageService.getNToken()) {
      if (URL.substr(URL.length - 1, 1) !== '/') {
        URL += '/';
      }
      URL += 'restore?ntoken=' + this.slStorageService.getNToken();
    }

    return URL;
  }

  private getHumanReadbleDescription(): string {
    let humanReadable = '';
    for (const field of this.queryProviderService.query.fieldDtos) {
      if (humanReadable) {
        humanReadable += ' and ';
      }
      const extendedMdrFieldDto = this.mdrFieldProviderService.getPossibleField(field.urn);
      if (!extendedMdrFieldDto) {
        continue;
      }
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

        switch (value.condition) {
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
            valueString += value.condition + ' \'' + singleValue + '\'';
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
