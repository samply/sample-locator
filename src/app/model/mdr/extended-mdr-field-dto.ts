export interface ExtendedMdrFieldDto {
  mdrEntity: MdrEntity;
  mdrDataType: MdrDataType;

  urn: string;
  name: string;
  placeHolder: string;
  unit: string;

  permittedValues: Array<PermittedValue>;
}

export interface PermittedValue {
  mdrKey: string;
  mdrDesignation: string;
}

export enum MdrEntity {
  DONOR = 'DONOR',
  SAMPLE = 'SAMPLE',
  EVENT = 'EVENT'
}

export function getAllMdrEntities(): Array<MdrEntity> {
  return [MdrEntity.DONOR, MdrEntity.EVENT, MdrEntity.SAMPLE];
}

export function getMdrEntity(name: string): MdrEntity | null {
  switch (name.toUpperCase()) {
    case MdrEntity.SAMPLE: return MdrEntity.SAMPLE;
    case MdrEntity.EVENT: return MdrEntity.EVENT;
    case MdrEntity.DONOR: return MdrEntity.DONOR;
    default: return null;
  }
}

export enum MdrDataType {
  STRING = 'STRING',
  INTEGER = 'INTEGER',
  FLOAT = 'FLOAT',
  DATE = 'DATE',
  DATETIME = 'DATETIME',
  ENUMERATED = 'ENUMERATED'
}

export function getAllMdrDataTypes(): Array<MdrDataType> {
  return [MdrDataType.DATE, MdrDataType.DATETIME, MdrDataType.ENUMERATED, MdrDataType.FLOAT, MdrDataType.INTEGER, MdrDataType.STRING];
}

export function getMdrDataType(name: string): MdrDataType | null {
  switch (name.toUpperCase()) {
    case MdrDataType.STRING: return MdrDataType.STRING;
    case MdrDataType.INTEGER: return MdrDataType.INTEGER;
    case MdrDataType.FLOAT: return MdrDataType.FLOAT;
    case MdrDataType.ENUMERATED: return MdrDataType.ENUMERATED;
    case MdrDataType.DATETIME: return MdrDataType.DATETIME;
    case MdrDataType.DATE: return MdrDataType.DATE;
    default: return null;
  }
}
