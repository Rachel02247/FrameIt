import { CommonModule } from '@angular/common';
import { Component, Output, output } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { SettingsService } from '../../servies/settingsService/settings.service';
@Component({
  selector: 'app-header',
  imports: [CommonModule, MatIcon],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  standalone: true,
})
export class HeaderComponent {

  constructor(private settingsService: SettingsService) {}

  onToggleSidebar(): void {
    this.settingsService.setSideBarCollapsed(
      !this.settingsService['IsSideBarCollapsed'].getValue()
    );
  }
}