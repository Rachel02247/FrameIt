import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsersComponent } from './users.component';
import { UsersService } from '../../servies/users/users.service';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let usersServiceStub: Partial<UsersService>;

  beforeEach(async () => {
    usersServiceStub = {
      getUsers: () => of([]),
      addUser: () => of(),
      updateUser: () => of(),
      deleteUser: () => of()
    };

    await TestBed.configureTestingModule({
      declarations: [UsersComponent],
      imports: [FormsModule],
      providers: [{ provide: UsersService, useValue: usersServiceStub }]
    }).compileComponents();

    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    spyOn(component, 'loadUsers');
    component.ngOnInit();
    expect(component.loadUsers).toHaveBeenCalled();
  });
});
