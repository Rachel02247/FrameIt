import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = `${environment.apiUrl}auth`;

  constructor(private http: HttpClient) {}

  isLoggedIn(): boolean {
    return !!sessionStorage.getItem('token');
  }

  login(email: string, password: string) {
    console.log(`Logging in with email: ${email}`);
    return this.http.post<{ token: string }>(`${this.baseUrl}/login`, { email, password }).pipe(
      tap(response => {
        if (response && response.token) {
          sessionStorage.setItem('token', response.token);
        }
      })
    );
  }

  sendRegistrationRequest(email: string, password: string) {
    return this.http.post(`${this.baseUrl}/register-request`, { email, password });
  }
}


