import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobBoardService {
  private apiUrl = 'https://free-y-combinator-jobs-api.p.rapidapi.com/active-jb-7d';
  private apiKey = '592430e328msh00270f247372bcdp1b84f6jsnd62757381e5a'; // ✅ Replace with your actual API key

  constructor(private http: HttpClient) {}

  getJobs(): Observable<any> {
    const headers = new HttpHeaders({
      'x-rapidapi-host': 'free-y-combinator-jobs-api.p.rapidapi.com',
      'x-rapidapi-key': this.apiKey
    });

    return this.http.get(this.apiUrl, { headers });
  }
}
