import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { ConverterCurrencyComponent } from './converter-currency/converter-currency.component';
import { ListCurrencyComponent } from './list-currency/list-currency.component';

const routes: Routes = [
  { path: 'exchange-rates', component: ListCurrencyComponent },
  { path: 'converter-currency', component: ConverterCurrencyComponent },
  { path: '**', component: ListCurrencyComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
