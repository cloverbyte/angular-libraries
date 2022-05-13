import { Injectable } from '@angular/core';
import { Store } from '@ngxs/store';
import {
  SetAuthentication,
  SetEmailVerification,
  SetPhotoURL,
} from '../../store/auth/auth.action';
import { FetchUser } from '../../store/user/user.action';

import {
  signInWithEmailAndPassword,
  signOut,
  getIdToken,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updatePassword,
  sendPasswordResetEmail,
  Auth,
  UserCredential,
  User,
} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private afAuth: Auth, private store: Store) {
    console.log('%c ctor AuthService', 'color: lightgreen');

    this.afAuth.onAuthStateChanged((user) => {
      this.setAuth(user);
    });
  }

  setAuth(user: User | null) {
    // console.log('%c AUTH SERVICE user', 'color: lightgreen', user);
    console.log('%c user id', 'color: lightgreen', user?.uid);
    // console.log('%c photoURL', 'color: lightgreen', user?.photoURL);

    if (user) {
      this.store.dispatch(new FetchUser({ id: user.uid }));
      this.store.dispatch(new SetAuthentication(user));
      this.store.dispatch(
        new SetEmailVerification({ verified: user.emailVerified })
      );
      this.store.dispatch(new SetPhotoURL({ path: user.photoURL }));
    } else {
      this.store.dispatch(new SetAuthentication(null));
      this.store.dispatch(new SetEmailVerification({ verified: false }));
      this.store.dispatch(new SetPhotoURL({ path: null }));
    }
  }

  async login(email: string, password: string): Promise<UserCredential> {
    return await signInWithEmailAndPassword(this.afAuth, email, password);
  }

  async logout(): Promise<void> {
    return await signOut(this.afAuth);
  }

  async getToken(): Promise<string> {
    const currentUser: User = this.afAuth.currentUser as User;
    return await getIdToken(currentUser);
  }

  async signUp(email: string, password: string): Promise<any> {
    try {
      const userCred = await createUserWithEmailAndPassword(
        this.afAuth,
        email,
        password
      );

      const currentUser: User = this.afAuth.currentUser as User;
      await sendEmailVerification(currentUser);

      return userCred;
    } catch (err: any) {
      console.error(err.message);
    }
  }

  async sendPasswordResetEmail(email: string): Promise<void> {
    return await sendPasswordResetEmail(this.afAuth, email);
  }

  async resetPassword(password: string): Promise<void> {
    const currentUser: User = this.afAuth.currentUser as User;
    return await updatePassword(currentUser, password);
  }

  async sendVerificationEmail(): Promise<void> {
    const currentUser: User = this.afAuth.currentUser as User;
    return await sendEmailVerification(currentUser);
  }
}
