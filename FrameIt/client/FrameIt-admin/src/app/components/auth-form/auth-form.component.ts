import { Component, computed, signal, effect } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Store } from '@ngrx/store';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { selectAuthError } from '../global-states/auth/auth.selectors';
import { requestLogin, requestRegister } from '../global-states/auth/auth.action';

@Component({
  selector: 'app-auth-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatIcon
  ],
  providers: [FormBuilder], // Add FormBuilder to providers
  styleUrls: ['./auth-form.component.css'],
  templateUrl: './auth-form.component.html',
  host: { 'class': 'auth-form-root' }
})
export class AuthFormComponent {
  private loginMode = signal(true);
  public isLogInNotSuccess = signal(false);
  isLoading = false;
  hidePassword = true;

  authForm;

  loginError = signal<string | null>(null);

  constructor(private fb: FormBuilder, private store: Store, private router: Router) {

    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    effect(() => {
      this.store.select(selectAuthError).subscribe(error => {
        this.loginError.set(error);
      });
    });
  }


  isLogin = this.loginMode.asReadonly();

  toggleMode() {
    this.loginMode.set(!this.loginMode());
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  submit() {
    if (this.authForm.invalid) return;

    this.loginError.set(null);

    const { email, password } = this.authForm.value;
    this.isLoading = true;

    if (this.loginMode()) {
       this.store.dispatch(requestLogin({ email: email!, password: password! }));
      console.log('Login request dispatched successfully');
      this.isLogInNotSuccess.set(false);
      const token = sessionStorage.getItem('token');
      if (token) {
        console.log('Token found:', token);
        this.router.navigate(['/dashboard']);
      }

    } else {
      this.store.dispatch(requestRegister({ email: email!, password: password! })); // Correct action
    }
    const token = sessionStorage.getItem('token');
    if (token) {
      console.log('Token found:', token);
      this.router.navigate(['/dashboard']);
    }
    else {
      this.isLogInNotSuccess.set(true);
    }
  



  // Simulate a delay for demonstration purposes
  setTimeout(() => {
    this.isLoading = false; // Stop loading after action completes
  }, 2000);
  }
}
