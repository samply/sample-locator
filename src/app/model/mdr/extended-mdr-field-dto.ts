export interface ExtendedMdrFieldDto {
  mdrEntity: MdrEntity;
  mdrEntityChild: string;
  mdrDataType: MdrDataType;

  urn: string;
  name: string;
  placeHolder: string;
  unit: string;
  valueSetUrl?: string;

  permittedValues: Array<PermittedValue>;
}

export interface PermittedValue {
  label: string;
  value: string;
}

export enum MdrEntity {
  DONOR = 'DONOR',
  SAMPLE = 'SAMPLE',
  EVENT = 'EVENT',
  Histopathology = 'Histopathology',
  Pharmacotherapy = 'Pharmacotherapy',
  DiagnosticExam = 'Diagnostic exam',
  MolecularMarkers = 'Molecular markers',
  PatientData = 'Patient data',
  RadiationTherapy = 'Radiation therapy',
  ResponseToTherapy = 'Response to therapy',
  Sample = 'Sample',
  Surgery = 'Surgery',
  TargetedTherapy = 'Targeted therapy',
  VitalStatus = 'Vital status and survival information'
}

export function getAllMdrEntities(): Array<MdrEntity> {
  return [
    MdrEntity.DONOR,
    MdrEntity.EVENT,
    MdrEntity.SAMPLE,
    MdrEntity.Histopathology,
    MdrEntity.Pharmacotherapy,
    MdrEntity.DiagnosticExam,
    MdrEntity.MolecularMarkers,
    MdrEntity.PatientData,
    MdrEntity.RadiationTherapy,
    MdrEntity.ResponseToTherapy,
    MdrEntity.Sample,
    MdrEntity.Surgery,
    MdrEntity.TargetedTherapy,
    MdrEntity.VitalStatus
  ];
}

export function getMdrEntity(name: string): MdrEntity | null {
  switch (name.toUpperCase()) {
    case MdrEntity.SAMPLE: return MdrEntity.SAMPLE;
    case MdrEntity.EVENT: return MdrEntity.EVENT;
    case MdrEntity.DONOR: return MdrEntity.DONOR;
    case MdrEntity.Histopathology: return MdrEntity.Histopathology;
    case MdrEntity.Pharmacotherapy: return MdrEntity.Pharmacotherapy;
    case MdrEntity.DiagnosticExam: return MdrEntity.DiagnosticExam;
    case MdrEntity.MolecularMarkers: return MdrEntity.MolecularMarkers;
    case MdrEntity.PatientData: return MdrEntity.PatientData;
    case MdrEntity.RadiationTherapy: return MdrEntity.RadiationTherapy;
    case MdrEntity.ResponseToTherapy: return MdrEntity.ResponseToTherapy;
    case MdrEntity.Sample: return MdrEntity.Sample;
    case MdrEntity.Surgery: return MdrEntity.Surgery;
    case MdrEntity.TargetedTherapy: return MdrEntity.TargetedTherapy;
    case MdrEntity.VitalStatus: return MdrEntity.VitalStatus;
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
