import { Component, OnInit } from '@angular/core';
import { JobService, Job } from '../../services/job.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // ✅ Import FormsModule for [(ngModel)]

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule], // ✅ Ensure FormsModule is included
  template: `
    <div class="container">
      <h2>Job Applications</h2>
      <p *ngIf="loading">Loading jobs...</p>

      <ul *ngIf="!loading && jobs.length > 0">
        <li *ngFor="let job of jobs">
          <strong>{{ job.position }}</strong> at {{ job.company }} - {{ job.status }}
          <button (click)="editJob(job)">✏️ Edit</button> <!-- ✅ Edit Button Added -->
          <button (click)="deleteJob(job.id)">🗑 Delete</button> <!-- ✅ Delete Button -->
        </li>
      </ul>

      <p *ngIf="!loading && jobs.length === 0">No jobs found.</p>

      <!-- ✅ Job Edit Form (Only visible when in edit mode) -->
      <div *ngIf="editMode && selectedJob">
        <h3>Edit Job</h3>
        <form (ngSubmit)="updateJob()">
          <label for="company">Company:</label>
          <input type="text" id="company" [(ngModel)]="selectedJob.company" name="company" required>

          <label for="position">Position:</label>
          <input type="text" id="position" [(ngModel)]="selectedJob.position" name="position" required>

          <label for="status">Status:</label>
          <select id="status" [(ngModel)]="selectedJob.status" name="status">
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>

          <button type="submit">💾 Save Changes</button>
          <button type="button" (click)="cancelEdit()">❌ Cancel</button>
        </form>
      </div>
    </div>
  `
})
export class JobListComponent implements OnInit {
  jobs: Job[] = [];
  loading = true;
  selectedJob: Job | null = null; // ✅ Stores the selected job for editing
  editMode: boolean = false; // ✅ Tracks if we are in edit mode

  constructor(private jobService: JobService) {}

  ngOnInit(): void {
    this.loadJobs(); // ✅ Removed duplicate call
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
    console.log("Delete button clicked for Job ID:", id);
    if (confirm("Are you sure you want to delete this job?")) {
      this.jobService.deleteJob(id).subscribe(() => {
        console.log("Job deleted successfully:", id);
        this.jobs = this.jobs.filter(job => job.id !== id);
      });
    }
  }

  editJob(job: Job): void {
    console.log("Edit button clicked for Job:", job);
    this.selectedJob = { ...job }; // ✅ Clone job data to avoid modifying the list directly
    this.editMode = true;
  }

  updateJob(): void {
    if (!this.selectedJob) return;

    this.jobService.updateJob(this.selectedJob).subscribe((updatedJob: Job) => {
      console.log("Job updated successfully:", updatedJob);

      // ✅ Update the job in the list instantly
      if (updatedJob) {
        this.jobs = this.jobs.map(job => job.id === updatedJob.id ? updatedJob : job);
      }

      this.cancelEdit();
    });
  }

  cancelEdit(): void {
    this.selectedJob = null;
    this.editMode = false;
  }
}