import { Component, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { merge } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../service/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent implements OnInit {

  
  constructor(private authService: AuthService, private fb: FormBuilder, private router: Router) {
    merge(this.email.statusChanges, this.email.valueChanges)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.updateErrorMessage());
  }


  form: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)])
  });

  ngOnInit() {
    this.form = this.fb.group({
      email: '',
      password: ''
    });
  }


  get email() {
    return this.form.get('email') as FormControl;
  }
  get password() {
    return this.form.get('password') as FormControl;
  }

  //email
  errorMessage = signal('');

  updateErrorMessage() {
    if (this.email.hasError('required') && this.email.touched) {
      this.errorMessage.set('You must enter a value');
    } else if (this.email.hasError('email') && this.email.touched) {
      this.errorMessage.set('Not a valid email');
    } else {
      this.errorMessage.set('');
    }
  }

  //password
  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  isLoginOk = signal(true);

  onSubmit() {
    if (this.email.valid && this.password.valid) {
      const email = this.email.value;
      const password = this.password.value;
      this.authService.login(email ?? '', password ?? '').subscribe(
        response => {
          console.log('Login successful', response);
          this.router.navigate(['/dashboard']);

        },
        error => {
          console.error('Login failed', error);
          this.isLoginOk.set(false);
          console.log(this.isLoginOk());
        }
      );

    } else {
      console.log('Form is invalid');
    }
  }

}
