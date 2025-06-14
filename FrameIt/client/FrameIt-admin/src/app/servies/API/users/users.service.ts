import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { User } from '../../../models/user';


@Injectable({
  providedIn: 'root'
})
export class UsersService {

    private apiUrl = `${environment.apiUrl}users`;

constructor(private http: HttpClient) { }



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
    return this.http.put<void>(`${this.apiUrl}/${user.id}`, user).pipe(
      tap(() => { 
      })
    );
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        
      })
    );
  }
}
