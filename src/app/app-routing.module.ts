import {NgModule} from "@angular/core";
import {PreloadAllModules, RouterModule, Routes} from "@angular/router";

const appRoutes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },
  //lazy loading only when we access /recipes or others
  { path: 'recipes',
    loadChildren: () => import('./recipes/recipes.module').then(m => m.RecipesModule)} ,
    { path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)},
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules}) //preloading lazy loaded code
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
