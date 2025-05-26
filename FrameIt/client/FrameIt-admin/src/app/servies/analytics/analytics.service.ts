import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, forkJoin, map, of } from 'rxjs';
import { User } from '../../models/user';
import { UserEditor } from '../../models/userEditor';

const API_BASE_URL = 'http://localhost:5282';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService  {

  constructor(private http:HttpClient) { }

  // סטטיסטיקה מהירה
  getSummaryStats(): Observable<any> {
    return forkJoin({
      users: this.http.get<any[]>(`${API_BASE_URL}/users`) ,
      files: this.http.get<any[]>(`${API_BASE_URL}/users`)

      // collages: this.http.get<any[]>('/collages')
    }).pipe(
      map(({ users, files }) => {
        const totalStorage = files.reduce((sum, file) => sum + file.size, 0);
        
        return {
          totalUsers: users.length,
          totalFiles: files.length,
          totalStorage: totalStorage,
          totalCollages: 0 // יש להחליף כשיהיה endpoint פעיל
        };
      })
    );
  }

  // סטטיסטיקת העלאות קבצים
  getFileUploadStats(days: number = 30): Observable<any[]> {
    return this.http.get<any[]>('/files').pipe(
      map(files => {
        // סינון קבצים לפי תאריך
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        
        const filteredFiles = files.filter(file => {
          const fileDate = new Date(file.updatedAt);
          return fileDate >= cutoffDate;
        });
        
        // קיבוץ לפי תאריך
        const groupedByDate = this.groupFilesByDate(filteredFiles);
        
        // המרה למבנה הנדרש לגרף
        return [
          {
            name: 'העלאות קבצים',
            series: Object.entries(groupedByDate).map(([date, count]) => ({
              name: date,
              value: count
            }))
          }
        ];
      })
    );
  }

  // סטטיסטיקת שימוש באחסון
  getStorageUsageStats(): Observable<any[]> {
    return this.http.get<any[]>('/files').pipe(
      map(files => {
        // קיבוץ לפי סוג קובץ
        const groupedByType: Record<string, number> = {};
        
        files.forEach(file => {
          const fileType = this.getFileCategory(file.fileType);
          groupedByType[fileType] = (groupedByType[fileType] || 0) + file.size;
        });
        
        // המרה למבנה הנדרש לגרף
        return Object.entries(groupedByType).map(([type, size]) => ({
          name: type,
          value: size
        }));
      })
    );
  }

  // סטטיסטיקת פעילות משתמשים
  getUserActivityStats(days: number = 30): Observable<any[]> {
    // כאן צריך לוגיקה שתתבסס על לוגים או נתוני פעילות
    // לצורך הדוגמה, נחזיר נתונים מדומים
    
    const mockData = [
      {
        name: 'משתמשים פעילים',
        series: this.generateDateSeries(days, 10, 50)
      },
      {
        name: 'משתמשים חדשים',
        series: this.generateDateSeries(days, 1, 10)
      }
    ];
    
    return of(mockData);
  }

  // סטטיסטיקת יצירת קולאז'ים
  getCollageCreationStats(days: number = 30): Observable<any[]> {
    return this.http.get<any[]>('/collages').pipe(
      map(collages => {
        // סינון קולאז'ים לפי תאריך
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - days);
        
        const filteredCollages = collages.filter(collage => {
          const collageDate = new Date(collage.createdAt);
          return collageDate >= cutoffDate;
        });
        
        // קיבוץ לפי תאריך
        const groupedByDate = this.groupCollagesByDate(filteredCollages);
        
        // המרה למבנה הנדרש לגרף
        return Object.entries(groupedByDate).map(([date, count]) => ({
          name: date,
          value: count
        }));
      })
    );
  }
  getRecentActivities(days: number): Observable<any[]> {
    return this.http.get<any[]>(`${API_BASE_URL}/users`).pipe(
      map(users => {
        // Create a list of activities from users
        const activities: UserEditor[] = users.map(user => {
          const activityType = this.getRandomActivityType(); // Dynamic activity type
          return {
            id: +user.id,
            type: activityType,
            userName: '' + user.name,
            description: this.getActivityDescription(user.name, activityType),
            timestamp: this.getRandomTimestamp(days) // Random timestamp within the specified days
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
        return `${userName} התחבר למערכת`;
      case 'upload':
        return `${userName} העלה קובץ`;
      case 'create_collage':
        return `${userName} יצר קולאז'`;
      default:
        return `${userName} ביצע פעולה`;
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
    if (!mimeType) return 'אחר';
    
    if (mimeType.startsWith('image/')) return 'תמונות';
    if (mimeType.startsWith('video/')) return 'וידאו';
    if (mimeType.startsWith('audio/')) return 'אודיו';
    if (mimeType.includes('pdf')) return 'PDF';
    
    return 'אחר';
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
