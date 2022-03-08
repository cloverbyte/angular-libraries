# Cloverbyte Auth

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.2.0.

## Dependencies

- @angular/fire version 7.2.1+
- @ngxs/store 3.7.3+

## Install


``` bash
npm install @cloverbyte/auth --save
```

## Setup

``` typescript
import { CloverbyteAuthModule } from '@cloverbyte/auth';

@NgModule({
  imports: [
    ...
    ...
    CloverbyteAuthModule.forRoot({ // CloverbyteAuthModule added
      apiUrl: 'SAMPLE_URL';
      loginNavigationPath: '<path to destination after login>';
      logoutNavigationPath: '<path to destination after logout>';
    }),
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
