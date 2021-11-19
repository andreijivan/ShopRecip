import {Component, OnInit} from '@angular/core';
import {DummyService} from "./dummy.service";
import {Store} from "@ngrx/store";
import * as fromApp from './AppStore/app.reducer';
import * as AuthActions from "./auth/NgRXStore/auth.actions";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  constructor(private store: Store<fromApp.AppState>,
              private dummyService: DummyService) {}

  ngOnInit() {
this.store.dispatch(new AuthActions.AutoLogin());
this.dummyService.printLog('Hello from AppComponent ngOnInit');
  }

}

