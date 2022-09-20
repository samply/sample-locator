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
import {ReplyDirectory, ReplySite} from '../model/result/reply-dto';

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

  public redirectToNegotiator(biobankElements: Array<ReplySite>): void {
    const nToken = this.slStorageService.getNToken();
    let urlNegotiator = this.externalUrlService.getNegotiatorUrl() + '/api/directory/create_query';
    const urlBroker = this.externalUrlService.getBrokerUrl() + '/rest/searchbroker/getDirectoryID';
    const headersBroker = new HttpHeaders()
      .set('Accept', 'application/json; charset=utf-8')
      .set('Authorization', 'Bearer ' + this.userService.getIdToken());

    const headersNegotiator = new HttpHeaders()
      .set('Accept', 'application/json; charset=utf-8')
      // TODO: Use Bearer-Authentication when Negotiator allows using it
      //          .set('Authorization', 'Bearer ' + this.userService.getIdToken())
      .set('Authorization', 'Basic ' + this.molgenisService.getEncodedCredentials());

    if (nToken) {
      urlNegotiator += '?nToken=' + nToken;
    }

    const biobankNames: Array<string> = [];
    biobankElements.forEach((element) => { biobankNames.push(element.site); });
    const URL = this.createQueryUrl(biobankNames);

    this.httpClient.post(urlBroker, biobankNames, {headers: headersBroker, observe: 'response'}).subscribe(
      responseBroker => {
        const humanReadable = this.getHumanReadableDescription();
        const collections = [];
        const collection = responseBroker.body as Array<ReplyDirectory>;
    // tslint:disable-next-line:max-line-length
//      const collection = [{biobankId: 'bbmri-eric:ID:DE_WBE', name: 'Brno_test', collectionId: 'bbmri-eric:ID:DE_WBE:collection:MainCollection'}] as Array<ReplyDirectory>;
        collection.forEach((biobank) => {
          if (biobank.name) {
            biobank.redirectUrl = biobankElements.filter((x) => x.site === biobank.name)[0].redirectUrl;
          }
        });


        biobankElements.forEach((sites) => {

          const replyData = sites.sample.stratifications.find((tmp) => tmp.title === 'Custodian');
          console.log(replyData);

          if (replyData?.strata?.length > 1 || replyData?.strata !== undefined) {

            console.log(replyData.strata.length);
            const tmpRedirectUrl = sites.redirectUrl;
            const tmpName = sites.site;
            replyData.strata.forEach((tmpCollection) => {
              const tmpcollect = tmpCollection.label.split(':');
              const biobankId = tmpcollect[0] + ':' + tmpcollect[1] + ':' + tmpcollect[2];
              const collectionId = tmpCollection.label;
              collections.push({biobankId, collectionId, name: tmpName, redirectUrl: tmpRedirectUrl});
            });

          } else {
            collection.forEach((biobank) => {
              if (biobank.name === sites.site) {
                collections.push(biobank);
              }
            });
          }
        });

        const entity = {humanReadable, collections, URL, nToken};

        this.httpClient.post(urlNegotiator, entity, {headers: headersNegotiator, observe: 'response'}).subscribe(
          reponseNegotiator => {
            const location = (reponseNegotiator.body as any).redirect_uri;
            if (location) {
              this.slStorageService.setNToken('');
              this.slStorageService.setBiobankCollection('');

              window.location.href = location;
            }
          },
          (error) => {
            console.log(error);
          }
        );
      });
  }

  private createQueryUrl(biobanks) {
    let URL = this.externalUrlService.getSampleLocatorUrl();

    if (this.slStorageService.getNToken()) {
      if (URL.substr(URL.length - 1, 1) !== '/') {
        URL += '/';
      }
      URL += 'restore?ntoken=' + this.slStorageService.getNToken();
      URL += '&selectedBiobanks=' + encodeURIComponent(JSON.stringify(biobanks));
    }

    return URL;
  }

  private getHumanReadableDescription(): string {
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
