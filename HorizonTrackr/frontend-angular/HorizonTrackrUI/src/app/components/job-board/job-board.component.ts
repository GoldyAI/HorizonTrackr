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
  recommendedJobs: any[] = [];
  companyReviews: { [companyName: string]: any } = {}; // Store company reviews
  loading: boolean = false;
  searchQuery: string = '';
  page: number = 1;
  isGridView: boolean = false;
  hasSearched: boolean = false;

  // 🔹 New Filters
  selectedLocation: string = ''; // User-selected location
  isRemote: boolean = false; // Toggle for remote jobs
  minSalary: number | null = null; // Minimum Salary Filter
  maxSalary: number | null = null; // Maximum Salary Filter

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchRecommendedJobs();
  }

  /** ✅ Fetch Recommended Jobs */
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

  fetchJobs(): void {
    if (!this.searchQuery.trim()) return;
    this.hasSearched = true;
    this.loading = true;
  
    // 🔹 Define Base API URL
    let apiUrl = `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(this.searchQuery)}&page=${this.page}&num_pages=1`;
  
    // ✅ Append Filters to API Call
    if (this.selectedLocation && this.selectedLocation.trim() !== '') {
      apiUrl += `&location=${encodeURIComponent(this.selectedLocation)}`;
    }
    if (this.isRemote) {
      apiUrl += `&remote_only=true`;  // ✅ Ensure remote filter is actually included
    }
    if (this.minSalary && this.minSalary > 0) {
      apiUrl += `&min_salary=${this.minSalary}`;
    }
    if (this.maxSalary && this.minSalary !== null && this.maxSalary > this.minSalary) {
      apiUrl += `&max_salary=${this.maxSalary}`;
    }
  
    const headers = new HttpHeaders({
      'x-rapidapi-host': 'jsearch.p.rapidapi.com',
      'x-rapidapi-key': '592430e328msh00270f247372bcdp1b84f6jsnd62757381e5a'
    });
  
    this.http.get<any>(apiUrl, { headers }).subscribe({
      next: (response) => {
        this.jobs = response.data || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error fetching jobs:', error);
        this.loading = false;
      }
    });
  }
  

  /** ✅ Fetch Company Reviews from Glassdoor */
  fetchCompanyReviews(companyName: string, jobIndex: number): void {
    if (this.companyReviews[companyName]) return; // Avoid duplicate API calls

    const apiUrl = `https://glassdoor-real-time.p.rapidapi.com/companies/reviews?query=${encodeURIComponent(companyName)}`;

    const headers = new HttpHeaders({
      'x-rapidapi-host': 'glassdoor-real-time.p.rapidapi.com',
      'x-rapidapi-key': '592430e328msh00270f247372bcdp1b84f6jsnd62757381e5a'
    });

    this.http.get<any>(apiUrl, { headers }).subscribe({
      next: (response) => {
        this.companyReviews[companyName] = response; // Store reviews by company name
      },
      error: (error) => {
        console.error(`Error fetching reviews for ${companyName}:`, error);
      }
    });
  }

  /** ✅ Save Job to Backend */
  saveJob(job: any): void {
    const jobToSave = {
      company: job.employer_name,
      position: job.job_title,
      status: 'Applied',
      dateApplied: new Date().toISOString().split('T')[0],
      notes: `Saved from external job board.`
    };

    this.http.post('https://localhost:7262/api/jobs', jobToSave).subscribe({
      next: () => {
        job.saved = true;
        alert('✅ Job saved successfully!');
      },
      error: (error) => {
        console.error('❌ Error saving job:', error);
        alert('❌ Could not save the job.');
      }
    });
  }

  /** ✅ Pagination */
  nextPage(): void {
    this.page++;
    this.fetchJobs();
  }

  prevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.fetchJobs();
    }
  }

  /** ✅ Toggle View */
  toggleView(): void {
    this.isGridView = !this.isGridView;
  }
}
