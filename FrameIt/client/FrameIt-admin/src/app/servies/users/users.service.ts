import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment.development';

export interface User {
  userName: string;
  password?: string;
  email: string;
  roleName: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {

    private apiUrl = `${environment.apiUrl}users`;

constructor(private http: HttpClient) { }

  private users: User[] = [
    { userName: 'Alice Smith', email: 'alice@example.com', roleName: 'admin' },
    { userName: 'Bob Johnson', email: 'bob@example.com', roleName: 'Editor' }
  ];

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  addUser(user: User): Observable<void> {
    return this.http.post<void>(this.apiUrl, user).pipe(
      tap(() => {
        
      })
    );
  }

  updateUser(user: User): Observable<void> {
    const idx = this.users.findIndex(u => u.email === user.email);
    if (idx > -1) this.users[idx] = { ...user };
    return of();
  }

  deleteUser(email: string): Observable<void> {
    this.users = this.users.filter(u => u.email !== email);
    return of();
  }
}
