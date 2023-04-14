import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router, private sanitizer: DomSanitizer) { }

  login() {
    const sanitizedUsername = this.sanitizer.sanitize(4, this.username.trim());
    const sanitizedPassword = this.sanitizer.sanitize(4, this.password.trim());
    if (!sanitizedUsername || !sanitizedPassword) {
      this.errorMessage = 'Please enter a valid username and password';
      return;
    }
    this.authService.login(sanitizedUsername, sanitizedPassword)
      .subscribe(result => {
        if (result === true) {
          this.router.navigate(['/products']);
        } else {
          this.errorMessage = 'Username or password is incorrect';
        }
      });
  }
}
