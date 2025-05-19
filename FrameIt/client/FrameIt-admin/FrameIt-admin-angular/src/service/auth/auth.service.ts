import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { B } from '@angular/cdk/keycodes';
import { BehaviorSubject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLoggedIn = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {

    const token = typeof window !== 'undefined' ? sessionStorage.getItem('token') : null;
    this.isLoggedIn.next(!!token);

  }

  apiUrl = `${environment.apiUrl}/auth/login`;

  login = (email: string, password: string) => {
    return this.http.post<{ token: string }>(this.apiUrl, { email, password },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    .pipe(
      tap(response => {
        const token = response.token;
        sessionStorage.setItem('token', token);
        this.isLoggedIn.next(true);
      })
    );
  }

  logout = () => {
    sessionStorage.removeItem('token');
    this.isLoggedIn.next(false);
  }
}
