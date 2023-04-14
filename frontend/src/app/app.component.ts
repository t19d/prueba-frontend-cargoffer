import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isLoggedIn$ = this.authService.isLoggedIn();

  constructor(private authService: AuthService) { }

  onLogout() {
    this.authService.logout();
  }
}
