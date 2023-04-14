import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';
import { sanitizeInput } from '../utils/utils';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://127.0.0.1:3000/users';

  private loggedInUser$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {
    this.checkLoggedInStatus();
  }

  login(username: string, password: string): Observable<boolean> {
    const sanitizedUsername = sanitizeInput(this.sanitizer, username);
    const sanitizedPassword = sanitizeInput(this.sanitizer, password);

    return this.http.post<any>(`${this.baseUrl}/login`, { username: sanitizedUsername, password: sanitizedPassword })
      .pipe(
        map(response => {
          if (response && response.accessToken) {
            localStorage.setItem('currentUser', JSON.stringify({ username: sanitizedUsername, token: response.accessToken }));
            this.loggedInUser$.next(true);
            return true;
          } else {
            return false;
          }
        }),
        catchError(error => {
          return of(false);
        })
      );
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.loggedInUser$.next(false);
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedInUser$.asObservable();
  }

  getToken(): string | null {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    return currentUser.token || null;
  }

  checkLoggedInStatus() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser && currentUser.token) {
      this.loggedInUser$.next(true);
    }
  }
}
