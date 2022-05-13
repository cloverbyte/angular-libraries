import { ModuleWithProviders, NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { AuthService, UserService } from '../public-api';
import { LibraryConfig, CONFIG } from './config';
import { AuthState } from './store/auth/auth.state';
import { UserState } from './store/user/user.state';

// import { provideAuth, getAuth } from '@angular/fire/auth';

@NgModule({
  imports: [
    // provideAuth(() => getAuth()),
    NgxsModule.forRoot([AuthState, UserState]),
  ],
  providers: [AuthService, UserService],
})
export class CloverbyteAuthModule {
  static forRoot(
    config?: LibraryConfig
  ): ModuleWithProviders<CloverbyteAuthModule> {
    // User config get logged here
    // console.log('config', config);

    return {
      ngModule: CloverbyteAuthModule,
      providers: [
        // AuthService,
        // UserService,
        { provide: CONFIG, useValue: config },
      ],
    };
  }
}
