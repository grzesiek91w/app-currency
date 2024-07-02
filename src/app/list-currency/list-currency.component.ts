import { CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import moment from 'moment';
import { catchError, map, Observable, of, tap } from 'rxjs';
import { Currency, Rate } from '../currency.model';
import { CurrencyService } from '../service/currency.service';

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
          Validators.pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)
      ]],
      dateEnd:['', [
            Validators.required,      
            Validators.pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)
        ]],
    }, { validators: [this.dateRangeValidator] });


    this.$currencyRates = this.currencyService.forkJoinExchangeRates().pipe(
        tap(x=>{
          console.log(x[0],x[1])
        }),
        map((x)=>[...x[0], ...x[1]])),
        catchError((error: any) => {
          console.error('Error fetching currency rates:', error);
          return of([]); // return an empty array on error
        });
    
  }

  dateRangeValidator(control: AbstractControl): { [key: string]: boolean } | null {

    const startDate = control.get('dateStart')?.value;  
    const endDate = control.get('dateEnd')?.value;
  
    if (startDate && endDate) {

      const startDateMoment = moment(startDate);
      const endDateMoment = moment(endDate);
  
      if (startDateMoment.isAfter(endDateMoment)) {
        return { invalidDateRange: true };
      }
      if (startDateMoment.isBefore(endDateMoment.subtract(80, 'days'))) {
        return { toLargeTime: true };
      }

    }
    return null;
  }

  onChange(page: number) {
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

    this.$currencyRates = this.currencyService.forkJoinEchangeRatesToDate(dateStart, dateEnd).pipe(
      tap(x => {
        console.log(x[0], x[1])
      }),
      map((x) => [...x[0], ...x[1]]),
      catchError((error: any) => {
        console.error('Error fetching currency rates:', error);
        return of([]); // return an empty array on error 
      })
    );
    
  }

  onReset() {
    this.submitted = false;
    this.form.reset();
  }

}
