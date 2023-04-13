import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://127.0.0.1:3000/users';

  private loggedInUser: string | null = null;

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<boolean> {

    return this.http.post<any>(`${this.baseUrl}/login`, { username: username, password: password })
      .pipe(
        map(response => {
          if (response && response.accessToken) {
            localStorage.setItem('currentUser', JSON.stringify({ username: username, token: response.accessToken }));
            this.loggedInUser = username;
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
    this.loggedInUser = null;
  }

  isLoggedIn(): boolean {
    return this.loggedInUser !== null;
  }

  getLoggedInUser(): string | null {
    return this.loggedInUser;
  }
}
