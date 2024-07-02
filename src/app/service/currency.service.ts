import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, forkJoin, map, Observable, throwError } from 'rxjs';
import { Currency } from '../currency.model';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {

  constructor(private httpClient: HttpClient) { }

  getExchangeRates( table: string | null | undefined):Observable<Currency[]> {
    const url = `https://api.nbp.pl/api/exchangerates/tables/${table}/?format=json`;
    return this.httpClient.get<Currency[]>(url).pipe(

      catchError((error: HttpErrorResponse) => {
  
        if (error.status === 404) {

          return throwError(() => new Error(`No exchange rates found for table ${table}`));
  
        } else {
  
          return throwError(() => new Error(`Error fetching exchange rates: ${error.message}`));
  
        }
  
      })
    );
  }

  getEchangeRatesToDate(startDate: string, endDate: string, table: string): Observable<Currency[]>{
    const url =`http://api.nbp.pl/api/exchangerates/tables/${table}/${startDate}/${endDate}/`;
    return this.httpClient.get<Currency[]>(url).pipe(

      catchError((error: HttpErrorResponse) => {
  
        if (error.status === 404) {

          return throwError(() => new Error(`No exchange rates found for table ${table} between ${startDate} and ${endDate}`));
  
        } else {
  
          return throwError(() => new Error(`Error fetching exchange rates: ${error.message}`));
  
        }
  
      })
  
    );
  }

  forkJoinExchangeRates(): Observable<any[]> {

    return forkJoin([

      this.getExchangeRates("A").pipe(
  
        catchError((error) => throwError(() => new Error(`Error fetching exchange rates for table A: ${error.message}`)))
  
      ),

      this.getExchangeRates("B").pipe(
  
        catchError((error) => throwError(() => new Error(`Error fetching exchange rates for table B: ${error.message}`)))
  
      ),

    ])
  }

  forkJoinEchangeRatesToDate(startDate: string, endDate: string): Observable<[Currency[], Currency[]]> {

    return forkJoin([
  
      this.getEchangeRatesToDate(startDate, endDate, "A").pipe(
  
        catchError((error) => throwError(() => new Error(`Error fetching exchange rates for table A: ${error.message}`)))
  
      ),
  
      this.getEchangeRatesToDate(startDate, endDate, "B").pipe(
  
        catchError((error) => throwError(() => new Error(`Error fetching exchange rates for table B: ${error.message}`)))
  
      )
  
    ]).pipe(
  
      catchError((error) => throwError(() => new Error(`Error fetching exchange rates: ${error.message}`)))
  
    );
  
  }

}
