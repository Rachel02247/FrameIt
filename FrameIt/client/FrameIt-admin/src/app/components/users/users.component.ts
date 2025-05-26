import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  selectedUser: User = { userName: '', email: '', roleName: '' };
  isEditing = false;
  filterRole: 'all' | 'Admin' | 'Editor' = 'all';

  addUserForm!: FormGroup;
  editUserForm!: FormGroup;

  @ViewChild('editForm') editForm!: ElementRef;

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
    this.selectedUser = { userName: '', email: '', roleName: '' };
    this.isEditing = false;
    this.addUserForm.reset({ roleName: 'Editor' });
    this.editUserForm.reset();
  }

  addUser() {
    if (this.addUserForm.invalid) return;
    const newUser: User = {
      userName: this.addUserForm.value.userName,
      email: this.addUserForm.value.email,
      roleName: this.addUserForm.value.roleName
    };
    this.usersService.addUser(newUser).subscribe(() => {
      this.loadUsers();
      this.clearSelection();
    });
  }

  updateUser() {
    if (this.editUserForm.invalid) return;
    const updatedUser: User = {
      userName: this.editUserForm.value.userName,
      email: this.editUserForm.value.email,
      roleName: this.editUserForm.value.roleName
    };
    this.usersService.updateUser(updatedUser).subscribe(() => {
      this.loadUsers();
      this.clearSelection();
    });
  }

  deleteUser(user: User) {
    this.usersService.deleteUser(user.email).subscribe(() => {
      this.loadUsers();
      this.clearSelection();
    });
  }

  scrollToEditForm() {
    setTimeout(() => {
      this.editForm?.nativeElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 0);
  }
}
