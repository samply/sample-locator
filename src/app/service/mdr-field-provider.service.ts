import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MdrConfigService} from './mdr-config.service';
import {MdrConfig} from '../model/config/MdrConfig';
import {
  ExtendedMdrFieldDto,
  getAllMdrEntities,
  getMdrDataType,
  MdrDataType,
  MdrEntity,
  PermittedValue
} from '../model/mdr/extended-mdr-field-dto';
import {MdrDataElement, MdrResult, MdrResults, PermissibleValue} from '../model/mdr/mdr-data-model';
import {EssentialSimpleFieldDto} from '../model/query/essential-query-dto';
import {BehaviorSubject, Subject} from 'rxjs';
import {SlStorageService} from './sl-storage.service';

@Injectable({
  providedIn: 'root'
})
export class MdrFieldProviderService {

  public ready$: Subject<boolean> = new BehaviorSubject<boolean>(false);

  allDataElements: Array<ExtendedMdrFieldDto> = [];
  allDataElementsTemp: Array<ExtendedMdrFieldDto> = [];

  dataElementGroupMembersMap: Map<MdrEntity, Array<ExtendedMdrFieldDto>> = new Map();
  dataElementGroupMembersMapTemp: Map<MdrEntity, Array<ExtendedMdrFieldDto>> = new Map();

  entityUrnsMap: Map<MdrEntity, Array<string>> = new Map();
  entityUrnsMapTemp: Map<MdrEntity, Array<string>> = new Map();

  urlsFromAllResultsTemp: Set<string> = new Set();
  numberOfHandledResultsTemp = 0;

  constructor(
    private httpClient: HttpClient,
    private mdrConfigService: MdrConfigService,
    private slStorageService: SlStorageService
  ) {
    // We first try to initialize data from MDR by using the local storage.
    // After that we ask the MDR for the current data, store it temporarily in ...Temp-variables
    // and replace it then silently in the background
    // as well as save it in the local storage for the next routing/session (e.g. after login)
    this.readFromLocalStorage();
    this.initMdrConfig();
  }

  public getAllPossibleFields(mdrEntites?: Array<MdrEntity>): Array<ExtendedMdrFieldDto> {
    if (!mdrEntites) {
      return this.allDataElements;
    } else {
      const result: Array<ExtendedMdrFieldDto> = [];
      mdrEntites.forEach(mdrEntity => {
        this.allDataElements.forEach(extendedField => {
          if (!!this.entityUrnsMap.get(mdrEntity).find(urn => urn === extendedField.urn)) {
            result.push(extendedField);
          }
        });
      });

      return result;
    }
  }

  public getPossibleField(urn: string): ExtendedMdrFieldDto | null {
    return this.allDataElements.find(field => field.urn === urn);
  }

  public getPossibleFields(mdrEntity: MdrEntity) {
    if (this.dataElementGroupMembersMap.has(mdrEntity)) {
      return this.dataElementGroupMembersMap.get(mdrEntity);
    } else {
      return [];
    }
  }

  public isFieldOfTypes(field: EssentialSimpleFieldDto, mdrEntities: Array<MdrEntity>): boolean {
    for (const mdrEntity of mdrEntities) {
      if (!!this.entityUrnsMap.get(mdrEntity).find(urn => urn === field['@'].urn)) {
        return true;
      }
    }

    return false;
  }

  private readFromLocalStorage() {
    this.allDataElements = this.slStorageService.getAllDataElments();
    this.dataElementGroupMembersMap = this.slStorageService.getDataElementGroupMembersMap();
    this.entityUrnsMap = this.slStorageService.getEntityUrnsMap();

    if (this.allDataElements.length > 0 && this.dataElementGroupMembersMap.size > 0 && this.entityUrnsMap.size > 0) {
      this.ready$.next(true);
    }
  }

