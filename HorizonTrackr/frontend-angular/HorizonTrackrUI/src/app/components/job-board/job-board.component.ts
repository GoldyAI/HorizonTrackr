import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-job-board',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
  hasSearched: boolean = false; // ✅ New state to track user searches

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchRecommendedJobs();
  }

  /** ✅ Fetch recommended jobs for first-time users */
  fetchRecommendedJobs(): void {
    this.loading = true;
    const recommendedKeywords = ['Software Engineer', 'Product Manager', 'Data Analyst', 'Marketing Specialist'];
    const randomKeyword = recommendedKeywords[Math.floor(Math.random() * recommendedKeywords.length)];

    const apiUrl = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(randomKeyword)}&page=1&num_pages=1`;

    const headers = new HttpHeaders({
      'x-rapidapi-host': 'jsearch.p.rapidapi.com',
      'x-rapidapi-key': '592430e328msh00270f247372bcdp1b84f6jsnd62757381e5a'
    });

    this.http.get<any>(apiUrl, { headers }).subscribe({
      next: (response) => {
        this.recommendedJobs = response.data || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching recommended jobs:', error);
        this.loading = false;
      }
    });
  }

  /** ✅ Fetch jobs based on user search */
  fetchJobs(): void {
    if (!this.searchQuery.trim()) return; // Prevent empty searches
    this.hasSearched = true; // ✅ Mark that a search has been performed
    this.loading = true;
    this.errorMessage = '';

    const apiUrl = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(this.searchQuery)}&page=${this.page}&num_pages=1`;

    const headers = new HttpHeaders({
      'x-rapidapi-host': 'jsearch.p.rapidapi.com',
      'x-rapidapi-key': '592430e328msh00270f247372bcdp1b84f6jsnd62757381e5a'
    });

    this.http.get<any>(apiUrl, { headers }).subscribe({
      next: (response) => {
        this.jobs = response.data || [];
        this.filteredJobs = [...this.jobs];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching jobs:', error);
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
    const appliedJob = {
      id: 0,
      company: job.employer_name,
      position: job.job_title,
      status: 'Applied',
      dateApplied: new Date().toISOString(),
      notes: job.job_description || 'No additional details available'
    };

    this.http.post('http://localhost:5166/api/jobs', appliedJob, { responseType: 'text' }).subscribe({
      next: () => {
        alert('✅ Job saved successfully!');
      },
      error: (error) => {
        console.error('❌ Error saving job:', error);
        alert('❌ Failed to save job. Please try again.');
      }
    });
  }
}
