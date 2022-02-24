import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { State, Selector, Action, StateContext, StateToken } from '@ngxs/store';
import { EMPTY } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { CONFIG, LibraryConfig } from '../../config';
import { User } from '../../models/user';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user/user.service';
import {
  AuthStateModel,
  Login,
  Logout,
  SetAuthentication,
  SetEmailVerification,
  SetPhotoURL,
  SignUp,
} from './auth.action';

const AUTH_STATE_TOKEN = new StateToken<AuthStateModel>('auth');
const DEFAULT_PHOTO_URL = 'assets/img/icons/user-286.svg';

@State<AuthStateModel>({
  name: AUTH_STATE_TOKEN,
  defaults: {
    isAuthenticated: null,
    emailVerified: false,
    photoURL: DEFAULT_PHOTO_URL,
  },
})
@Injectable()
export class AuthState {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    // private toastController: ToastController,
    @Inject(CONFIG) private config: LibraryConfig
  ) {}

  @Selector()
  static isAuthenticated(state: AuthStateModel): boolean | null {
    return state.isAuthenticated;
  }

  @Selector()
  static emailVerified(state: AuthStateModel): boolean {
    return !!state.emailVerified;
  }

  @Selector()
  static photoURL(state: AuthStateModel): string {
    return state.photoURL;
  }

  @Action(Login)
  login(ctx: StateContext<AuthStateModel>, action: Login) {
    return this.authService
      .login(action.payload.email, action.payload.password)
      .pipe(
        tap((result) => {
          this._setAuthentication(ctx, result);

          this.router.navigateByUrl(this.config.loginNavigationPath, {
            replaceUrl: true,
          });
        }),
        catchError(async (err) => {
          // const toast = await this.toastController.create({
          //   message: err.message,
          //   duration: 2000,
          // });
          // toast.present();

          return EMPTY;
        })
      );
  }

  @Action(Logout)
  logout(ctx: StateContext<AuthStateModel>) {
    return this.authService.logout().pipe(
      tap(() => {
        ctx.patchState({
          isAuthenticated: false,
        });

        this.router.navigateByUrl(this.config.logoutNavigationPath, {
          replaceUrl: true,
        });
      })
    );
  }

  @Action(SignUp)
  async register(_ctx: StateContext<AuthStateModel>, action: SignUp) {
    const userCred = await this.authService.signUp(
      action.payload.email,
      action.payload.password
    );

    const user: User = {
      id: userCred.user.uid,
      firstName: action.payload.firstName,
      lastName: action.payload.lastName,
      email: action.payload.email,
    };

    return this.userService.create(user).subscribe(() => {
      this.authService.setAuth(userCred.user);

      this.router.navigateByUrl(this.config.loginNavigationPath, {
        replaceUrl: true,
      });
    });
  }

  @Action(SetAuthentication)
  setAuthentication(
    ctx: StateContext<AuthStateModel>,
    action: SetAuthentication
  ) {
    this._setAuthentication(ctx, action.payload);
  }

  @Action(SetEmailVerification)
  setEmailVerification(
    ctx: StateContext<AuthStateModel>,
    action: SetEmailVerification
  ) {
    ctx.patchState({
      emailVerified: action.payload.verified,
    });
  }

  @Action(SetPhotoURL)
  setPhotoURL(ctx: StateContext<AuthStateModel>, action: SetPhotoURL) {
    ctx.patchState({
      photoURL: action.payload.path ? action.payload.path : DEFAULT_PHOTO_URL,
    });
  }

  private _setAuthentication(ctx: StateContext<AuthStateModel>, result: any) {
    ctx.patchState({
      isAuthenticated: !!result,
    });
  }
}
