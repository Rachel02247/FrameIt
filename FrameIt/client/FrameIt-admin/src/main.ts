import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';

// הוספת provideAnimations בתוך appConfig
const updatedAppConfig = {
  ...appConfig,
  providers: [
    ...(appConfig.providers || []),   // אם יש כבר providers קיימים ב-appConfig, נשמור אותם
    provideAnimations(),   // מנוע אנימציות מלא
    provideHttpClient()    // תומך ב-HttpClient
  ]
};

bootstrapApplication(AppComponent, updatedAppConfig)
  .catch((err) => console.error(err));
