import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingsComponent } from './settings.component';
import { UsersService } from '../../servies/users/users.service';
import { ReactiveFormsModule } from '@angular/forms';
import { of } from 'rxjs';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let usersServiceStub: Partial<UsersService>;

  beforeEach(async () => {
    usersServiceStub = {
      addUser: () => of()
    };

    await TestBed.configureTestingModule({
      imports: [SettingsComponent, ReactiveFormsModule],
      providers: [{ provide: UsersService, useValue: usersServiceStub }]
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not add admin if form is invalid', () => {
    spyOn(usersServiceStub, 'addUser');
    component.addAdminForm.setValue({ name: '', email: '' });
    component.addAdmin();
    expect(component.adminAddedMessage).toBe('');
  });

  it('should add admin if form is valid', () => {
    spyOn(usersServiceStub, 'addUser').and.returnValue(of());
    component.addAdminForm.setValue({ name: 'Admin', email: 'admin@test.com' });
    component.addAdmin();
    expect(component.adminAddedMessage).toBe('Admin added successfully!');
  });
});
