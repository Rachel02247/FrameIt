import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { SettingsService } from '../../servies/settingsService/settings.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterOutlet, SidebarComponent, HeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
  standalone: true
})
export class DashboardComponent {

  isSidebarCollapsed = signal(false);

  constructor(private settingsService: SettingsService) {
   
    this.settingsService.sideBarIsCollapsed$
      .pipe(takeUntilDestroyed())
      .subscribe(val => this.isSidebarCollapsed.set(val));
  }
}
