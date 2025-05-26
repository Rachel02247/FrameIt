import { TestBed } from '@angular/core/testing';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return users', (done) => {
    service.getUsers().subscribe(users => {
      expect(Array.isArray(users)).toBeTrue();
      done();
    });
  });

  it('should add, update, and delete a user', (done) => {
    const user = { id: '', name: 'Test', email: 'test@test.com' };
    service.addUser(user).subscribe(() => {
      service.getUsers().subscribe(users => {
        const added = users.find(u => u.name === 'Test');
        expect(added).toBeTruthy();
        if (added) {
          added.name = 'Updated';
          service.updateUser(added).subscribe(() => {
            service.getUsers().subscribe(updatedUsers => {
              expect(updatedUsers.find(u => u.name === 'Updated')).toBeTruthy();
              service.deleteUser(added.id).subscribe(() => {
                service.getUsers().subscribe(finalUsers => {
                  expect(finalUsers.find(u => u.id === added.id)).toBeFalsy();
                  done();
                });
              });
            });
          });
        }
      });
    });
  });
});
