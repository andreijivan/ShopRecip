import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Recipe} from "./recipe.model";
import {DataStorageService} from "../shared/data-storage.service";
import {RecipeServices} from "./recipe-services";

@Injectable()
export class RecipesResolverService implements Resolve<Recipe []>{

  constructor(private dataStorageService: DataStorageService, private recipeService: RecipeServices) {}
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  const recipes = this.recipeService.getRecipes();

  if (recipes.length === 0){
    return this.dataStorageService.fetchRecipes();
  } else {
    return recipes;
  }
  }
}
