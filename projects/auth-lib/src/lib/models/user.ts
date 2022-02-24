export interface User {
  // uid: string;
  // email: string;
  // displayName: string;
  // photoURL: string;
  // emailVerified: boolean;

  id: string;
  dateCreated?: Date;

  firstName: string;
  lastName: string;
  email: string;
  stripeCustomerId?: string;
  subscription?: string;

  photoURL?: string;
}
