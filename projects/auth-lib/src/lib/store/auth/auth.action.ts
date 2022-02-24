export interface AuthStateModel {
  isAuthenticated: boolean | null;
  emailVerified: boolean;
  photoURL: string;
}

export class Login {
  static readonly type = '[Auth] Login';
  constructor(public payload: { email: string; password: string }) {}
}

export class Logout {
  static readonly type = '[Auth] Logout';
}

export class SignUp {
  static readonly type = '[Auth] SignUp';
  constructor(
    public payload: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    }
  ) {}
}

export class SetAuthentication {
  static readonly type = '[Auth] SetAuthentication';
  constructor(public payload: any) {}
}

export class SetEmailVerification {
  static readonly type = '[Auth] SetEmailVerification';
  constructor(public payload: { verified: boolean }) {}
}

export class SetPhotoURL {
  static readonly type = '[Auth] SetPhotoURL';
  constructor(public payload: { path: string | null }) {}
}
