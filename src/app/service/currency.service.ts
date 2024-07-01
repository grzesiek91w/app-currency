import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, map, Observable } from 'rxjs';
import { Currency } from '../currency.model';

// type Currency = {
//   table: string,
//   effectiveData: string,
//   no: string
//   rates:[{
//     currency: string,
//     code: string,
//     mid: number
//   }]
// }

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  constructor(private httpClient: HttpClient) { }

  getExchangeRates( table: string | null | undefined):Observable<Currency[]> {
    const url = `https://api.nbp.pl/api/exchangerates/tables/${table}/?format=json`;
    return this.httpClient.get<Currency[]>(url);
  }

  getEchangeRatesToDate(startDate: string, endDate: string, table: string): Observable<Currency[]> {
    const url =`http://api.nbp.pl/api/exchangerates/tables/${table}/${startDate}/${endDate}/`;
    return this.httpClient.get<Currency[]>(url);
  }

  forkJoinExchangeRates(): Observable<any[]> {

    return forkJoin([

      this.getExchangeRates("A"),

      this.getExchangeRates("B")

    ])
  }

  forkJoinEchangeRatesToDate(startDate: string, endDate: string): Observable<any[]> {

    return forkJoin([

      this.getEchangeRatesToDate(startDate,endDate,"A"),

      this.getEchangeRatesToDate(startDate,endDate,"B")

    ])
  }
}
