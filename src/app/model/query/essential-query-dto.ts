export interface EssentialQueryDto {
  fieldDtos: Array<EssentialSimpleFieldDto>;
}

export interface EssentialSimpleFieldDto {
  '@': FieldAttributes;
  valueDtos: Array<EssentialSimpleValueDto>;
}

export interface FieldAttributes {
  urn: string;
  valueType: EssentialValueType;
}

export enum EssentialValueType {
  STRING = 'STRING',
  INTEGER = 'INTEGER',
  DECIMAL = 'DECIMAL',
  DATE = 'DATE',
  DATETIME = 'DATETIME',
  PERMITTEDVALUE = 'PERMITTEDVALUE'
}

export interface ValueAttributes {
  condition: SimpleValueOperator;
}

export interface EssentialSimpleValueDto {
  '@': ValueAttributes;
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
