export type Rate = {
    currency: string;
    code: string;
    mid: number;
  }
  
export interface Currency {
  table: string,
  effectiveData: string,
  no: string,
  rates: Rate[]
}
