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
  newJob: Job = { id: 0, company: '', position: '', status: 'Applied', dateApplied: '', notes: '' };
  successMessage: string = '';

  searchQuery: string = '';
  selectedStatus: string = '';
  sortColumn: string = 'dateApplied';
  sortDirection: string = 'desc';

  private searchSubject = new Subject<void>();

  constructor(private jobService: JobService) {}

  ngOnInit(): void {
    this.loadJobs();
    this.searchSubject.pipe(debounceTime(300)).subscribe(() => {
      this.filterJobs();
    });
  }

  /** ✅ Fetch jobs from the API **/
  loadJobs(): void {
    this.jobService.getJobs().subscribe({
      next: (data: Job[]) => {
        this.jobs = data.map(job => ({
          ...job,
          dateApplied: this.formatDate(job.dateApplied)
        }));
        this.filteredJobs = [...this.jobs];
        this.loading = false;
        this.sortJobs(this.sortColumn);
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

  /** ✅ Apply filters: Search Query & Status **/
  filterJobs(): void {
    this.filteredJobs = this.jobs.filter(job => {
      const matchesSearch =
        job.company.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        job.position.toLowerCase().includes(this.searchQuery.toLowerCase());

      const matchesStatus = this.selectedStatus ? job.status === this.selectedStatus : true;
      return matchesSearch && matchesStatus;
    });

    this.sortJobs(this.sortColumn);
  }

  /** ✅ Reset search and filters **/
  resetFilters(): void {
    this.searchQuery = '';
    this.selectedStatus = '';
    this.filteredJobs = [...this.jobs];
    this.sortJobs(this.sortColumn);
  }

  /** ✅ Sorting logic for columns **/
  sortJobs(column: string): void {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }

    this.filteredJobs.sort((a, b) => {
      let valueA = a[column as keyof Job] ?? '';
      let valueB = b[column as keyof Job] ?? '';

      if (column === 'dateApplied') {
        valueA = new Date(valueA as string).getTime();
        valueB = new Date(valueB as string).getTime();
      }

      if (typeof valueA === 'string' && typeof valueB === 'string') {
        return this.sortDirection === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
      }

      return this.sortDirection === 'asc' ? (valueA as number) - (valueB as number) : (valueB as number) - (valueA as number);
    });
  }

  /** ✅ Open Bootstrap Modal for Adding a New Job **/
  openAddJobModal(): void {
    this.newJob = { id: 0, company: '', position: '', status: 'Applied', dateApplied: '', notes: '' };
    this.successMessage = '';

    setTimeout(() => {
      const modalElement = document.getElementById("addJobModal") as HTMLElement;
      if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
      }
    }, 100);
  }

  /** ✅ Add a new job (Fix for Save Job button) **/
  addJob(): void {
    if (!this.newJob.company || !this.newJob.position || !this.newJob.dateApplied) {
      alert("Please fill in all required fields.");
      return;
    }

    this.jobService.addJob(this.newJob).subscribe({
      next: (job: Job) => {
        job.dateApplied = this.formatDate(job.dateApplied);
        this.jobs.push(job);
        this.filteredJobs.push(job);
        this.successMessage = "Job saved successfully!";
        setTimeout(() => (this.successMessage = ''), 3000);
        this.closeModal('addJobModal');
      },
      error: (error) => {
        console.error("Error adding job:", error);
        alert("Job could not be saved. Please try again.");
      }
    });
  }

  /** ✅ Delete a job **/
  deleteJob(id: number): void {
    if (confirm("Are you sure you want to delete this job?")) {
      this.jobService.deleteJob(id).subscribe({
        next: () => {
          this.jobs = this.jobs.filter(job => job.id !== id);
          this.filteredJobs = this.filteredJobs.filter(job => job.id !== id);
        },
        error: (error) => console.error("Error deleting job:", error)
      });
    }
  }

  /** ✅ Edit a job (opens the modal) **/
  editJob(job: Job): void {
    this.selectedJob = { ...job };
    this.editMode = true;

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
        this.jobs = this.jobs.map(job => job.id === updatedJob.id ? updatedJob : job);
        this.filteredJobs = this.filteredJobs.map(job => job.id === updatedJob.id ? updatedJob : job);
        this.closeModal('editModal');
      },
      error: (error) => console.error("Error updating job:", error)
    });
  }

  /** ✅ Close Bootstrap Modal **/
  closeModal(modalId: string): void {
    this.selectedJob = null;
    this.editMode = false;

    const modalElement = document.getElementById(modalId) as HTMLElement;
    if (modalElement) {
      const modal = bootstrap.Modal.getInstance(modalElement);
      modal?.hide();
    }
  }

  /** ✅ Cancel Edit Mode **/
  cancelEdit(): void {
    this.closeModal('editModal');
  }

  /** ✅ Format dates for display **/
  formatDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  /** ✅ Get Bootstrap class for job status **/
  getStatusClass(status: string): string {
    switch (status.toLowerCase()) {
      case 'applied': return 'badge bg-primary';
      case 'interview': return 'badge bg-info';
      case 'offer': return 'badge bg-success';
      case 'rejected': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  }
}
