import {NgModule} from "@angular/core";
import {HTTP_INTERCEPTORS} from "@angular/common/http";


import {AuthInterceptorService} from "./auth/auth-interceptor.service";
import {RecipesResolverService} from "./recipes/recipes-resolver.service";
import {AuthService} from "./auth/auth.service";
import {AuthGuard} from "./auth/auth.guard";

@NgModule({
  providers: [
    //like java classes that can be used in any component, don't need to be exported like components
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    },
    RecipesResolverService,
    AuthService,
    AuthGuard
  ]
})
export class CoreModule{}
