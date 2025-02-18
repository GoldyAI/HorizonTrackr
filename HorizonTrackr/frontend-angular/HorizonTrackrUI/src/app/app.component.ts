import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; // ✅ Import FormsModule for ngModel
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { JobListComponent } from './components/job-list/job-list.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, JobListComponent], // ✅ Import FormsModule to fix ngModel error
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'HorizonTrackr';

  // ✅ Define the search and filter properties
  searchQuery: string = '';
  selectedStatus: string = '';

  // ✅ Implement a dummy filter function (we will refine this later)
  filterJobs(): void {
    console.log('Filtering Jobs:', { searchQuery: this.searchQuery, selectedStatus: this.selectedStatus });
  }

  // ✅ Reset search and filters
  resetFilters(): void {
    this.searchQuery = '';
    this.selectedStatus = '';
    this.filterJobs();
  }
}
