export interface MdrDataElement {
  identification: Identification;
  designations: Array<Designation>;
  slots: Array<Slot>;
  validation: Validations;
}

export interface MdrResults {
  results: Array<MdrResult>;
}

export interface MdrResult {
  id: string;
  type: string;
  order: number;

  identification: Identification;
  designations: Array<Designation>;
}

export interface Identification {
  urn: string;
  status: EnumIdentificationStatus;
}

export enum EnumIdentificationStatus {
  DRAFT = 'DRAFT',
  RELEASED = 'RELEASED',
  OUTDATED = 'OUTDATED'
}

export interface Designation {
  language: string;
  designation: string;
  definition: string;
}

export interface Slot {
  slotName: string;
  slotValue: string;
}

export interface Validations {
  datatype: string;
  format: string;
  description: string;
  maximum_character_quantity: string;
  value_domain_type: string;
  validation_type: string;
  permissible_values: Array<PermissibleValue>;
  unit_of_measure: string;
}

export interface PermissibleValue {
  value: string;
  meanings: Array<Meaning>;
}

export interface Meaning {
  language: string;
  designation: string;
  definition: string;
}
