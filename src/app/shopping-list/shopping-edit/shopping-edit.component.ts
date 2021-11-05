import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";
import {Subscription} from "rxjs";
import {Store} from "@ngrx/store";
import {Ingredient} from "../../shared/ingredient.model";
import {ShoppingListServices} from "../shopping-list-services";
import * as ShoppingListAction from "../NgRXStore/shopping-list.actions";
import * as fromShoppingList from '../NgRXStore/shopping-list.reducer';

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild('f', {static: false}) shoppingListForm: NgForm;
  subscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  editedItem: Ingredient;

  constructor(private shoppingListService: ShoppingListServices,
              private store: Store<fromShoppingList.AppState>
  ) {}

  ngOnInit() {
    this.subscription = this.shoppingListService.startedEditing.subscribe(
      (index: number) => {
        this.editedItemIndex = index;
        this.editMode = true;
        this.editedItem = this.shoppingListService.getSelectedIngredient(index);
        this.shoppingListForm.setValue({
          formName: this.editedItem.name,
          formAmount: this.editedItem.amount
        });
      }
    );
  }

  onSubmit(form: NgForm){
    const value = form.value;
    const newIngredient = new Ingredient(value.formName,value.formAmount);

    this.editMode ?
      this.store.dispatch(new ShoppingListAction.UpdateIngredient({index: this.editedItemIndex, ingredient: newIngredient}))
      : this.store.dispatch(new ShoppingListAction.AddIngredient(newIngredient));
    this.editMode = false;
    this.shoppingListForm.reset();
  }

  onClear() {
    this.shoppingListForm.reset();
    this.editMode = false;
  }

  onDelete() {
   // this.shoppingListService.deleteIngredient(this.editedItemIndex);
    this.store.dispatch(new ShoppingListAction.DeleteIngredient(this.editedItemIndex));
    this.onClear();
  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
