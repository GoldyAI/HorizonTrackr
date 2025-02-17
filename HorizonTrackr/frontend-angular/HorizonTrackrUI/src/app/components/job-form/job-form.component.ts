import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JobService, Job } from '../../services/job.service';

@Component({
  selector: 'app-job-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './job-form.component.html',
  styleUrls: ['./job-form.component.css']
})
export class JobFormComponent {
  @Output() jobAdded = new EventEmitter<Job>();

  successMessage: string = '';

  newJob: Job = {
    id: 0,
    company: '',
    position: '',
    status: 'Applied',
    dateApplied: '',
    notes: ''
  };

  constructor(private jobService: JobService) {}

  /** ✅ Method to Add a Job **/
  addJob(): void {
    if (!this.newJob.company || !this.newJob.position || !this.newJob.dateApplied) {
      return; // Prevent empty submission
    }

    // ✅ Convert dateApplied to ISO format for backend compatibility
    this.newJob.dateApplied = new Date(this.newJob.dateApplied).toISOString();

    this.jobService.addJob(this.newJob).subscribe(
      (job) => {
        console.log('Job successfully added:', job);
        this.jobAdded.emit(job);
        this.successMessage = '🎉 Job successfully added!';

        this.resetForm();

        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      (error) => {
        console.error('Error adding job:', error.error);
      }
    );
  }

  /** ✅ Method to Reset the Form **/
  resetForm(): void {
    this.newJob = {
      id: 0,
      company: '',
      position: '',
      status: 'Applied',
      dateApplied: '', // ✅ Reset date properly
      notes: ''
    };

    // ✅ Reset form validation errors
    const formElement = document.querySelector('form');
    if (formElement) {
      formElement.reset();
    }
  }
}
