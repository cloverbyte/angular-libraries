import { Inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  State,
  Selector,
  Action,
  StateContext,
  StateToken,
  Store,
} from '@ngxs/store';
import { CONFIG, LibraryConfig } from '../../config';
import { User } from '../../models/user';
import { AuthService } from '../../services/auth/auth.service';
import { UserService } from '../../services/user/user.service';
import { CreateUser } from '../user/user.action';
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

@State<AuthStateModel>({
  name: AUTH_STATE_TOKEN,
  defaults: {
    isAuthenticated: null,
    emailVerified: false,
    photoURL: '',
  },
})
@Injectable()
export class AuthState {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    @Inject(CONFIG) private config: LibraryConfig,
    private store: Store
  ) {
    console.log('AuthState ctor', config.defaultPhotoUrl);

    // init path from config
    this.store.dispatch(
      new SetPhotoURL({ path: config.defaultPhotoUrl as string })
    );
  }

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
  async login(ctx: StateContext<AuthStateModel>, action: Login) {
    console.log('Login', action.payload);

    const usr = await this.authService.login(
      action.payload.email,
      action.payload.password
    );

    this._setAuthentication(ctx, usr);

    this.router.navigateByUrl(this.config.loginNavigationPath, {
      replaceUrl: true,
    });
  }

  @Action(Logout)
  async logout(ctx: StateContext<AuthStateModel>) {
    console.log('Logout');

    await this.authService.logout();

    ctx.patchState({
      isAuthenticated: false,
    });

    this.router.navigateByUrl(this.config.logoutNavigationPath, {
      replaceUrl: true,
    });
  }

  @Action(SignUp)
  async register(_ctx: StateContext<AuthStateModel>, action: SignUp) {
    console.log('SignUp', action.payload);

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

    if (this.config.useFirestoreUserPersistence) {
      return this.store.dispatch(new CreateUser(user)).subscribe(() => {
        this.authService.setAuth(userCred.user);

        this.router.navigateByUrl(this.config.loginNavigationPath, {
          replaceUrl: true,
        });
      });
    } else {
      return this.userService.create(user).subscribe(() => {
        this.authService.setAuth(userCred.user);

        this.router.navigateByUrl(this.config.loginNavigationPath, {
          replaceUrl: true,
        });
      });
    }
  }

  @Action(SetAuthentication)
  setAuthentication(
    ctx: StateContext<AuthStateModel>,
    action: SetAuthentication
  ) {
    console.log('SetAuthentication', action.payload);

    this._setAuthentication(ctx, action.payload);
  }

  @Action(SetEmailVerification)
  setEmailVerification(
    ctx: StateContext<AuthStateModel>,
    action: SetEmailVerification
  ) {
    console.log('SetEmailVerification', action.payload);

    ctx.patchState({
      emailVerified: action.payload.verified,
    });
  }

  @Action(SetPhotoURL)
  setPhotoURL(ctx: StateContext<AuthStateModel>, action: SetPhotoURL) {
    console.log('SetPhotoURL', action.payload);

    ctx.patchState({
      photoURL: action.payload.path
        ? action.payload.path
        : this.config.defaultPhotoUrl,
    });
  }

  private _setAuthentication(ctx: StateContext<AuthStateModel>, result: any) {
    ctx.patchState({
      isAuthenticated: !!result,
    });
  }
}
