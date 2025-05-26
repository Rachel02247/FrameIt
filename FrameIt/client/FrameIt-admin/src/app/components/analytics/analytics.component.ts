import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { AnalyticsService } from '../../servies/analytics/analytics.service';
import { User } from '../../models/user';
import { UserEditor } from '../../models/userEditor';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, NgxChartsModule,ReactiveFormsModule],
  templateUrl: './analytics.component.html',
  styleUrl: './analytics.component.css',
  animations: [
    trigger('animationState', [
      state('visible',   style({ opacity: 1 })),
      state('hidden',    style({ opacity: 0 })),
      transition('visible <=> hidden', animate('150ms ease-in-out'))
    ])
  ]

})
export class AnalyticsComponent implements OnInit {

  summaryStats = {
  totalUsers: 0,
  totalFiles: 0,
  totalStorage: 0,
  totalCollages: 0
};

fileUploadData: any[] = [];
storageUsageData: any[] = [];
userActivityData: any[] = [];
collageCreationData: any[] = [];

recentActivities: UserEditor[] = [];

view: [number, number] = [700, 300];
showXAxis = true;
showYAxis = true;
gradient = false;
showLegend = true;
showXAxisLabel = true;
showYAxisLabel = true;
timeline = true;

timeRangeControl = new FormControl('30');

colorScheme = {
  domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
  name: 'cool',
  selectable: true,
  group: ScaleType.Ordinal 
};
isLoading = true;

constructor(private analyticsService: AnalyticsService) {}

ngOnInit(): void {
  this.loadAnalyticsData();
  
  this.timeRangeControl.valueChanges.subscribe(value => {
    if (value) {
      this.loadAnalyticsData(+value);
    }
  });
}

loadAnalyticsData(days: number = 30): void {
  this.isLoading = true;
  
  this.analyticsService.getSummaryStats().subscribe({
    next: (data:any) => {
      this.summaryStats = data;
    },
    error: (error:any) => {
      console.error('Error loading statistics', error);
    }
  });
  
  this.analyticsService.getFileUploadStats(days).subscribe({
    next: (data: any) => {
      this.fileUploadData = Array.isArray(data) ? data : [];
      this.isLoading = false;
    },
    error: (error: any) => {
      this.fileUploadData = [];
      this.isLoading = false;
      console.error('Error loading file upload meta data', error);
    }
  });
  
  this.analyticsService.getStorageUsageStats().subscribe({
    next: (data:any) => {
      this.storageUsageData = data;
    },
    error: (error:any) => {
      console.error('Error loading storage', error);
    }
  });
  
  this.analyticsService.getUserActivityStats(days).subscribe({
    next: (data: any) => {
      this.userActivityData = Array.isArray(data) ? data : [];
    },
    error: (error: any) => {
      this.userActivityData = [];
      console.error('Error loading users data', error);
    }
  });
  
  this.analyticsService.getCollageCreationStats(days).subscribe({
    next: (data: any) => {
      this.collageCreationData = Array.isArray(data) ? data : [];
    },
    error: (error: any) => {
      this.collageCreationData = [];
      console.error('Error loading collage create data', error);
    }
  });
  
  this.analyticsService.getRecentActivities(days).subscribe({
    next: (data: any) => {
      this.recentActivities = data.slice(-10);
    },
    error: (error: any) => {
      console.error('Error loading last activities', error);
    }
  });
}

formatStorageSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

onResize(event: any): void {
  this.view = [event.target.innerWidth / 1.35, 300];
}
getActivityIcon(type: string): string {
  switch (type) {
    case 'login': return 'log-in';
    case 'upload': return 'upload';
    case 'delete': return 'trash';
    case 'collage': return 'image';
    default: return 'activity';
  }
}
}
