import { ModuleWithProviders, NgModule } from '@angular/core';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';
import { NgxsModule } from '@ngxs/store';
import { AuthService, UserService } from '../public-api';
import { LibraryConfig, CONFIG } from './config';
import { AuthState } from './store/auth/auth.state';
import { UserState } from './store/user/user.state';

@NgModule({
  imports: [AngularFireAuthModule, NgxsModule.forRoot([AuthState, UserState])],
  providers: [AuthService, UserService],
  // exports: [UserState, AuthState],
})
export class CloverbyteAuthModule {
  static forRoot(
    config?: LibraryConfig
  ): ModuleWithProviders<CloverbyteAuthModule> {
    // User config get logged here
    console.log('config', config);

    return {
      ngModule: CloverbyteAuthModule,
      providers: [
        AuthService,
        UserService,
        { provide: CONFIG, useValue: config },
      ],
    };
  }
}
