# Cloverbyte Auth

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.2.0.

## Dependencies

- @angular/fire version 7.2.1+
- @ngxs/store 3.7.3+
- firebase 9.4.0+
- rxfire 6.0.0+

## Install

``` bash
npm install @cloverbyte/auth
```

## Setup

``` typescript
import { CloverbyteAuthModule } from '@cloverbyte/auth';

@NgModule({
  imports: [
    ...
    ...
    // import angular/fire initializers
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => {
      console.log('PROVIDE AUTH');

      if (Capacitor.isNativePlatform()) {
        console.log('isNativePlatform');

        return initializeAuth(getApp(), {
          persistence: indexedDBLocalPersistence,
        });

        // return initializeAuth(getApp());
      } else {
        console.log('NOT a native platform');

        return getAuth();
      }
    }),

    // import CloverbyteAuthModule
    CloverbyteAuthModule.forRoot({
      apiUrl: 'SAMPLE_URL',
      loginNavigationPath: '<path to destination after login>',
      logoutNavigationPath: '<path to destination after logout>',
      defaultPhotoUrl: '<path to default profile photo>',
      useFirestoreUserPersistence: true,
    }),

    // import state management
    NgxsModule.forRoot([
      ...
      AuthState,
      UserState,
      ...
    ]),
    ...
    ...
  ],
  bootstrap: [App],
  declarations: [App],
})
class AppModule {}

```

## API

### User

| Method          	| Description 	|
|-----------------	|-------------	|
| findById        	|             	|
| updateUserInfo  	|             	|
| updateUserPhoto 	|             	|
| create          	|             	|
| delete          	|             	|

### Auth

| Method                 	| Description 	|
|------------------------	|-------------	|
| setAuth                	|             	|
| login                  	|             	|
| logout                 	|             	|
| getToken               	|             	|
| signUp                 	|             	|
| sendPasswordResetEmail 	|             	|
| resetPassword          	|             	|
| sendVerificationEmail  	|             	|
