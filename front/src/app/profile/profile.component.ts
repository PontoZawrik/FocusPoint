import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { ApplicationService } from '../services/application.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  constructor(private authService: AuthService, private router: Router, private applicationService: ApplicationService) {}

  username: string = ""
  isActive: boolean = false

  async ngOnInit(): Promise<void> {
    await this.applicationService.getUserData()
    this.username = this.applicationService.user.username
  }
  

  toggleStatus(): void {
    this.isActive = !this.isActive
  }

  async logout(): Promise<void> {
    try {
      await this.authService.logout()
      console.log('Logout successful, navigating to /login')
    } 
    catch (error) {
      console.error('Logout error:', error)
    }
    finally {
      this.router.navigate(['/login'])
    }
  }
}
