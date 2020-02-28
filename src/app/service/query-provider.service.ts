import {Injectable} from '@angular/core';
import {EssentialQueryDto, EssentialSimpleFieldDto, EssentialValueType, SimpleValueOperator} from '../model/query/essential-query-dto';
import {MdrFieldProviderService} from './mdr-field-provider.service';
import {MdrDataType} from '../model/mdr/extended-mdr-field-dto';

import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class QueryProviderService {

  private static URN_DIAGNOSIS = 'urn:mdr16:dataelement:27:1';
  private static TYPE_DIAGNOSIS = MdrDataType.STRING;
  private static URN_AGE = 'urn:mdr16:dataelement:14:1';
  private static TYPE_AGE = MdrDataType.INTEGER;
  private static URN_SAMPLING_DATE = 'urn:mdr16:dataelement:12:1';
  private static TYPE_SAMPLING_DATE = MdrDataType.DATE;
  private static URN_MATERIAL_LIQUID = 'urn:mdr16:dataelement:16:1';
  private static TYPE_MATERIAL_LIQUID = MdrDataType.ENUMERATED;
  private static URN_BMI = 'urn:mdr16:dataelement:31:1';
  private static TYPE_BMI = MdrDataType.FLOAT;


  public query: EssentialQueryDto;

  constructor(
    private mdrFieldProviderService: MdrFieldProviderService
  ) {
    this.resetQuery();
  }

  resetQuery(): void {
    this.query = {
      fields: []
    };

    this.addField(QueryProviderService.URN_DIAGNOSIS, QueryProviderService.TYPE_DIAGNOSIS, 4000);
    this.addField(QueryProviderService.URN_AGE, QueryProviderService.TYPE_AGE, 1000);
    this.addField(QueryProviderService.URN_BMI, QueryProviderService.TYPE_BMI, 2000);
    this.addField(QueryProviderService.URN_MATERIAL_LIQUID, QueryProviderService.TYPE_MATERIAL_LIQUID, 5000);

    this.addField(QueryProviderService.URN_SAMPLING_DATE, QueryProviderService.TYPE_SAMPLING_DATE, 3000);
  }

  addField(urn: string, valueType?: MdrDataType, summand = 1): void {
    if (!valueType) {
      const extendedFieldDto = this.mdrFieldProviderService.getPossibleField(urn);
      if (!extendedFieldDto) {
        return;
      }

      valueType = extendedFieldDto.mdrDataType;
    }

    let value1: any = (14 + summand).toString(10);
    let value2: any = (27 + summand).toString(10);

    if (valueType === MdrDataType.DATE) {
      value1 = moment(new Date()).format('DD.MM.YYYY');
      value2 = moment(new Date()).format('DD.MM.YYYY');
    } else if (valueType === MdrDataType.DATETIME) {
      value1 = moment(new Date()).format('DD.MM.YYYY\'T\'HH:mm:ss');
      value2 = moment(new Date()).format('DD.MM.YYYY\'T\'HH:mm:ss');
    }

    const fieldDto: EssentialSimpleFieldDto = {
      urn,
      valueType: this.getValueType(valueType),
      values: [{
        value: value1,
        maxValue: value1,
        operator: SimpleValueOperator.EQUALS
      },
        {
          value: value2,
          maxValue: value2,
          operator: SimpleValueOperator.EQUALS
        }]
    };

    this.query.fields.push(fieldDto);
  }

  addEmptyValue(fieldDto: EssentialSimpleFieldDto): void {
    fieldDto.values.push({
      value: '',
      maxValue: '',
      operator: SimpleValueOperator.EQUALS
    });
  }

  // noinspection JSMethodCanBeStatic
  private getValueType(mdrDataType: MdrDataType): EssentialValueType | null {
    switch (mdrDataType) {
      case MdrDataType.ENUMERATED:
        return EssentialValueType.ENUMERATED;
      case MdrDataType.DATE:
        return EssentialValueType.DATE;
      case MdrDataType.DATETIME:
        return EssentialValueType.DATETIME;
      case MdrDataType.FLOAT:
        return EssentialValueType.FLOAT;
      case MdrDataType.INTEGER:
        return EssentialValueType.INTEGER;
      case MdrDataType.STRING:
        return EssentialValueType.STRING;
      default:
        return null;
    }
  }
}
