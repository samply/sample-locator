import {Injectable} from '@angular/core';
import {EssentialQueryDto, EssentialSimpleFieldDto, EssentialValueType, SimpleValueOperator} from '../model/query/essential-query-dto';
import {MdrFieldProviderService} from './mdr-field-provider.service';
import {MdrDataType} from '../model/mdr/extended-mdr-field-dto';
import {SlStorageService} from './sl-storage.service';

@Injectable({
  providedIn: 'root'
})
export class QueryProviderService {

  private static URN_DIAGNOSIS = 'urn:mdr16:dataelement:27:1';
  private static TYPE_DIAGNOSIS = MdrDataType.STRING;

  public query: EssentialQueryDto;

  constructor(
    private mdrFieldProviderService: MdrFieldProviderService,
    private slStorageService: SlStorageService
  ) {
  }

  restoreQuery() {
    this.query = this.slStorageService.getQuery();

    if (!this.query) {
      this.resetQuery();
    }

    this.slStorageService.setQuery(this.query);
  }

  resetQuery(): void {
    this.query = {
      fieldDtos: []
    };

    this.addField(QueryProviderService.URN_DIAGNOSIS, QueryProviderService.TYPE_DIAGNOSIS);

    this.slStorageService.setNToken('');
    this.slStorageService.setQuery(this.query);
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
      valueDtos: []
    };

    this.addEmptyValue(fieldDto);

    this.query.fieldDtos.push(fieldDto);

    this.slStorageService.setQuery(this.query);
  }

  // noinspection JSMethodCanBeStatic
  addEmptyValue(fieldDto: EssentialSimpleFieldDto): void {
    fieldDto.valueDtos.push({
      condition: SimpleValueOperator.EQUALS,
      value: '',
      maxValue: '',
    });
  }

  // noinspection JSMethodCanBeStatic
  private getValueType(mdrDataType: MdrDataType): EssentialValueType | null {
    switch (mdrDataType) {
      case MdrDataType.ENUMERATED:
        return EssentialValueType.PERMITTEDVALUE;
      case MdrDataType.DATE:
        return EssentialValueType.DATE;
      case MdrDataType.DATETIME:
        return EssentialValueType.DATETIME;
      case MdrDataType.FLOAT:
        return EssentialValueType.DECIMAL;
      case MdrDataType.INTEGER:
        return EssentialValueType.INTEGER;
      case MdrDataType.STRING:
        return EssentialValueType.STRING;
      default:
        return null;
    }
  }
}
