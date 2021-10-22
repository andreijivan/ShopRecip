import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, tap} from "rxjs/operators";
import {BehaviorSubject, throwError} from "rxjs";
import {UserModel} from "./user.model";
import {Router} from "@angular/router";
import {environment} from "../../environments/environment";

export interface AuthResponseData {
idToken: string;
email: string;
refreshToken: string;
expiresIn: string;
localId: string;
registered?: boolean; //? = optional

}

@Injectable()
export class AuthService {
  user = new BehaviorSubject<UserModel>(null);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {}

  signup(emailFromSignUp: string, pwdFromSignUp: string) {
   return this.http.post<AuthResponseData>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.firebaseAPIKey,
      {
        email: emailFromSignUp,
        password: pwdFromSignUp,
        returnSecureToken: true
      }).pipe(catchError(this.handleError), tap(respData => {
        this.handleAuthenticationOrSignup(
          respData.email,
          respData.localId,
          respData.idToken,
          +respData.expiresIn)
      })
   );
  }

  login (emailForLogin: string, passwordForLogin: string) {
  return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebaseAPIKey,
    {
      email: emailForLogin,
      password: passwordForLogin,
      returnSecureToken: true
    }).pipe(catchError(this.handleError), tap(respData => {
    this.handleAuthenticationOrSignup(
      respData.email,
      respData.localId,
      respData.idToken,
      +respData.expiresIn)
  }));
  }

  autologin() {

    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }
    const loadedUser = new UserModel(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate));

    if (loadedUser.token) {
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
      this.user.next(loadedUser);
    }
  }

  private handleAuthenticationOrSignup(email: string, localId: string, idToken: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new UserModel(
      email,
      localId,
      idToken,
      expirationDate);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError (errorResponse: HttpErrorResponse) {
    let errorMesaage = 'An unknown error occured!';
    if (!errorResponse.error || !errorResponse.error.error) {
      return throwError(errorMesaage)
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
    return throwError(errorMesaage);
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    console.log(expirationDuration);
   this.tokenExpirationTimer = setTimeout(()=>{
      this.logout();
    }, expirationDuration);
  }

}
