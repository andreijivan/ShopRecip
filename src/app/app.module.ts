import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpClientModule} from '@angular/common/http';
import {Store, StoreModule} from '@ngrx/store';

import { AppComponent } from './app.component';
import {HeaderComponent} from "./header/header.component";
import {AppRoutingModule} from "./app-routing.module";
import {SharedModule} from "./shared/shared.module";
import {CoreModule} from "./core.module";
import {shoppingListReducer} from "./shopping-list/NgRXStore/shopping-list.reducer";


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
    StoreModule.forRoot({shoppingListReducerKey: shoppingListReducer}),

    SharedModule,
    CoreModule,
  ],
  bootstrap: [AppComponent],//what component starts you app
 // providers: [DummyService]
})
export class AppModule { }
