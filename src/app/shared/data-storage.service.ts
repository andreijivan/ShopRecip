import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {RecipeServices} from "../recipes/recipe-services";
import {Recipe} from "../recipes/recipe.model";
import {map, tap} from "rxjs/operators";
import {AuthService} from "../auth/auth.service";


@Injectable()
export class DataStorageService {
constructor(private http: HttpClient, private recipeService: RecipeServices, private authService: AuthService) {}

  storeRecipes() {
  const recipesToStore = this.recipeService.getRecipes();
  this.http.
  put('https://ng-course-recipe-book-2b0b8-default-rtdb.europe-west1.firebasedatabase.app/recipes.json',
    recipesToStore).subscribe(response => {
      console.log(response);
  });
  }

  fetchRecipes() {
    return this.http.
    get<Recipe[]>('https://ng-course-recipe-book-2b0b8-default-rtdb.europe-west1.firebasedatabase.app/recipes.json',
    ).
    pipe(map(recipes => {
        return recipes.map(recipe => {
          return {...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : []
          };
        });
      }),
      tap(recipes => {
        this.recipeService.overwriteRecipes(recipes);
      })
    )
   }
}
