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

@Injectable({
  providedIn: 'root'
})
export class MdrFieldProviderService {

  allDataElements: Array<ExtendedMdrFieldDto> = [];
  dataElementGroupMembersMap: Map<MdrEntity, Array<ExtendedMdrFieldDto>> = new Map();
  entityUrnsMap: Map<MdrEntity, Array<string>> = new Map();

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

  isFieldOfType(field: EssentialSimpleFieldDto, mdrEntity: MdrEntity): boolean {
    return !!this.entityUrnsMap.get(mdrEntity).find(urn => urn === field.urn);
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
        for (const mdrResult of value.results) {
          if (mdrConfig.hiddenDataElements.find(hiddenUrn => hiddenUrn === mdrResult.id)) {
            continue;
          }

          const urlElement = mdrConfig.mdrRestUrl + '/dataelements/' + mdrResult.id;
          this.httpClient.get<MdrDataElement>(urlElement).subscribe(
            dataElement => {
              const dataElementDto =
                this.createExtendedMdrFieldDto(mdrEntity, mdrResult, dataElement, mdrConfig);

              this.allDataElements.push(dataElementDto);
              this.entityUrnsMap.get(mdrEntity).push(dataElementDto.urn);
              this.dataElementGroupMembersMap.get(mdrEntity).push(dataElementDto);
            }
          );
        }
      });
    }
  }

  private resetInstanceVariables() {
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
        return designation.definition;
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
