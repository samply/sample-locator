export interface MdrConfig {
  mdrRestUrl: string;
  mdrNamespace: string;
  languageCode: string;

  dataElementGroups: Array<DataElementGroup>;
  dataElements: Array<DataElement>;
  hiddenDataElements: Array<string>;
}

export interface DataElementGroup {
  nameOfEnum: string;
  urn: string;
}

export interface DataElement {
  urn: string;
  placeholder: string;
  unit: string;
  valueSetUrl?: string;
}

