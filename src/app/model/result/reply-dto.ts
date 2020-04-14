export interface ReplyDto {
  replySites: Array<ReplySiteDto>;
}

export interface ReplySiteDto {
  site: string;
  donor: number;
  sample: number;
}
