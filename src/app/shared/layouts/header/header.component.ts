import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  constructor(private router: Router, private cookieService: CookieService) {}

  logout(): void {
    // Clear any user-related data from cookies or local storage
    this.cookieService.delete('userId'); // Example of deleting a cookie
    Swal.fire("Logged out succesfully","success");
    // Navigate to the login page or any other desired route
    this.router.navigate(['/login']);
  }
}
