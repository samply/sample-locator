export interface EssentialQueryDto {
  fieldDtos: Array<EssentialSimpleFieldDto>;
}

export interface EssentialSimpleFieldDto {
  urn: string;
  valueType: EssentialValueType;
  valueDtos: Array<EssentialSimpleValueDto>;
}

export enum EssentialValueType {
  STRING = 'STRING',
  INTEGER = 'INTEGER',
  DECIMAL = 'DECIMAL',
  DATE = 'DATE',
  DATETIME = 'DATETIME',
  PERMITTEDVALUE = 'PERMITTEDVALUE'
}

export interface EssentialSimpleValueDto {
  condition: SimpleValueOperator;
  value: string;
  maxValue: string;
}

export enum SimpleValueOperator {
  EQUALS = 'EQUALS',
  NOT_EQUALS = 'NOT_EQUALS',
  LESS = 'LESS',
  GREATER = 'GREATER',
  LESS_OR_EQUALS = 'LESS_OR_EQUALS',
  GREATER_OR_EQUALS = 'GREATER_OR_EQUALS',
  BETWEEN = 'BETWEEN'
}
