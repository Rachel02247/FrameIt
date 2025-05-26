import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, map, of } from 'rxjs';
import { User } from '../../models/user';
import { UserEditor } from '../../models/userEditor';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService  {
  private baseUrl = `${environment.apiUrl}`;

  constructor(private http:HttpClient) { }

  getSummaryStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}analytics/summary`);
  }

  getFileUploadStats(days: number = 30): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}files`).pipe(
      map(files => {

        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        
        const filteredFiles = files.filter(file => {
          const fileDate = new Date(file.updatedAt);
          return fileDate >= cutoffDate;
        });
        
        const groupedByDate = this.groupFilesByDate(filteredFiles);
        
        return [
          {
            name: 'file uploads',
            series: Object.entries(groupedByDate).map(([date, count]) => ({
              name: date,
              value: count
            }))
          }
        ];
      })
    );
  }

  getStorageUsageStats(): Observable<any> {
    return this.http.get(`${this.baseUrl}analytics/storage-usage`);
  }

  getUserActivityStats(days: number = 30): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}analytics/user-activity?days=${days}`).pipe(
      map(data => Array.isArray(data) ? data : [])
    );
  }

  getCollageCreationStats(days: number = 30): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}analytics/collage-creation?days=${days}`).pipe(
      map(data => Array.isArray(data) ? data : [])
    );
  }
  getRecentActivities(days: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}users`).pipe(
      map(users => {
        // Create a list of activities from users
        const activities: UserEditor[] = users.map(user => {
          const activityType = this.getRandomActivityType(); 
          console.log(`Generating activity for user: ${user.name}, type: ${activityType}`);
          return {
            id: +user.id,
            type: activityType,
            userName: '' + user.name,
            description: this.getActivityDescription(user.name, activityType),
            timestamp: this.getRandomTimestamp(days)
          };
        });
  
        return activities;
      })
    );
  }
  
  // Helper methods for dynamic activity generation
  private getRandomActivityType(): string {
    const types = ['login', 'upload', 'create_collage'];
    return types[Math.floor(Math.random() * types.length)];
  }
  
  private getActivityDescription(userName: string, activityType: string): string {
    switch (activityType) {
      case 'login':
        return `${userName} logged in`;
      case 'upload':
        return `${userName} uploaded a file`;
      case 'create_collage':
        return `${userName} created a collage`;
      default:
        return `${userName} performed an action`;
    }
  }
  
  private getRandomTimestamp(days: number): Date {
    const now = Date.now();
    const randomOffset = Math.floor(Math.random() * days * 24 * 60 * 60 * 1000);
    return new Date(now - randomOffset);
  }


  // פונקציות עזר
  private groupFilesByDate(files: any[]): Record<string, number> {
    const grouped:Record<string, number> = {};
    
    files.forEach(file => {
      const date = new Date(file.updatedAt);
      const dateStr = date.toISOString().split('T')[0];
      
      grouped[dateStr] = (grouped[dateStr] || 0) + 1;
    });
    
    return grouped;
  }

  private groupCollagesByDate(collages: any[]): Record<string, number> {
    const grouped :Record<string, number>= {};
    
    collages.forEach(collage => {
      const date = new Date(collage.createdAt);
      const dateStr = date.toISOString().split('T')[0];
      
      grouped[dateStr] = (grouped[dateStr] || 0) + 1;
    });
    
    return grouped;
  }

  private getFileCategory(mimeType: string): string {
    if (!mimeType) return 'Other';
    
    if (mimeType.startsWith('image/')) return 'Images';
    if (mimeType.startsWith('video/')) return 'Video';
    if (mimeType.startsWith('audio/')) return 'Audio';
    if (mimeType.includes('pdf')) return 'PDF';
    
    return 'Other';
  }

  private generateDateSeries(days: number, min: number, max: number): any[] {
    const series = [];
    const today = new Date();
    
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      series.push({
        name: dateStr,
        value: Math.floor(Math.random() * (max - min + 1)) + min
      });
    }
    
    return series;
  }
}
