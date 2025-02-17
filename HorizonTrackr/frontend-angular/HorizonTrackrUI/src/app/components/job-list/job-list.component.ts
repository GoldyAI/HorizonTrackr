import { Component, OnInit } from '@angular/core';
import { JobService, Job } from '../../services/job.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.css']
})
export class JobListComponent implements OnInit {
  jobs: Job[] = [];
  filteredJobs: Job[] = [];
  loading: boolean = true;
  selectedJob: Job | null = null;
  editMode: boolean = false;

  searchQuery: string = ''; // ✅ Search Input Binding
  selectedStatus: string = ''; // ✅ Filter Dropdown Binding

  private searchSubject = new Subject<void>(); // ✅ Used to debounce filtering

  constructor(private jobService: JobService) {}

  ngOnInit(): void {
    this.loadJobs();
    
    // ✅ Add debounce time to search/filter for a smoother experience
    this.searchSubject.pipe(debounceTime(500)).subscribe(() => {
      this.filterJobs();
    });
  }

  /** ✅ Fetch jobs from the API **/
  loadJobs(): void {
    this.jobService.getJobs().subscribe({
      next: (data: Job[]) => {
        // ✅ Ensure dates are formatted correctly before displaying
        this.jobs = data.map(job => ({
          ...job,
          dateApplied: this.formatDate(job.dateApplied)
        }));
        this.filteredJobs = [...this.jobs]; // ✅ Initialize filtered list
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error fetching jobs:', error);
        this.loading = false;
      }
    });
  }

  /** ✅ Trigger filtering with debounce **/
  onSearchChange(): void {
    this.searchSubject.next();
  }

  /** ✅ Filter jobs based on search input & selected status **/
  filterJobs(): void {
    this.filteredJobs = this.jobs.filter(job => {
      const matchesSearch =
        job.company.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        job.position.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesStatus = this.selectedStatus ? job.status === this.selectedStatus : true;

      return matchesSearch && matchesStatus;
    });
  }

  /** ✅ Reset search and filters **/
  resetFilters(): void {
    this.searchQuery = '';
    this.selectedStatus = '';
    this.filteredJobs = [...this.jobs];
  }

  /** ✅ Delete a job **/
  deleteJob(id: number): void {
    if (confirm("Are you sure you want to delete this job?")) {
      this.jobService.deleteJob(id).subscribe({
        next: () => {
          // ✅ Remove from both `jobs` and `filteredJobs` to update UI instantly
          this.jobs = this.jobs.filter(job => job.id !== id);
          this.filteredJobs = this.filteredJobs.filter(job => job.id !== id);
        },
        error: (error) => console.error("Error deleting job:", error)
      });
    }
  }

  /** ✅ Edit a job **/
  editJob(job: Job): void {
    this.selectedJob = { ...job };
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
        updatedJob.dateApplied = this.formatDate(updatedJob.dateApplied);

        // ✅ Update job in the main and filtered lists instantly
        this.jobs = this.jobs.map(job => job.id === updatedJob.id ? updatedJob : job);
        this.filteredJobs = this.filteredJobs.map(job => job.id === updatedJob.id ? updatedJob : job);

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
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
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
