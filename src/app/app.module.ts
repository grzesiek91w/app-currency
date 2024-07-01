import { provideHttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConverterCurrencyComponent } from './converter-currency/converter-currency.component';
import { HeaderComponent } from './header/header.component';
import { ListCurrencyComponent } from './list-currency/list-currency.component';



@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HeaderComponent,
    ListCurrencyComponent,
    ConverterCurrencyComponent,
  ],
  providers: [provideHttpClient()],
  bootstrap: [AppComponent]
})
export class AppModule { }
