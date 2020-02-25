export interface EssentialQueryDto {
  fields: Array<EssentialSimpleFieldDto>;
}

export interface EssentialSimpleFieldDto {
  urn: string;
  valueType: EssentialValueType;
  values: Array<EssentialSimpleValueDto>;
}

export enum EssentialValueType {
  STRING = 'STRING',
  INTEGER = 'INTEGER',
  FLOAT = 'FLOAT',
  DATE = 'DATE',
  DATETIME = 'DATETIME',
  ENUMERATED = 'ENUMERATED'
}

export interface EssentialSimpleValueDto {
  value: string;
  maxValue: string;
  operator: SimpleValueOperator;
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
