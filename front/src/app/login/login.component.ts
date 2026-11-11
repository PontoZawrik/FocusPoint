import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';


interface Input {
  value: string,
  isActive: boolean,
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  username: Input = {value: "", isActive: false}
  password: Input = {value: "", isActive: false}

  constructor(private authService: AuthService, private router: Router) {}

  async login(): Promise<void> {
    try {
      await this.authService.login(this.username.value, this.password.value)
      this.router.navigate(['/app/incoming'])
    } 
    catch (error: any) {
      console.error('Login error:', error)
    }
  }

  focus(param: Input): void {
    param.isActive = true
  }

  blur(param: Input): void {
    param.isActive = false
  }
}
