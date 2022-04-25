import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';

import { AppComponent } from './app.component';
import {HeaderComponent} from "./header/header.component";
import {AppRoutingModule} from "./app-routing.module";
import {SharedModule} from "./shared/shared.module";
import {CoreModule} from "./core.module";



@NgModule({
  //declarations = java classes
  declarations: [
    AppComponent,
    HeaderComponent,
  ],
  imports: [
    //like java packages or external libraries
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,

    SharedModule,
    CoreModule,
  ],
  bootstrap: [AppComponent],
  exports: [
    HeaderComponent
  ],
})
export class AppModule { }
