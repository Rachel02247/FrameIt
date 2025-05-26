import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor() { }
  
  private IsSideBarCollapsed = new BehaviorSubject<boolean>(false);
  sideBarIsCollapsed$: Observable<boolean> = this.IsSideBarCollapsed.asObservable();

  setSideBarCollapsed(collapsed: boolean): void {
    this.IsSideBarCollapsed.next(collapsed);
  }
}
