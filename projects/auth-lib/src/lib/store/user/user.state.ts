import { Injectable } from '@angular/core';
import {
  State,
  Selector,
  Action,
  StateContext,
  StateToken,
  Store,
} from '@ngxs/store';
import { tap } from 'rxjs/operators';
import { User } from '../../models/user';
import { UserService } from '../../services/user/user.service';
import { Logout } from '../auth/auth.action';
import {
  DeleteUser,
  FetchUser,
  UpdateUser,
  UserStateModel,
} from './user.action';
// import { Logout, User, UserService } from 'dist/auth-lib/public-api';
// import { Logout, User, UserService } from 'projects/auth-lib/src/public-api';

const USER_STATE_TOKEN = new StateToken<UserStateModel>('user');

@State<UserStateModel>({
  name: USER_STATE_TOKEN,
})
@Injectable()
export class UserState {
  constructor(
    private userService: UserService,
    // private toastController: ToastController,
    private store: Store
  ) {}

  @Selector()
  static getEntity(state: UserStateModel): User {
    return state.entity;
  }

  @Action(FetchUser)
  fetch({ setState }: StateContext<UserStateModel>, action: FetchUser) {
    return this.userService.findById(action.payload.id).pipe(
      tap((result) => {
        // const userOption = {
        //   id: result.id,
        //   name: `${result.firstName} ${result.lastName}`,
        //   type: 'user',
        // };

        // this.store.dispatch(new PushFromOption(userOption));

        setState({
          entity: result,
        });
      })
    );
  }

  @Action(UpdateUser)
  update(
    { patchState }: StateContext<UserStateModel>,
    { payload, id }: UpdateUser
  ) {
    return this.userService.updateUserInfo(id, payload).pipe(
      tap(async (result) => {
        patchState({
          entity: result,
        });

        // await this.presentToast('User info updated.');
      })
    );
  }

  @Action(DeleteUser)
  async delete(action: DeleteUser) {
    try {
      this.userService.delete(action.payload.id).subscribe(() => {
        this.store.dispatch(new Logout());
      });
    } catch (error: any) {
      console.error(error.message);
    }
  }

  // private async presentToast(msg: string) {
  //   const toast = await this.toastController.create({
  //     message: msg,
  //     duration: 2000,
  //   });
  //   toast.present();
  // }
}
