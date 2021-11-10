import {Component, ComponentFactoryResolver, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {NgForm} from "@angular/forms";
import {AuthResponseData, AuthService} from "./auth.service";
import {Observable, Subscription} from "rxjs";
import {Store} from "@ngrx/store";

import {Router} from "@angular/router";
import {AlertComponent} from "../shared/alert/alert.component";
import {PlaceholderDirective} from "../shared/placeholder/placeholder.directive";
import * as fromApp from '../GlobalStore/app.reducer';
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

  constructor(private authService: AuthService,
              private router: Router,
              private componentFactoryResolver: ComponentFactoryResolver,
              private store: Store<fromApp.AppState>) {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  ngOnInit() {
    this.store.select('auth').subscribe(authState => {
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

    let authObservable: Observable<AuthResponseData>
    this.isLoading = true;
    if (this.isLoginMode){
    //authObservable =  this.authService.login(email, password);
      this.store.dispatch(new AuthActions.LoginStart({email: email, password: password}))
    }
    else{
     authObservable = this.authService.signup(email,password);
    }
    this.store.select('auth').subscribe(authState => {

    });

   /* authObservable.subscribe( resData => {
        console.log(resData);
        this.isLoading = false;
        this.router.navigate(['./recipes']);
      },
      errorMessage => {
        console.log(errorMessage);
        this.error = errorMessage;
        this.showErrorAlert(errorMessage);
        this.isLoading = false;
      });*/

    form.reset();
  }

  onHandleError() {
    this.error = null;
  }

  private showErrorAlert (errorMessage: string) {
   // const alertComp = new AlertComponent();
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
  }
}
