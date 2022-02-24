// import { User } from 'projects/auth-lib/src/public-api';

import { User } from '../../models/user';

// import { User } from 'dist/auth-lib/public-api';

export interface UserStateModel {
  entity: User;
}

export class FetchUser {
  static readonly type = '[User] Fetch';
  constructor(public payload: { id: string }) {}
}

export class UpdateUser {
  static readonly type = '[User] Update';
  constructor(public payload: User, public id: string) {}
}

export class DeleteUser {
  static readonly type = '[User] Delete';
  constructor(public payload: { id: string }) {}
}
