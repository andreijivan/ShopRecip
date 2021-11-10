import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {Ingredient} from "../shared/ingredient.model";
import {Observable, Subscription} from "rxjs";
import * as ShoppingListActions from "./NgRXStore/shopping-list.actions";
import * as fromApp from '../GlobalStore/app.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Observable<{ingredients: Ingredient[] }> ;
  private ingredientsChangedSubscription: Subscription;

  constructor(private store: Store<fromApp.AppState>) {}

  ngOnInit() {
    this.ingredients =  this.store.select('shoppingList');
  }
  onEditItem(index: number){
    this.store.dispatch(new ShoppingListActions.StartEdit(index));
  }

  ngOnDestroy(): void {
  }

}
