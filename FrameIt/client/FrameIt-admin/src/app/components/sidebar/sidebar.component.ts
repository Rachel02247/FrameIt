import { CommonModule } from '@angular/common';
import { Component, input, Input, signal } from '@angular/core';
import { Router, RouterLink, NavigationEnd } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { logout } from '../global-states/auth/auth.action';
import { MatIconModule } from '@angular/material/icon';
import { SettingsService } from '../../servies/settingsService/settings.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface MenuItem {
  title: string;
  icon: string;
  route: string;
  active: boolean;
}

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, MatIconModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: true,
})
export class SidebarComponent {

  isSidebarCollapsed = signal(false);

  menuItems: MenuItem[] = [
    { title: 'Analytics', icon: 'stacked_line_chart', route: '/dashboard/analytics', active: false },
    { title: 'Users', icon: 'people', route: '/dashboard/users', active: false },
    { title: 'Settings', icon: 'settings', route: '/dashboard/settings', active: false },
  ];


  constructor(
    private settingsService: SettingsService,
    private router: Router,
    private store: Store<{ auth: { isLoggedIn: boolean } }>,
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.setActiveMenuItem();
      }
    });

    this.settingsService.sideBarIsCollapsed$
      .pipe(takeUntilDestroyed())
      .subscribe((isCollapsed: boolean) => {
        this.isSidebarCollapsed.set(isCollapsed);
      });
  }

  ngOnInit(): void {
    this.setActiveMenuItem();
  }

  setActiveMenuItem(): void {
    const currentUrl = this.router.url;
    this.menuItems.forEach((item) => {
      item.active = currentUrl.includes(item.route);
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
    this.setActiveMenuItem();
  }

  logout(): void {
    this.store.dispatch(logout({ message: 'User logged out' }));
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

}
