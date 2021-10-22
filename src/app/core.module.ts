import {NgModule} from "@angular/core";
import {HTTP_INTERCEPTORS} from "@angular/common/http";

import {ShoppingListServices} from "./shopping-list/shopping-list-services";
import {RecipeServices} from "./recipes/recipe-services";
import {AuthInterceptorService} from "./auth/auth-interceptor.service";
import {DataStorageService} from "./shared/data-storage.service";
import {RecipesResolverService} from "./recipes/recipes-resolver.service";
import {AuthService} from "./auth/auth.service";
import {AuthGuard} from "./auth/auth.guard";
import {DummyService} from "./dummy.service";

@NgModule({
  providers: [
    //like java classes that can be used in any component, don't need to be exported like components
    ShoppingListServices,
    RecipeServices,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true},
    DataStorageService,
    RecipesResolverService,
    AuthService,
    AuthGuard
  ]
})
export class CoreModule{}
