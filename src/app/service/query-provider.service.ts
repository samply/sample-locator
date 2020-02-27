import {Injectable} from '@angular/core';
import {EssentialQueryDto, EssentialSimpleFieldDto, EssentialValueType, SimpleValueOperator} from '../model/query/essential-query-dto';
import {MdrFieldProviderService} from './mdr-field-provider.service';
import {MdrDataType} from '../model/mdr/extended-mdr-field-dto';

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

    this.addField(QueryProviderService.URN_DIAGNOSIS, QueryProviderService.TYPE_DIAGNOSIS);
    this.addField(QueryProviderService.URN_AGE, QueryProviderService.TYPE_AGE);
    this.addField(QueryProviderService.URN_BMI, QueryProviderService.TYPE_BMI);
    this.addField(QueryProviderService.URN_MATERIAL_LIQUID, QueryProviderService.TYPE_MATERIAL_LIQUID);
    this.addField(QueryProviderService.URN_SAMPLING_DATE, QueryProviderService.TYPE_SAMPLING_DATE);
  }

  addField(urn: string, valueType?: MdrDataType): void {
    if (!valueType) {
      const extendedFieldDto = this.mdrFieldProviderService.getPossibleField(urn);
      if (!extendedFieldDto) {
        return;
      }

      valueType = extendedFieldDto.mdrDataType;
    }

    const fieldDto: EssentialSimpleFieldDto = {
      urn,
      valueType: this.getValueType(valueType),
      values: [{
        value: (13 + 1000 * this.query.fields.length).toString(10),
        maxValue: '',
        operator: SimpleValueOperator.EQUALS
      },
        {
          value: (27 + 1000 * this.query.fields.length).toString(10),
          maxValue: '',
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
