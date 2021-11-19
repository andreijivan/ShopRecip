import {Actions, Effect, ofType} from '@ngrx/effects';
import {map, switchMap, withLatestFrom} from "rxjs/operators";
import {HttpClient} from "@angular/common/http";
import {Store} from "@ngrx/store";

import {Injectable} from "@angular/core";
import {Recipe} from "../recipe.model";
import * as RecipesActions from './recipe.actions';
import * as fromApp from '../../AppStore/app.reducer';


@Injectable()
export class RecipeEffects {

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>) {}

  @Effect()
  fetchRecies = this.actions$.pipe(
    ofType(RecipesActions.FETCH_RECIPES),
    switchMap(() => {
      return this.http.
      get<Recipe[]>('https://ng-course-recipe-book-2b0b8-default-rtdb.europe-west1.firebasedatabase.app/recipes.json',
      )
    }),map(recipes => {
      return recipes.map(recipe => {
        return {...recipe,
          ingredients: recipe.ingredients ? recipe.ingredients : []
        };
      });
    }),
    map(recipes => {
      return new RecipesActions.SetRecipes(recipes);
    })
  );

  @Effect({dispatch: false})
  storeRecipes = this.actions$.pipe(
    ofType(RecipesActions.STORE_RECIPES),
    withLatestFrom(this.store.select('recipes')),
    switchMap(([actionData, recipesState]) => {
     return this.http.
      put('https://ng-course-recipe-book-2b0b8-default-rtdb.europe-west1.firebasedatabase.app/recipes.json',
        recipesState.recipes
     );
    })
  );

}
