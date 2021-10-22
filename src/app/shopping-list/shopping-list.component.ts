import {Component, OnDestroy, OnInit} from '@angular/core';
import {Ingredient} from "../shared/ingredient.model";
import {ShoppingListServices} from "./shopping-list-services";
import {Subscription} from "rxjs";
import {DummyService} from "../dummy.service";

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Ingredient[];
  private ingredientsChangedSubscription: Subscription;


  constructor(private shoppingListService: ShoppingListServices, private dummyService: DummyService) { }

  ngOnInit() {
    this.ingredients = this.shoppingListService.getIngredients();
    this.ingredientsChangedSubscription = this.shoppingListService.ingredientsChanged.subscribe(
      (newIngredientArray: Ingredient []) => {
        this.ingredients = newIngredientArray;
      }
    )
    this.dummyService.printLog('Hello from ShoppingListComponent ngOnInit');
  }
  onEditItem(index: number){
  this.shoppingListService.startedEditing.next(index);
  }

  ngOnDestroy(): void {
    this.ingredientsChangedSubscription.unsubscribe();
  }

}
