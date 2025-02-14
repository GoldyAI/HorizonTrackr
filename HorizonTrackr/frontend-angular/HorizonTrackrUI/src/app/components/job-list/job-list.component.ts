import { Component, OnInit } from '@angular/core';
import { JobService, Job } from '../../services/job.service'; // Corrected path
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule], // Ensure necessary modules are imported
  template: `
    <div *ngIf="loading">Loading...</div>
    <ul *ngIf="!loading && jobs.length > 0">
      <li *ngFor="let job of jobs">
        <strong>{{ job.position }}</strong> at {{ job.company }} - {{ job.status }}
      </li>
    </ul>
    <p *ngIf="!loading && jobs.length === 0">No jobs found.</p>
  `
})
export class JobListComponent implements OnInit {
  jobs: Job[] = [];
  loading = true;

  constructor(private jobService: JobService) {}

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    this.jobService.getJobs().subscribe(
      (data: Job[]) => {
        this.jobs = data;
        this.loading = false;
      },
      (error: any) => {
        console.error('Error fetching jobs:', error);
        this.loading = false;
      }
    );
  }
}
