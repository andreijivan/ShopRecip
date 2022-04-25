import {Recipe} from "./recipe.model";
import {Injectable} from "@angular/core";
import {Subject} from "rxjs";

@Injectable()
export class RecipeServices {

  recipesChanged = new Subject<Recipe[]>();

  private recipes: Recipe [];

  getRecipes() {
    return this.recipes.slice(); //returns a copy of recipes, not original one
  }

  getRecipe(id: number) {
    return this.recipes[id];
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, updatedRecipe:Recipe) {
    this.recipes[index] =  updatedRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }

  overwriteRecipes(newRecipes: Recipe []) {
    this.recipes = newRecipes;
    this.recipesChanged.next(this.recipes.slice());
  }
}
