import {Component, OnDestroy, OnInit} from '@angular/core';
import {Store} from "@ngrx/store";
import {Ingredient} from "../shared/ingredient.model";
import {ShoppingListServices} from "./shopping-list-services";
import {Observable, Subscription} from "rxjs";
import {DummyService} from "../dummy.service";
import * as fromShoppingList from './NgRXStore/shopping-list.reducer';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {

  ingredients: Observable<{ingredients: Ingredient[] }> ;
  private ingredientsChangedSubscription: Subscription;

  constructor(private shoppingListService: ShoppingListServices,
              private dummyService: DummyService,
              private store: Store<fromShoppingList.AppState>
  ) {}

  ngOnInit() {
    this.ingredients =  this.store.select('shoppingListAppState');
    this.dummyService.printLog('Hello from ShoppingListComponent ngOnInit');
  }
  onEditItem(index: number){
  this.shoppingListService.startedEditing.next(index);
  }

  ngOnDestroy(): void {
    // this.ingredientsChangedSubscription.unsubscribe();
  }

}
