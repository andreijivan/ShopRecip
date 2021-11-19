import {Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {NgForm} from "@angular/forms";
import {Subscription} from "rxjs";
import {Store} from "@ngrx/store";

import {AlertComponent} from "../shared/alert/alert.component";
import {PlaceholderDirective} from "../shared/placeholder/placeholder.directive";
import * as fromApp from '../AppStore/app.reducer';
import * as AuthActions from './NgRXStore/auth.actions'


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  isLoading = false;
  error : string = null;
  @ViewChild(PlaceholderDirective, {static: false}) alertHost: PlaceholderDirective;
  private closeSub: Subscription;
  private storeSub: Subscription;

  constructor(private componentFactoryResolver: ComponentFactoryResolver,
              private store: Store<fromApp.AppState>) {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  ngOnInit() {
  this.storeSub =  this.store.select('auth').subscribe(authState => {
    this.isLoading = authState.loading;
    this.error = authState.authError;
    if (this.error) {
      this.showErrorAlert(this.error);
    }
    });
  }

  onSubmit (form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    if (this.isLoginMode){

      this.store.dispatch(
        new AuthActions.LoginStart({email: email, password: password})
      );
    }
    else{
   this.store.dispatch(new AuthActions.SignupStart({ email: email, password: password})
   );
    }
    this.store.select('auth').subscribe(authState => {

    });


    form.reset();
  }

  onHandleError() {
    this.store.dispatch(new AuthActions.ClearError());
  }

  private showErrorAlert (errorMessage: string) {

   const alertComponentFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent);

   const hostViewContainerRef = this.alertHost.viewContainerRef;
   hostViewContainerRef.clear();

  const componentRef = hostViewContainerRef.createComponent(alertComponentFactory);

  componentRef.instance.message = errorMessage;
  this.closeSub = componentRef.instance.close.subscribe( () =>{
    this.closeSub.unsubscribe();
    hostViewContainerRef.clear();
  });

  }

  ngOnDestroy() {
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }
}
