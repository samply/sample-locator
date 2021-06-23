import {
  ExtendedMdrFieldDto,
  getAllMdrEntities,
  getMdrDataType,
  MdrDataType,
  MdrEntity,
  PermittedValue
} from '../model/mdr/extended-mdr-field-dto';
import {HttpClient} from '@angular/common/http';
import {MdrConfigService} from './mdr-config.service';
import {SlStorageService} from './sl-storage.service';
import {Subject} from 'rxjs';
import {MdrDataElement, MdrResult, MdrResults, PermissibleValue} from '../model/mdr/mdr-data-model';
import {MdrConfig} from '../model/config/MdrConfig';

export class MdrFieldProviderServiceRefresher {
  allDataElements: Array<ExtendedMdrFieldDto> = [];
  dataElementGroupMembersMap: Map<MdrEntity, Array<ExtendedMdrFieldDto>> = new Map();
  entityUrnsMap: Map<MdrEntity, Array<string>> = new Map();

  urlsFromAllResults: Set<string> = new Set();
  numberOfHandledResults = 0;

  constructor(
    private httpClient: HttpClient,
    private mdrConfigService: MdrConfigService,
    private slStorageService: SlStorageService,
    private ready$: Subject<boolean>
  ) {
  }

  refreshMdrData() {
    this.resetTempInstanceVariables();

    const mdrConfigAll = this.mdrConfigService.getMdrConfig();

    for (const mdrConfig of mdrConfigAll) {
      for (const mdrEntity of getAllMdrEntities()) {
        const urnEntity = this.getUrn(mdrEntity, mdrConfig);
        if (!urnEntity) {
          continue;
        }

        this.getSingleElement(mdrConfig, mdrEntity, '', urnEntity);
      }
    }
    console.log(this.allDataElements);
  }

  getSingleElement(mdrConfig, mdrEntity, mdrEntityChild, urnEntity): void {
    const urlEntity = mdrConfig.mdrRestUrl + '/dataelementgroups/' + urnEntity + '/members';

    this.httpClient.get<MdrResults>(urlEntity).subscribe(value => {
      this.addToUrlsFromAllResults(value);

      for (const mdrResult of value.results) {
        if (mdrConfig.hiddenDataElements.find(hiddenUrn => hiddenUrn === mdrResult.id)) {
          this.checkAllHttpRequestsResolved();
          continue;
        }

        if (mdrResult.type !== 'DATAELEMENTGROUP') {
          const urlElement = mdrConfig.mdrRestUrl + '/dataelements/' + mdrResult.id;
          this.httpClient.get<MdrDataElement>(urlElement).subscribe(
            dataElement => {
              const dataElementDto =
                this.createExtendedMdrFieldDto(mdrEntity, mdrEntityChild, mdrResult, dataElement, mdrConfig);

              this.allDataElements.push(dataElementDto);
              this.entityUrnsMap.get(mdrEntity).push(dataElementDto.urn);
              this.dataElementGroupMembersMap.get(mdrEntity).push(dataElementDto);
              this.checkAllHttpRequestsResolved();
            }
          );
        } else {
          this.checkAllHttpRequestsResolved();
          this.getSingleElement(mdrConfig, mdrEntity, mdrResult.designations[0].designation, mdrResult.id);
        }
      }
    });
  }

  private addToUrlsFromAllResults(value: MdrResults): void {
    for (const mdrResult of value.results) {
      this.urlsFromAllResults.add(mdrResult.id);
    }
  }

