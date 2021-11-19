import {Injectable} from "@angular/core";
import {Actions, Effect, ofType} from '@ngrx/effects'
import {catchError, map, switchMap, tap} from "rxjs/operators";
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {of} from "rxjs";

import {environment} from "../../../environments/environment";
import {UserModel} from "../user.model";
import {AuthService} from "../auth.service";
import * as AuthActions from './auth.actions';


export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean; //? = optional

}

const handleAuthentication = (
  expiresIn: number,
  email: string,
  userId: string,
  token: string ) => {
  const expirationDate = new Date
  (new Date().getTime() + expiresIn * 1000);
  const user = new UserModel(email, userId, token, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));
  return new AuthActions.AuthenticateSuccess({
    email: email,
    userId: userId,
    token: token,
    expirationDate: expirationDate,
    redirect: true
  });
}

const handleError = (errorResponse: any) => {
  let errorMesaage = 'An unknown error occured!';
  if (!errorResponse.error || !errorResponse.error.error) {
    return of(new AuthActions.AuthenticateFail(errorMesaage));
  }
  switch (errorResponse.error.error.message){
    case 'EMAIL_EXISTS':
      errorMesaage = 'This email exists already';
      break;
    case 'EMAIL_NOT_FOUND':
      errorMesaage = 'Invalid credentials. Try again';
      break;
    case 'INVALID_PASSWORD':
      errorMesaage = 'Invalid credentials. Try again';
      break;
  }
  return of(new AuthActions.AuthenticateFail(errorMesaage));
}

@Injectable()
export class AuthEffects {

  @Effect()
  authSignup = this.actions$.pipe(ofType(AuthActions.SIGNUP_START),
    switchMap((signupAction: AuthActions.SignupStart) => {
      return this.http.post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
        {
          email: signupAction.payload.email,
          password: signupAction.payload.password,
          returnSecureToken: true
        }
        ).pipe(
          tap(resData => {
          this.authService.setLogoutTimer(+resData.expiresIn * 1000);
          }),
        map(resData => {
        return  handleAuthentication(
            +resData.expiresIn,
            resData.email,
            resData.localId,
            resData.idToken
        );
        }),
        catchError(errorResponse => {
          return handleError(errorResponse)
        })
      );;
    })
  );

  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http.post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
        environment.firebaseAPIKey,
        {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true
        }
      ).pipe(
        tap(resData => {
          this.authService.setLogoutTimer(+resData.expiresIn * 1000);
        }),
        map(resData => {
          return  handleAuthentication(
            +resData.expiresIn,
            resData.email,
            resData.localId,
            resData.idToken
          );
        }),
        catchError(errorResponse => {
          return handleError(errorResponse)
        })
      );
    })
  );

  @Effect({dispatch: false})
  authRedirect = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS),
    tap((authSuccessAction:AuthActions.AuthenticateSuccess) => {
      if (authSuccessAction.payload.redirect) {
       this.router.navigate(['/']);
      }
  }));

  @Effect()
  autoLogin = this.actions$.pipe(
    ofType(AuthActions.AUTO_LOGIN),
    map(() => {
      const userData: {
        email: string;
        id: string;
        _token: string;
        _tokenExpirationDate: string;
      } = JSON.parse(localStorage.getItem('userData'));
      if (!userData) {
        return{ type: 'DUMMY'};
      }
      const loadedUser = new UserModel(
        userData.email,
        userData.id,
        userData._token,
        new Date(userData._tokenExpirationDate));

      if (loadedUser.token) {
        //  this.user.next(loadedUser);
            const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
        this.authService.setLogoutTimer(expirationDuration);
        return new AuthActions.AuthenticateSuccess({
            email: loadedUser.email,
            userId: loadedUser.id,
            token: loadedUser.token,
            expirationDate: new Date(userData._tokenExpirationDate),
            redirect: false
          });

      }
      return { type: 'DUMMY'};
    })
  )


  @Effect({dispatch: false})
  authLogout = this.actions$.pipe(
    ofType(AuthActions.LOGOUT),
    tap(() => {
      this.authService.clearLogoutTimer();
    localStorage.removeItem('userData');
    this.router.navigate(['/auth']);
  }))

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private router: Router,
    private authService: AuthService) {
  }
}
