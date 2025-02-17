import { Component, OnInit } from '@angular/core';
import { JobService, Job } from '../../services/job.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // ✅ Ensure FormsModule is included
import * as bootstrap from 'bootstrap'; // ✅ Import Bootstrap for modal handling

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule], // ✅ Imported FormsModule for [(ngModel)]
  templateUrl: './job-list.component.html', // ✅ Use a separate HTML file
  styleUrls: ['./job-list.component.css'] // ✅ Use a separate CSS file for styling
})
export class JobListComponent implements OnInit {
  jobs: Job[] = [];
  loading: boolean = true;
  selectedJob: Job | null = null; // ✅ Tracks the job being edited
  editMode: boolean = false; // ✅ Indicates if editing mode is active

  constructor(private jobService: JobService) {}

  ngOnInit(): void {
    this.loadJobs();
  }

  /** ✅ Fetch jobs from the API **/
  loadJobs(): void {
    this.jobService.getJobs().subscribe({
      next: (data: Job[]) => {
        // ✅ Format dates before displaying
        this.jobs = data.map(job => ({
          ...job,
          dateApplied: this.formatDate(job.dateApplied)
        }));
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error fetching jobs:', error);
        this.loading = false;
      }
    });
  }

  /** ✅ Handle a new job added **/
  onJobAdded(job: Job): void {
    console.log("New job added:", job);
    job.dateApplied = this.formatDate(job.dateApplied); // ✅ Ensure formatted date
    this.jobs.push(job); // ✅ Add the new job to the list instantly
  }

  /** ✅ Delete a job **/
  deleteJob(id: number): void {
    if (confirm("Are you sure you want to delete this job?")) {
      this.jobService.deleteJob(id).subscribe({
        next: () => {
          this.jobs = this.jobs.filter(job => job.id !== id); // ✅ Instantly update UI
        },
        error: (error) => console.error("Error deleting job:", error)
      });
    }
  }

  /** ✅ Edit a job (Opens Bootstrap Modal) **/
  editJob(job: Job): void {
    this.selectedJob = { ...job }; // ✅ Clone job object to prevent direct mutations
    this.editMode = true;

    // ✅ Open Bootstrap modal
    setTimeout(() => {
      const modalElement = document.getElementById("editModal") as HTMLElement;
      if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
      }
    }, 100);
  }

  /** ✅ Update a job **/
  updateJob(): void {
    if (!this.selectedJob) return;

    this.jobService.updateJob(this.selectedJob).subscribe({
      next: (updatedJob: Job) => {
        // ✅ Ensure formatted date on update
        updatedJob.dateApplied = this.formatDate(updatedJob.dateApplied);

        // ✅ Update job in the list instantly
        this.jobs = this.jobs.map(job => job.id === updatedJob.id ? updatedJob : job);

        this.closeModal();
      },
      error: (error) => console.error("Error updating job:", error)
    });
  }

  /** ✅ Close Bootstrap Modal **/
  closeModal(): void {
    this.selectedJob = null;
    this.editMode = false;

    const modalElement = document.getElementById("editModal") as HTMLElement;
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal?.hide();
    }
  }

  /** ✅ Format dates for display **/
  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A'; // ✅ Prevents errors if date is missing

    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  /** ✅ Get Bootstrap class for job status **/
  getStatusClass(status: string): string {
    switch (status) {
      case 'Applied': return 'badge bg-primary';
      case 'Interview': return 'badge bg-info';
      case 'Offer': return 'badge bg-success';
      case 'Rejected': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  }
}
