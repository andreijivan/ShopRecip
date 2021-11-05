import {Ingredient} from "../../shared/ingredient.model";
import * as ShoppingListAction from "./shopping-list.actions";

export interface AppState {
  shoppingListAppState: State;
}

export interface State {
  ingredients: Ingredient[];
  editedIngredient:Ingredient;
  editedIngredientIndex: number;
}

const initialState: State = {
  ingredients: [
    new Ingredient("Apples",5),
    new Ingredient("Tomatoes", 10)
  ],
  editedIngredient: null,
  editedIngredientIndex: -1
};

export function shoppingListReducer(
  currentState: State = initialState,
  action: ShoppingListAction.ShoppingListActions) {
  switch (action.type) {
    case ShoppingListAction.ADD_INGREDIENT:
      return {
        //...currentState copies the original state
        ...currentState,
        ingredients: [...currentState.ingredients, action.payload]
      };
    case ShoppingListAction.ADD_INGREDIENTS:
      return {
        ...currentState,
        ingredients: [...currentState.ingredients, ...action.payload]
      };
    case ShoppingListAction.UPDATE_INGREDIENT:
      const currentIngredient = currentState.ingredients[action.payload.index];
      const updatedIngredient = {
        ...currentIngredient,
        ...action.payload.ingredient
      };
      const updatedIngredients = [... currentState.ingredients];
      updatedIngredients[action.payload.index] = updatedIngredient;
      return {
        ...currentState,
        ingredients: updatedIngredients
      };
    case ShoppingListAction.DELETE_INGREDIENT:
      return {
        ...currentState,
        ingredients: currentState.ingredients.filter((ig, igIndex) => {
          return igIndex !== action.payload;
        })
      };
    default:
      return currentState;
  }
}
