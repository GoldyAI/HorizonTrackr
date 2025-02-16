import { Component, OnInit } from '@angular/core';
import { JobService, Job } from '../../services/job.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule], // ✅ Ensure necessary modules are imported
  template: `
    <div class="container">
      <h2>Job Applications</h2>
      <p *ngIf="loading">Loading jobs...</p>

      <ul *ngIf="!loading && jobs.length > 0">
        <li *ngFor="let job of jobs">
          <strong>{{ job.position }}</strong> at {{ job.company }} - {{ job.status }}
          <button (click)="deleteJob(job.id)">🗑 Delete</button> <!-- ✅ Delete button added -->
        </li>
      </ul>

      <p *ngIf="!loading && jobs.length === 0">No jobs found.</p>
    </div>
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

  deleteJob(id: number): void {
    console.log("Delete button clicked for Job ID:", id); // ✅ Log when clicked
    if (confirm("Are you sure you want to delete this job?")) {
      this.jobService.deleteJob(id).subscribe(() => {
        console.log("Job deleted successfully:", id);
        this.jobs = this.jobs.filter(job => job.id !== id); // ✅ Remove from UI instantly
      });
    }
  }
}
