export interface Reply {
  replySites: Array<ReplySite>;
}

export interface ReplySite {
  site: string;
  donor: Subject;
  sample: Subject;
}

export interface Subject {
  label: string;
  count: number;
  stratifications: Array<Stratification>;
}

export interface Stratification {
  title: string;
  strata: Array<Stratum>;
}

export interface Stratum {
  label: string;
  count: number;
}
