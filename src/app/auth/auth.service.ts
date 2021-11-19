import {Injectable} from "@angular/core";
import {Store} from "@ngrx/store";
import * as fromApp from '../AppStore/app.reducer';
import * as AuthActions from "../auth/NgRXStore/auth.actions";

@Injectable()
export class AuthService {
  private tokenExpirationTimer: any;

  constructor(private store: Store<fromApp.AppState>) {}

  setLogoutTimer(expirationDuration: number) {
   this.tokenExpirationTimer = setTimeout(()=>{
      this.store.dispatch(new AuthActions.Logout());
    }, expirationDuration);
  }

  clearLogoutTimer() {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }

}
