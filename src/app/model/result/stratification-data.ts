export interface StratificationData {
  labels: Array<string>;
  datasets: Array<Dataset>;
}

export interface Dataset {
  data: Array<number>;
  label: string;
  backgroundColor: string;
  borderColor: string;
}
