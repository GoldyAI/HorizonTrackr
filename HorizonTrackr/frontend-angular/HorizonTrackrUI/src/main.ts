import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { AppComponent } from './app/app.component';
import { JobListComponent } from './app/components/job-list/job-list.component';
import { JobBoardComponent } from './app/components/job-board/job-board.component';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

const routes: Routes = [
  { path: '', component: JobListComponent }, // Home Page (Job Tracker)
  { path: 'jobs', component: JobBoardComponent }, // External Job Board Page
  { path: '**', redirectTo: '/' } // Redirect unknown routes to home
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule)
  ]
}).catch(err => console.error(err));
