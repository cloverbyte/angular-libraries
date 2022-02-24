import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Store } from '@ngxs/store';
import { from, Observable } from 'rxjs';
import {
  SetAuthentication,
  SetEmailVerification,
  SetPhotoURL,
} from '../../store/auth/auth.action';
import { FetchUser } from '../../store/user/user.action';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private afAuth: AngularFireAuth,
    private store: Store // private toastController: ToastController,
  ) {
    this.afAuth.onAuthStateChanged((user) => {
      this.setAuth(user);
    });
  }

  setAuth(user: firebase.default.User | null) {
    // console.log('%c AUTH SERVICE user', 'color: lightgreen', user);
    console.log('%c user id', 'color: lightgreen', user?.uid);
    // console.log('%c photoURL', 'color: lightgreen', user?.photoURL);

    if (user) {
      this.store.dispatch(new FetchUser({ id: user.uid }));
      this.store.dispatch(new SetAuthentication(user));

      // this.store.dispatch(new FetchSubscription());

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

  login(email: string, password: string): Observable<any> {
    const temp = this.afAuth.signInWithEmailAndPassword(email, password);
    return from(temp);
  }

  logout(): Observable<void> {
    return from(this.afAuth.signOut());
  }

  async getToken(): Promise<Promise<string> | undefined> {
    const currentUser = await this.afAuth.currentUser;
    return currentUser?.getIdToken();
  }

  async signUp(email: string, password: string): Promise<any> {
    try {
      const userCred = await this.afAuth.createUserWithEmailAndPassword(
        email,
        password
      );

      await userCred.user?.sendEmailVerification();

      return userCred;
    } catch (err: any) {
      // this.presentToast(err.message);

      console.error(err.message);
    }
  }

  sendPasswordResetEmail(email: string): void {
    this.afAuth
      .sendPasswordResetEmail(email)
      .then(async () => {
        // await this.presentToast('You will receive an email in a moment.');
        console.log('');
      })
      .catch(async (err) => {
        // await this.presentToast(err.message);

        console.error(err.message);
      });
  }

  async resetPassword(password: string) {
    const currentUser = await this.afAuth.currentUser;
    return currentUser
      ?.updatePassword(password)
      .then(async () => {
        // await this.presentToast('Be sure to save it in a safe place.');
        console.log('');
      })
      .catch(async (err) => {
        // await this.presentToast(err.message);

        console.error(err.message);
      });
  }

  async sendVerificationEmail() {
    const currentUser = await this.afAuth.currentUser;
    return currentUser
      ?.sendEmailVerification()
      .then(async () => {
        // await this.presentToast('You will receive an email in a moment.');
        console.log('');
      })
      .catch(async (err) => {
        // await this.presentToast(err.message);

        console.error(err.message);
      });
  }

  // private async presentToast(msg: string) {
  //   const toast = await this.toastController.create({
  //     message: msg,
  //     duration: 2000,
  //   });
  //   toast.present();
  // }
}
