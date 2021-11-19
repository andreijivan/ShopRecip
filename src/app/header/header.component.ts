import {Component, OnDestroy, OnInit} from "@angular/core";
import {Subscription} from "rxjs";
import {Store} from "@ngrx/store";
import {map} from "rxjs/operators";

import * as fromApp from "../AppStore/app.reducer";
import * as AuthActions from "../auth/NgRXStore/auth.actions";
import * as RecipeActions from '../recipes/store/recipe.actions';

@Component({
  selector: 'app-header',
  templateUrl:'./header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  isUserAuthenticated = false;
  private userSub: Subscription;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit () {
  this.userSub = this.store.
  select('auth')
    .pipe(map(authState => authState.user))
    .subscribe(user => {
    this.isUserAuthenticated =!user ? false : true;
  });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

  onSaveData() {
  //this.dataStorageService.storeRecipes();
    this.store.dispatch(new RecipeActions.StoreRecieps());
  }
  onFetchData() {
  //  this.dataStorageService.fetchRecipes().subscribe();
    this.store.dispatch(new RecipeActions.FetchRecipes());
  }

  onLogout() {
    this.store.dispatch(new AuthActions.Logout());
  }
}
