import { Inject, Injectable } from '@angular/core';
import { State, Selector, Action, StateContext, StateToken } from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { User } from '../../models/user';
import { UserService } from '../../services/user/user.service';
import {
  CreateUser,
  FetchUser,
  UpdateUser,
  UserStateModel,
} from './user.action';

import {
  Firestore,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from '@angular/fire/firestore';
import { CONFIG, LibraryConfig } from '../../config';

const USER_STATE_TOKEN = new StateToken<UserStateModel>('user');
const PATHNAME = 'user';

@State<UserStateModel>({
  name: USER_STATE_TOKEN,
})
@Injectable()
export class UserState {
  constructor(
    private userService: UserService,
    private firestore: Firestore,
    @Inject(CONFIG) private config: LibraryConfig
  ) {}

  @Selector()
  static getEntity(state: UserStateModel): User {
    return state.entity;
  }

  @Action(FetchUser)
  async fetch({ setState }: StateContext<UserStateModel>, action: FetchUser) {
    console.log('FetchUser', action.payload);

    if (this.config.useFirestoreUserPersistence) {
      console.log('FetchFeeding', action);

      const docSnap = await getDoc(
        doc(this.firestore, PATHNAME, action.payload.id)
      );

      if (docSnap.exists()) {
        const usr = docSnap.data() as User;

        setState({
          entity: usr,
        });

        return;
      } else {
        //

        // setState({
        //   entity: null,
        // });
        return;
      }
    } else {
      return this.userService.findById(action.payload.id).pipe(
        tap((result) => {
          setState({
            entity: result,
          });
        })
      );
    }
  }

  @Action(CreateUser)
  async add(ctx: StateContext<UserStateModel>, { payload }: CreateUser) {
    /**
     * Creation for a separate backend is used in the AuthState's SignUp action.
     */

    console.log('CreateFeeding', { payload, path: PATHNAME });

    const userRef = doc(collection(this.firestore, PATHNAME), payload.id);

    const newUser: User = {
      ...payload,
      dateCreated: new Date(),
      id: userRef.id,
    };

    await setDoc(userRef, newUser);

    ctx.patchState({ entity: newUser });
  }

  @Action(UpdateUser)
  async update(ctx: StateContext<UserStateModel>, { payload, id }: UpdateUser) {
    console.log('UpdateUser', { payload, id });

    if (this.config.useFirestoreUserPersistence) {
      const usersRef = doc(collection(this.firestore, PATHNAME), id);

      await updateDoc(usersRef, { ...payload });

      ctx.patchState({
        entity: payload,
      });

      return;
    } else {
      return this.userService.updateUserInfo(id, payload).pipe(
        tap(async (result) => {
          ctx.patchState({
            entity: result,
          });
        })
      );
    }
  }

  // @Action(DeleteUser)
  // async delete(action: DeleteUser) {
  //   console.log('DeleteUser', action.payload);

  //   try {
  //     this.userService.delete(action.payload.id).subscribe(() => {
  //       this.store.dispatch(new Logout());
  //     });
  //   } catch (error: any) {
  //     console.error(error.message);
  //   }
  // }
}
