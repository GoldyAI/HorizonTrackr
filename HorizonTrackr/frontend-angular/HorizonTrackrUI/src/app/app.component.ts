import { Component, ViewChild } from '@angular/core';
import { JobListComponent } from './components/job-list/job-list.component';
import { JobFormComponent } from './components/job-form/job-form.component'; // ✅ Import JobFormComponent
import { Job } from './services/job.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [JobListComponent, JobFormComponent], // ✅ Ensure JobFormComponent is included
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'HorizonTrackrUI';

  @ViewChild(JobListComponent) jobList!: JobListComponent;

  onJobAdded(newJob: Job): void {
    console.log('New job added:', newJob);
    this.jobList.loadJobs();
  }
}
