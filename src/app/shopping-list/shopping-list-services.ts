import {Ingredient} from "../shared/ingredient.model";
import { Subject} from "rxjs";

export class ShoppingListServices{

  ingredientsChanged = new Subject<Ingredient []>();
  startedEditing = new Subject<number>();

  private ingredients: Ingredient[] = [
    new Ingredient("Apples",5),
    new Ingredient("Tomatoes", 10)
  ];

  getIngredients(){
    return this.ingredients.slice();
  }

  getSelectedIngredient(index: number){
    return this.ingredients[index];
  }

  addIngredient (newIngredient: Ingredient) {
    this.ingredients.push(newIngredient);
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  updateIngredient (index: number, currentIngredient: Ingredient) {
  this.ingredients[index] = currentIngredient;
  this.ingredientsChanged.next(this.ingredients.slice());
  }

  addIngredientsToRecipeComponent(ingredients: Ingredient[]){
    this.ingredients.push(...ingredients); // adds all ingredients withouth emitting event for each element added
    this.ingredientsChanged.next(this.ingredients.slice());
  }

  deleteIngredient(index: number) {
    this.ingredients.splice(index,1);
    this.ingredientsChanged.next(this.ingredients.slice())
  }
}
