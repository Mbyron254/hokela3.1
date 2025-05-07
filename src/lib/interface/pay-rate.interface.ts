export interface InputPayRateUpsert {
  amount?: string;
  amountDuration?: string;
  interval?: number;
  intervalUnit?: string;
}

export interface InputKPIConfig {
  id?: string;
  percentage?: number;
  _label?: string;
}
