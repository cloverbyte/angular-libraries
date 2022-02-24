import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { CONFIG, LibraryConfig } from '../../config';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  resourceName = 'users';

  constructor(
    private http: HttpClient,
    private afAuth: AngularFireAuth,
    @Inject(CONFIG) private config: LibraryConfig
  ) {}

  findById(id: string): Observable<User> {
    return this.http.get<User>(
      `${this.config.apiUrl}/${this.resourceName}/${id}`
    );
  }

  updateUserInfo(
    id: string,
    info: { firstName?: string; lastName?: string; subscription?: string }
  ): Observable<User> {
    return this.http.patch<User>(
      `${this.config.apiUrl}/${this.resourceName}/${id}`,
      info
    );
  }

  async updateUserPhoto(path: string) {
    console.log('updateUserPhoto', path);

    const user = await this.afAuth.currentUser;
    user?.updateProfile({ photoURL: path });

    return this.http.patch<User>(
      `${this.config.apiUrl}/${this.resourceName}/${user?.uid}`,
      { photoURL: path }
    );
  }

  create(user: {
    id: string;
    firstName: string;
    lastName: string;
  }): Observable<User> {
    return this.http.post<User>(
      `${this.config.apiUrl}/${this.resourceName}`,
      user
    );
  }

  delete(id: string): Observable<User> {
    return this.http.delete<User>(
      `${this.config.apiUrl}/${this.resourceName}/${id}`
    );
  }
}
