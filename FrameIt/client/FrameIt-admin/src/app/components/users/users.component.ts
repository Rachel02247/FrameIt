import { Component, OnInit, ViewChild, ElementRef, signal } from '@angular/core';
import { UsersService } from '../../servies/API/users/users.service'; // ייבוא User מהשירות
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { User } from '../../models/user';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  selectedUser: User = { id: 0, userName: '', email: '', roleName: '' };
  isEditing = false;
  filterRole: 'all' | 'Admin' | 'Editor' = 'all';

  addUserForm!: FormGroup;
  editUserForm!: FormGroup;

  @ViewChild('editForm') editForm!: ElementRef;

  successMessage = signal<string>('');
  errorMessage = signal<string>('');
  popupMessage = signal<string>('');
  popupType = signal<'success' | 'error'>('success');

  constructor(
    private usersService: UsersService,
    private fb: FormBuilder
  ) {
    this.addUserForm = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      roleName: ['Editor', Validators.required] 
    });
    this.editUserForm = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: [''],
      roleName: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.usersService.getUsers().subscribe(users => {
      this.users = users;
      this.applyFilter();
    });
  }

  applyFilter() {
    if (this.filterRole === 'all') {
      this.filteredUsers = this.users;
    } else {
      this.filteredUsers = this.users.filter(u => u.roleName === this.filterRole);
    }
  }

  onFilterChange(role: 'all' | 'Admin' | 'Editor') {
    this.filterRole = role;
    this.applyFilter();
  }

  selectUser(user: User) {
    this.selectedUser = { ...user };
    this.isEditing = true;
    this.editUserForm.patchValue({
      userName: user.userName,
      email: user.email,
      password: '', 
      roleName: 'Editor'
    });
    this.scrollToEditForm();
  }

  clearSelection() {
    this.selectedUser = { id: 0, userName: '', email: '', roleName: '' };
    this.isEditing = false;
    this.addUserForm.reset({ roleName: 'Editor' });
    this.editUserForm.reset();
  }

  addUser() {
    if (this.addUserForm.invalid) return;
    const newUser: User = {
      id: 0,
      userName: this.addUserForm.value.userName,
      email: this.addUserForm.value.email,
      roleName: this.addUserForm.value.roleName,
      password: this.addUserForm.value.password
    };
    this.usersService.addUser(newUser).subscribe({
      next: () => {
        this.successMessage.set('User added successfully!');
        this.errorMessage.set('');
        this.popupMessage.set('User added successfully!');
        this.popupType.set('success');
        setTimeout(() => this.popupMessage.set(''), 3000);
        this.loadUsers();
        this.clearSelection();
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: () => {
        this.errorMessage.set('Failed to add user!');
        this.successMessage.set('');
        this.popupMessage.set('Failed to add user!');
        this.popupType.set('error');
        setTimeout(() => this.popupMessage.set(''), 3000);
        setTimeout(() => this.errorMessage.set(''), 3000);
      }
    });
  }

  updateUser() {
    if (this.editUserForm.invalid) return;
    const updatedUser: User = {
      id: this.selectedUser.id,
      userName: this.editUserForm.value.userName,
      email: this.editUserForm.value.email,
      roleName: this.editUserForm.value.roleName
    };
    this.usersService.updateUser(updatedUser).subscribe({
      next: () => {
        this.popupMessage.set('User updated successfully!');
        this.popupType.set('success');
        setTimeout(() => this.popupMessage.set(''), 3000);
        this.loadUsers();
        this.clearSelection();
      },
      error: () => {
        this.popupMessage.set('Failed to update user!');
        this.popupType.set('error');
        setTimeout(() => this.popupMessage.set(''), 3000);
      }
    });
  }

  deleteUser(user: User) {
    this.usersService.deleteUser(user.id).subscribe({
      next: () => {
        this.popupMessage.set('User deleted successfully!');
        this.popupType.set('success');
        setTimeout(() => this.popupMessage.set(''), 3000);
        this.loadUsers();
        this.clearSelection();
      },
      error: () => {
        this.popupMessage.set('Failed to delete user!');
        this.popupType.set('error');
        setTimeout(() => this.popupMessage.set(''), 3000);
      }
    });
  }

  scrollToEditForm() {
    setTimeout(() => {
      this.editForm?.nativeElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  }
}
