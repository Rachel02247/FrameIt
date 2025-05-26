import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UsersService } from '../../servies/API/users/users.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { User } from '../../models/user';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  addAdminForm: FormGroup;

  adminAddedMessage = '';

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService
  ) {
    this.addAdminForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  addAdmin() {
    if (this.addAdminForm.invalid) return;
    const newAdmin = {
      id: '',
      name: this.addAdminForm.value.name,
      email: this.addAdminForm.value.email,
      password: this.addAdminForm.value.password,
      role: 'Admin'
    };
    this.usersService.addUser({userName: newAdmin.name, email: newAdmin.email, password: newAdmin.password, roleName: 'Admin'} as User ).subscribe(() => {
      this.adminAddedMessage = 'Admin added successfully!';
      this.addAdminForm.reset();
      setTimeout(() => this.adminAddedMessage = '', 3000);
    });
  }
}
