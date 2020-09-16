import {ReplySiteDto} from './reply-legacy-dto';

export interface ReplyTransfer {
  replySites: Array<ReplySite|ReplySiteDto>;
}

export interface Reply {
  replySites: Array<ReplySite>;
}

export interface ReplySite {
  site: string;
  donor: ReplySubject;
  sample: ReplySubject;
}

export interface ReplySubject {
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
