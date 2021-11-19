import * as fromShoppingList from '../shopping-list/NgRXStore/shopping-list.reducer';
import * as fromAuth from '../auth/NgRXStore/auth.reducer';
import * as fromRecipes from '../recipes/store/recipe.reducer';
import {ActionReducerMap} from "@ngrx/store";

export interface AppState {
  shoppingList: fromShoppingList.State;
  auth: fromAuth.State;
  recipes: fromRecipes.State;
}

export const appReducer: ActionReducerMap<AppState> = {
  shoppingList: fromShoppingList.shoppingListReducer,
  auth: fromAuth.authReducer,
  recipes: fromRecipes.recipeReducer
}
