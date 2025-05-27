import { Component, computed, signal, effect, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { reduceState, Store } from '@ngrx/store';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatIcon } from '@angular/material/icon';
import { Router } from '@angular/router';
import { selectAuthError, selectAuthLoading, selectUser } from '../global-states/auth/auth.selectors';
import { loginSuccess, requestLogin } from '../global-states/auth/auth.action';
import { AuthService } from '../../servies/API/auth/auth.service';
import { merge } from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

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
  styleUrls: ['./auth-form.component.css'],
  templateUrl: './auth-form.component.html',
})
export class AuthFormComponent {

  isLoginNotSuccess = signal<boolean>(false);
  hidePassword = signal<boolean>(true);
  errorMessage = signal<string>('')
  isLoading = signal<boolean>(false);

  authForm: FormGroup;

  loginError = signal<string | null>(null);

  constructor(private fb: FormBuilder, private store: Store, private router: Router, private authService: AuthService) {

    this.authForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    effect(() => {
      this.store.select(selectAuthError).subscribe(error => {
        this.loginError.set(error);
      });
    });

    effect(() => {
      this.store.select(selectAuthLoading).subscribe(loading => {
        this.isLoading.set(loading);
      });
    });

    effect(() => {
      this.store.select(selectUser).subscribe(user => {
        if (user) {
          this.router.navigate(['/dashboard']);
        }
      });
    });

    this.emailValidator(); 
  }

  // ngOnInit() {
  //   this.store.select() {
  //       this.router.navigate(['/dashboard']);
  //     }
  //   });
  // }


   togglePassword(event: MouseEvent) {
    this.hidePassword.set(!this.hidePassword());
    event.stopPropagation();
  }

  get email() {
    return this.authForm.get('email')!;
  }

    emailValidator() {
    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }

  updateErrorMessage() {
    if (this.email.hasError('required')) {
      this.errorMessage.set('You must enter a value');
    } else if (this.email.hasError('email')) {
      this.errorMessage.set('Not a valid email');
    } else {
      this.errorMessage.set('');
    }
  }

  submit() {
    if (this.authForm.invalid) return;

    this.loginError.set(null);

    const { email, password } = this.authForm.value;

    if (email && password) {
      this.store.dispatch(requestLogin({ email: email!, password: password! }));
      this.isLoginNotSuccess.set(false);
    }
    const token = sessionStorage.getItem('token');
    if (token) {
      console.log('Token found:', token);
      this.router.navigate(['/dashboard']);
    }
    else {
      this.isLoginNotSuccess.set(true);
    }

  }
}
