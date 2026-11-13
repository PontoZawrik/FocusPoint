import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import axiosInstance, {
  LoginResponse,
  AuthResponse,
  LogoutResponse,
} from './axisConfig';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _isAuthenticated: boolean = false;
  private _isLoading: boolean = true;

  get isAuthenticated(): boolean {
    return this._isAuthenticated;
  }
  get isLoading(): boolean {
    return this._isLoading;
  }

  constructor(private router: Router) {
    this.checkAuthStatus();
  }

  async login(username: string, password: string): Promise<boolean> {
    try {
      const response = await axiosInstance.post<LoginResponse>('/api/login', {
        username,
        password,
      });
      const loginResponse = response.data;

      if (loginResponse.success && loginResponse.token) {
        localStorage.setItem('authToken', loginResponse.token);
        this._isAuthenticated = true;
        console.log('Angular: Login successful, token stored.');
        return true;
      } 
      else {
        localStorage.removeItem('authToken');
        this._isAuthenticated = false;
        console.error('Angular: Login failed:', loginResponse.message);
        return false;
      }
    } 
    catch (error) {
      this._isAuthenticated = false;
      localStorage.removeItem('authToken');
      console.error('Angular: Login error:', error);
      return false;
    }
  }

  async logout(): Promise<boolean> {
    try {
      await axiosInstance.get<LogoutResponse>('/api/logout');
      console.log('Angular: Logged out, token removed.');
      return true;
    } 
    catch (error) {
      console.error('Angular: Logout error:', error);
      return false;
    } 
    finally {
      localStorage.removeItem('authToken');
      this._isAuthenticated = false;
    }
  }

  async checkAuthStatus(): Promise<void> {
    this._isLoading = true;
    const token = localStorage.getItem('authToken');
    const href = location.href.split(location.host)[1];

    if (!token) {
      this._isAuthenticated = false;
      this._isLoading = false;
      console.log('Angular: No token found.');
      return;
    }

    console.log('Angular: Token found, verifying...');
    try {
      const response = await axiosInstance.get<AuthResponse>('/api/auth');
      this._isAuthenticated = response.data.isAuthenticated;

      this.router.navigate([href]);
      console.log(
        'Angular: Auth check successful, isAuthenticated:',
        this._isAuthenticated
      );
    } 
    catch (error) {
      this._isAuthenticated = false;
      localStorage.removeItem('authToken');
      this.router.navigate(['/login']);
      console.error('Angular: Auth check failed:', error);
    } 
    finally {
      this._isLoading = false;
    }
  }
}

export { axiosInstance }