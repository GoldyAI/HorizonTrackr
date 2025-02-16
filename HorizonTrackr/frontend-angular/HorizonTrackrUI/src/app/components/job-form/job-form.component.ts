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
    dateApplied: new Date().toISOString(),
    notes: ''
  };
  
  constructor(private jobService: JobService) {}

  addJob(): void {
    console.log('Submitting Job:', this.newJob); 

    this.jobService.addJob(this.newJob).subscribe(
      (job) => {
        console.log('Job successfully added:', job);
        this.jobAdded.emit(job);
        this.successMessage = 'Job successfully added! 🎉';
        this.resetForm();
        setTimeout(() => {
          this.successMessage = '';
        }, 3000);
      },
      (error) => {
        console.error('Error adding job:', error.error);
        if (error.error && error.error.errors) {
          console.error('Validation Errors:', error.error.errors);
        }
      }
    );
  }

  resetForm(): void {
    this.newJob = {
      id: 0,
      company: '',
      position: '',
      status: 'Applied',
      dateApplied: new Date().toISOString(),
      notes: ''
    };
  }
}