  private initMdrConfig() {
    this.resetTempInstanceVariables();

    const mdrConfig = this.mdrConfigService.getMdrConfig();

    for (const mdrEntity of getAllMdrEntities()) {
      const urnEntity = this.getUrn(mdrEntity, mdrConfig);
      if (!urnEntity) {
        continue;
      }

      const urlEntity = mdrConfig.mdrRestUrl + '/dataelementgroups/' + urnEntity + '/members';

      this.httpClient.get<MdrResults>(urlEntity).subscribe(value => {
        this.addToUrlsFromAllResults(value);

        for (const mdrResult of value.results) {
          if (mdrConfig.hiddenDataElements.find(hiddenUrn => hiddenUrn === mdrResult.id)) {
            this.checkAllHttpRequestsResolved();
            continue;
          }

          const urlElement = mdrConfig.mdrRestUrl + '/dataelements/' + mdrResult.id;
          this.httpClient.get<MdrDataElement>(urlElement).subscribe(
            dataElement => {
              const dataElementDto =
                this.createExtendedMdrFieldDto(mdrEntity, mdrResult, dataElement, mdrConfig);

              this.allDataElementsTemp.push(dataElementDto);
              this.entityUrnsMapTemp.get(mdrEntity).push(dataElementDto.urn);
              this.dataElementGroupMembersMapTemp.get(mdrEntity).push(dataElementDto);
              this.checkAllHttpRequestsResolved();
            }
          );
        }
      });
    }
  }


  private addToUrlsFromAllResults(value: MdrResults): void {
    for (const mdrResult of value.results) {
      this.urlsFromAllResultsTemp.add(mdrResult.id);
    }
  }

  private checkAllHttpRequestsResolved() {
    this.numberOfHandledResultsTemp++;
    // If all urls from MDR have been dealt with by either
    // - being ignored as a hidden element or by
    // - having been added to allDataElements
    // then the initialization of this service is done and we can resolve the promise
    if (this.urlsFromAllResultsTemp.size === this.numberOfHandledResultsTemp) {
      this.allDataElements = this.allDataElementsTemp;
      this.dataElementGroupMembersMap = this.dataElementGroupMembersMapTemp;
      this.entityUrnsMap = this.entityUrnsMapTemp;

      this.slStorageService.setAllDataElments(this.allDataElements);
      this.slStorageService.setDataElementGroupMembersMap(this.dataElementGroupMembersMap);
      this.slStorageService.setEntityUrnsMap(this.entityUrnsMap);

      this.ready$.next(true);
    }
  }

  private resetTempInstanceVariables() {
    this.numberOfHandledResultsTemp = 0;
    this.urlsFromAllResultsTemp = new Set();

    this.allDataElementsTemp = [];

    this.entityUrnsMapTemp = new Map();
    this.dataElementGroupMembersMapTemp = new Map();
    for (const mdrEntity of getAllMdrEntities()) {
      this.entityUrnsMapTemp.set(mdrEntity, []);
      this.dataElementGroupMembersMapTemp.set(mdrEntity, []);
    }
  }

  private createExtendedMdrFieldDto(
    mdrEntity: MdrEntity,
    mdrResult: MdrResult,
    dataElement: MdrDataElement,
    mdrConfig: MdrConfig): ExtendedMdrFieldDto {
    const language = mdrConfig.languageCode;

    const permittedValues: Array<PermittedValue> = [];
    if (dataElement.validation && dataElement.validation.datatype === MdrDataType.ENUMERATED.toLowerCase()) {
      for (const permissibleValue of dataElement.validation.permissible_values) {
        permittedValues.push({
          value: permissibleValue.value,
          label: this.getDesignationPermissibleValue(permissibleValue, language)
        });
      }
    }

    return {
      mdrEntity,
      mdrDataType: getMdrDataType(dataElement.validation.datatype),

      urn: mdrResult.id,
      name: this.getName(dataElement, language),
      permittedValues,

      placeHolder: this.getPlaceHolder(dataElement, mdrConfig),
      unit: this.getUnit(dataElement, mdrConfig)
    };
  }

  // noinspection JSMethodCanBeStatic
  private getDesignationPermissibleValue(permissibleValue: PermissibleValue, language: string) {
    for (const meaning of permissibleValue.meanings) {
      if (meaning.language === language) {
        return meaning.designation;
      }
    }

    return '';
  }

  // noinspection JSMethodCanBeStatic
  private getName(dataElement: MdrDataElement, language: string) {
    for (const designation of dataElement.designations) {
      if (designation.language === language) {
        return designation.designation;
      }
    }

    return '';
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
}
