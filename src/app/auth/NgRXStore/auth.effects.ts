import {Injectable} from "@angular/core";
import {Actions, Effect, ofType} from '@ngrx/effects'
import * as AuthActions from './auth.actions';
import {catchError, map, switchMap, tap} from "rxjs/operators";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {of, throwError} from "rxjs";
import {Router} from "@angular/router";


export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean; //? = optional

}

@Injectable()
export class AuthEffects {
  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' +
        environment.firebaseAPIKey,
        {
          email: authData.payload.email,
          password: authData.payload.password,
          returnSecureToken: true
        }
      ).pipe(
        map(resData => {
          const expirationDate = new Date
          (new Date().getTime() + +resData.expiresIn * 1000
          );
          return new AuthActions.Login({
              email: resData.email,
              userId: resData.localId,
              token: resData.idToken,
              expirationDate: expirationDate
            });
        }),
        catchError(errorResponse => {
          let errorMesaage = 'An unknown error occured!';
          if (!errorResponse.error || !errorResponse.error.error) {
            return of(new AuthActions.LoginFail(errorMesaage));
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
          return of(new AuthActions.LoginFail(errorMesaage));
        })
      );
    })
  );
  @Effect({dispatch: false})
  authSuccess = this.actions$.pipe(ofType(AuthActions.LOGIN),
    tap(() => {
  this.router.navigate(['/']);
  }));

  constructor(private actions$: Actions, private http: HttpClient, private router: Router) {
  }
}
