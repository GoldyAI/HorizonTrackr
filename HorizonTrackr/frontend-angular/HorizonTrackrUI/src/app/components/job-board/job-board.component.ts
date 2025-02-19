import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'; // ✅ FIX: Ensure HttpClientModule is imported

interface Job {
  company: string;
  position: string;
  status: string;
  dateApplied: string;
  notes: string;
}

@Component({
  selector: 'app-job-board',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule], // ✅ FIX: Added HttpClientModule
  templateUrl: './job-board.component.html',
  styleUrls: ['./job-board.component.css']
})
export class JobBoardComponent implements OnInit {
  jobs: any[] = [];
  filteredJobs: any[] = [];
  recommendedJobs: any[] = [];
  companyReviews: { [companyName: string]: any } = {};
  loading: boolean = false;
  errorMessage: string = '';
  searchQuery: string = '';
  page: number = 1;
  hasSearched: boolean = false;

  private readonly API_HEADERS = new HttpHeaders({
    'x-rapidapi-host': 'jsearch.p.rapidapi.com',
    'x-rapidapi-key': '592430e328msh00270f247372bcdp1b84f6jsnd62757381e5a'
  });

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchRecommendedJobs();
  }

  /** ✅ Fetch recommended jobs when user first visits */
  fetchRecommendedJobs(): void {
    this.loading = true;
    const recommendedKeywords = ['Software Engineer', 'Product Manager', 'Data Analyst', 'Marketing Specialist'];
    const randomKeyword = recommendedKeywords[Math.floor(Math.random() * recommendedKeywords.length)];
    const apiUrl = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(randomKeyword)}&page=1&num_pages=1`;

    this.http.get<any>(apiUrl, { headers: this.API_HEADERS }).subscribe({
      next: (response) => {
        this.recommendedJobs = response?.data || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Error fetching recommended jobs:', error);
        this.loading = false;
      }
    });
  }

  /** ✅ Fetch jobs based on user search */
  fetchJobs(): void {
    if (!this.searchQuery.trim()) {
      this.errorMessage = "Please enter a search term.";
      return; // ✅ Prevents empty searches from making API calls
    }

    this.hasSearched = true;
    this.loading = true;
    this.errorMessage = '';

    const apiUrl = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(this.searchQuery)}&page=${this.page}&num_pages=1`;

    this.http.get<any>(apiUrl, { headers: this.API_HEADERS }).subscribe({
      next: (response) => {
        this.jobs = response?.data || [];
        this.filteredJobs = [...this.jobs];
        this.loading = false;
      },
      error: (error) => {
        console.error('❌ Error fetching jobs:', error);
        this.errorMessage = 'Failed to fetch job listings. Please try again later.';
        this.loading = false;
      }
    });
  }

  /** ✅ Pagination: Next Page */
  nextPage(): void {
    this.page++;
    this.fetchJobs();
  }

  /** ✅ Pagination: Previous Page */
  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.fetchJobs();
    }
  }

  /** ✅ Save Job to Backend */
  saveJob(job: any): void {
    const jobToSave = {
      company: job.company_name || job.employer_name || 'Unknown Company',
      position: job.job_title || 'Unknown Position',
      status: 'Applied',
      dateApplied: new Date().toISOString().split('T')[0], // ✅ Today's date
      notes: `Saved from external job board.`
    };

    const backendUrl = 'https://localhost:7262/api/jobs'; // ✅ Ensure this matches backend CORS rules

    this.http.post<Job>(backendUrl, jobToSave).subscribe({
      next: () => {
        alert('✅ Job saved successfully!');
      },
      error: (error) => {
        console.error('❌ Error saving job:', error);
        alert('❌ Error saving job! Make sure the backend is running and check the console for details.');
      }
    });
  }
}
