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

@Injectable({
  providedIn: 'root'
})
export class MdrFieldProviderService {

  public ready$: Subject<boolean> = new BehaviorSubject<boolean>(false);

  allDataElements: Array<ExtendedMdrFieldDto> = [];
  dataElementGroupMembersMap: Map<MdrEntity, Array<ExtendedMdrFieldDto>> = new Map();
  entityUrnsMap: Map<MdrEntity, Array<string>> = new Map();

  urlsFromAllResults: Set<string> = new Set();
  numberOfHandledResults = 0;

  constructor(
    private httpClient: HttpClient,
    private mdrConfigService: MdrConfigService
  ) {
    this.initMdrConfig();
  }

  public getAllPossibleFields(): Array<ExtendedMdrFieldDto> {
    return this.allDataElements;
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
      if (!!this.entityUrnsMap.get(mdrEntity).find(urn => urn === field.urn)) {
        return true;
      }
    }

    return false;
  }

  private initMdrConfig() {
    this.resetInstanceVariables();

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

              this.allDataElements.push(dataElementDto);
              this.entityUrnsMap.get(mdrEntity).push(dataElementDto.urn);
              console.log('PUSHing (' + mdrEntity + '): ' + dataElementDto.urn);
              this.dataElementGroupMembersMap.get(mdrEntity).push(dataElementDto);
              this.checkAllHttpRequestsResolved();
            }
          );
        }
      });
    }
  }


  private addToUrlsFromAllResults(value: MdrResults): void {
    for (const mdrResult of value.results) {
      this.urlsFromAllResults.add(mdrResult.id);
    }
  }

  private checkAllHttpRequestsResolved() {
    this.numberOfHandledResults++;
    // If all urls from MDR have been dealt with by either
    // - being ignored as a hidden element or by
    // - having been added to allDataElements
    // then the initializiation of this service is done and we can resolve the promise
    if (this.urlsFromAllResults.size === this.numberOfHandledResults) {
      this.ready$.next(true);
    }
  }

  private resetInstanceVariables() {
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
          mdrKey: permissibleValue.value,
          mdrDesignation: this.getDesignationPermissibleValue(permissibleValue, language)
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
