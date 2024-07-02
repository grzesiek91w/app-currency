import { NgFor, NgIf } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { catchError, find, map, Observable, of, Subscription, tap } from 'rxjs';
import { Currency } from '../currency.model';
import { CurrencyService } from '../service/currency.service';

type ExchangeRate = {
  code: string;
  mid: number;
}

@Component({
  selector: 'app-converter-currency',
  standalone: true,
  imports: [ FormsModule, NgFor, NgIf],
  templateUrl: './converter-currency.component.html',
  styleUrl: './converter-currency.component.scss'
})
export class ConverterCurrencyComponent implements OnInit,OnDestroy {

  exchangeRates: ExchangeRate[] =[];
  codes: string[] = [];
  fromCurrency?: string;
  toCurrency?: string;
  amount: number =0;
  result: number =0;
  codeSub? :Subscription;

  constructor(private currencyService : CurrencyService){

  }

  ngOnInit(): void {

    this.codeSub = this.currencyService.getExchangeRates("A").pipe(
      map((response: Currency[]) => response[0].rates.map((rate: any) => rate)),
      catchError((error: any) => {
        console.error('Error fetching exchange rates:', error);
        return of([]); // return an empty array on error
      })
    ).subscribe(codes => {
      this.exchangeRates = codes;
      console.log(this.exchangeRates);
    });
     
  }

  ngOnDestroy(): void {
      if(this.codeSub) this.codeSub.unsubscribe();
  }

  convertCurrency(): void {

    const fromRate = this.exchangeRates.find(rate => rate.code === this.fromCurrency);
    const toRate = this.exchangeRates.find(rate => rate.code === this.toCurrency);

    if (fromRate && toRate) {
      this.result = this.amount * (toRate.mid / fromRate.mid);
    } else {
      this.result = 0;
    }

  }

}
