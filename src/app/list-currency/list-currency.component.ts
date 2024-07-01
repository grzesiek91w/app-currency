import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { map, Observable, tap } from 'rxjs';
import { Currency, Rate } from '../currency.model';
import { CurrencyService } from '../service/currency.service';

// type Currency = {
//   table: string,
//   effectiveData: string,
//   no: string
//   rates: Rate[];
// }

// type Rate = {
//   currency: string;
//   code: string;
//   mid: number;
// }


@Component({
  selector: 'app-list-currency',
  standalone: true,
  imports:[CommonModule,NgFor,NgIf, FormsModule, ReactiveFormsModule,],
  templateUrl: './list-currency.component.html',
  styleUrl: './list-currency.component.scss'
})

export class ListCurrencyComponent implements OnInit {

  currency:Currency[]=[];
  rates: Rate[]=[];
  $currencyRates? : Observable<Currency[]>;

  form!: FormGroup;
  submitted = false;

  totalItems: number =0;
  p: number = 1 ;
  data: any[] =[];

  
 
  constructor(private currencyService: CurrencyService,
              private formBuilder: FormBuilder){
  }
  ngOnInit(): void {

    this.form = this.formBuilder.group({
      dateStart: ['', [
          Validators.required,
          // validates date format yyyy-mm-dd with regular expression
          Validators.pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)
      ]],
      dateEnd:['', [
            Validators.required,
            // validates date format yyyy-mm-dd with regular expression
            Validators.pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)
        ]],
  });


  this.$currencyRates = this.currencyService.forkJoinExchangeRates().pipe(
      tap(x=>{
        console.log(x[0],x[1])
      }),
      map((x)=>[...x[0], ...x[1]]));
  
  }

  onChange(page: number) {

    console.log(page,this.totalItems);
    this.p = page;

  }

  get f() { 
    return this.form.controls; 
  }

  onSubmit() {
    this.submitted = true;

    if (this.form.invalid) {
        return;
    }
    
    const dateStart = this.form.value?.dateStart;
    const dateEnd = this.form.value?.dateEnd;

    this.$currencyRates = this.currencyService.forkJoinEchangeRatesToDate(dateStart,dateEnd).pipe(
      tap(x=>{
        console.log(x[0],x[1])
      }),
      map((x)=>[...x[0], ...x[1]]));
    
    
    // this.$currencyRates = this.currencyService.getEchangeRatesToDate(dateStart,dateEnd,"A").pipe(
    //   tap(x=>console.log(x[0])),
    //   map((x:any)=>x));

  }

  onReset() {
    this.submitted = false;
    this.form.reset();
  }


}
