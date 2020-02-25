import {Injectable} from '@angular/core';
import {EssentialQueryDto, EssentialSimpleFieldDto, EssentialValueType} from '../model/query/essential-query-dto';
import {MdrFieldProviderService} from './mdr-field-provider.service';
import {MdrDataType, MdrEntity} from '../model/mdr/extended-mdr-field-dto';

@Injectable({
  providedIn: 'root'
})
export class QueryProviderService {

  private static URN_DIAGNOSIS = 'urn:mdr16:dataelement:27:1';

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

    this.addField(QueryProviderService.URN_DIAGNOSIS);
  }

  addField(urn: string): void {
    const extendedFieldDto = this.mdrFieldProviderService.getPossibleField(urn);
    if (!extendedFieldDto) {
      return;
    }

    const fieldDto: EssentialSimpleFieldDto = {
      urn,
      valueType: this.getValueType(extendedFieldDto.mdrDataType),
      values: []
    };

    this.query.fields.push(fieldDto);
  }

  getDonorFields(): Array<EssentialSimpleFieldDto> {
    const copy = this.query.fields.slice();
    return copy.filter(field => this.mdrFieldProviderService.isFieldOfType(field, MdrEntity.DONOR));
  }

  getSampleFields(): Array<EssentialSimpleFieldDto> {
    const copy = this.query.fields.slice();
    return copy.filter(field => this.mdrFieldProviderService.isFieldOfType(field, MdrEntity.SAMPLE));
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