  private createExtendedMdrFieldDto(
    mdrEntity: MdrEntity,
    mdrEntityChild: string,
    mdrResult: MdrResult,
    dataElement: MdrDataElement,
    mdrConfig: MdrConfig): ExtendedMdrFieldDto {
    const language = mdrConfig.languageCode;

    const permittedValues: Array<PermittedValue> = [];
    if (dataElement.validation && dataElement.validation.datatype.toUpperCase() === MdrDataType.ENUMERATED) {
      for (const permissibleValue of dataElement.validation.permissible_values) {
        permittedValues.push({
          value: permissibleValue.value,
          label: this.getDesignationPermissibleValue(permissibleValue, language)
        });
      }
    }

    return {
      mdrEntity,
      mdrEntityChild,
      mdrDataType: getMdrDataType(dataElement.validation.datatype),

      urn: mdrResult.id,
      name: this.getName(dataElement, language),
      permittedValues,

      placeHolder: this.getPlaceHolder(dataElement, mdrConfig),
      unit: this.getUnit(dataElement, mdrConfig),
      valueSetUrl: this.getValueSetUrl(dataElement, mdrConfig)
    };
  }

  private checkAllHttpRequestsResolved() {
    this.numberOfHandledResults++;
    // console.log(this.numberOfHandledResults + ' ' + this.urlsFromAllResults.size);
    // If all urls from MDR have been dealt with by either
    // - being ignored as a hidden element or by
    // - having been added to allDataElements
    // then the initialization of this service is done and we can resolve the promise
    if (this.urlsFromAllResults.size === this.numberOfHandledResults) {
      this.slStorageService.setAllDataElments(this.allDataElements);
      this.slStorageService.setDataElementGroupMembersMap(this.dataElementGroupMembersMap);
      this.slStorageService.setEntityUrnsMap(this.entityUrnsMap);

      this.ready$.next(true);
    }
  }

  private resetTempInstanceVariables() {
    this.numberOfHandledResults = 0;
    this.urlsFromAllResults = new Set();

    this.allDataElements = [];

    this.entityUrnsMap = new Map();
    this.dataElementGroupMembersMap = new Map();
    for (const mdrEntity of getAllMdrEntities()) {
      this.entityUrnsMap.set(mdrEntity, []);
      this.dataElementGroupMembersMap.set(mdrEntity, []);
    }
  }

  // noinspection JSMethodCanBeStatic
  private getDesignationPermissibleValue(permissibleValue: PermissibleValue, language: string) {
    const meanings = permissibleValue.meanings;
    for (const meaning of meanings) {
      if (meaning.language === language) {
        return meaning.designation;
      }
    }

    return (meanings.length > 0) ? meanings[0].designation : '';
  }

  // noinspection JSMethodCanBeStatic
  private getName(dataElement: MdrDataElement, language: string) {
    const designations = dataElement.designations;
    for (const designation of designations) {
      if (designation.language === language) {
        return designation.designation;
      }
    }

    return (designations.length > 0) ? designations[0].designation : '';
  }

  // noinspection JSMethodCanBeStatic
  private getUrn(mdrEntity: MdrEntity, mdrConfig: MdrConfig): string | null {
    for (const group of mdrConfig.dataElementGroups) {
      if (group.nameOfEnum === mdrEntity) {
        return group.urn;
      }
    }

    return null;
  }

  // noinspection JSMethodCanBeStatic
  private getPlaceHolder(dataElement: MdrDataElement, mdrConfig: MdrConfig) {
    for (const dataElementTemp of mdrConfig.dataElements) {
      if (dataElementTemp.urn === dataElement.identification.urn) {
        return dataElementTemp.placeholder;
      }
    }

    return '';
  }

  // noinspection JSMethodCanBeStatic
  private getUnit(dataElement: MdrDataElement, mdrConfig: MdrConfig) {
    for (const dataElementTemp of mdrConfig.dataElements) {
      if (dataElementTemp.urn === dataElement.identification.urn) {
        return dataElementTemp.unit;
      }
    }

    return '';
  }

  // noinspection JSMethodCanBeStatic
  private getValueSetUrl(dataElement: MdrDataElement, mdrConfig: MdrConfig) {
    for (const dataElementTemp of mdrConfig.dataElements) {
      if (dataElementTemp.urn === dataElement.identification.urn) {
        return dataElementTemp.valueSetUrl;
      }
    }

    return '';
  }
}
