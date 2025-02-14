import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Job {
  id: number;
  company: string;
  position: string; // ✅ This is likely what you're looking for
  status: string;
  dateApplied: string;
  notes?: string;
}

@Injectable({
  providedIn: 'root',
})
export class JobService {
  private apiUrl = 'https://localhost:7262/api/jobs'; // ✅ Use the correct HTTPS API URL


  constructor(private http: HttpClient) {}

  getJobs(): Observable<Job[]> {
    return this.http.get<Job[]>(this.apiUrl);
  }

  getJob(id: number): Observable<Job> {
    return this.http.get<Job>(`${this.apiUrl}/${id}`);
  }

  addJob(job: Job): Observable<Job> {
    return this.http.post<Job>(this.apiUrl, job);
  }

  updateJob(job: Job): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${job.id}`, job);
  }

  deleteJob(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
