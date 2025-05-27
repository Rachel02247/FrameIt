import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { NgxChartsModule, ScaleType } from '@swimlane/ngx-charts';
import { AnalyticsService } from '../../servies/API/analytics/analytics.service';
import { UserEditor } from '../../models/userEditor';
import { SummaryStats } from '../../models/summaryStates';

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

  summaryStats: SummaryStats = {
    users: 0,
    files: 0,
    usedStorage: 0
  };

  fileUploadData: any[] = [];

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
      next: (data: SummaryStats) => {
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
    
    this.analyticsService.getRecentActivities(days).subscribe({
      next: (data: any) => {
        this.recentActivities = data.slice(-10);
      },
      error: (error: any) => {
        console.error('Error loading last activities', error);
      }
    });
  }

  onResize(event: any): void {
    this.view = [event.target.innerWidth / 1.35, 300];
  }

}
