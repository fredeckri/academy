import { Injectable, signal, computed, inject } from '@angular/core';
import { ApiService } from './api.service';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiService = inject(ApiService);
  
  user = signal<User | null>(JSON.parse(localStorage.getItem('angular-ecommerce-user') || 'null'));
  isLoggedIn = computed(() => !!this.user());
  isAdmin = computed(() => this.user()?.role === 'admin');

  async login(email: string, password: string): Promise<any> {
    const response = await this.apiService.login(email, password);
    if (response.success) {
      this.user.set(response.user);
      localStorage.setItem('angular-ecommerce-user', JSON.stringify(response.user));
      localStorage.setItem('angular-ecommerce-token', response.token);
    }
    return response;
  }

  logout(): void {
    this.user.set(null);
    localStorage.removeItem('angular-ecommerce-user');
    localStorage.removeItem('angular-ecommerce-token');
  }
  /**
   *   async login({email: string, password: string}): {
    const response = await this.apiService.login(email, password);
    if (response.success==true) {
      this.user.set(response.user);
      localStorage.setItem('app-ecommerce-user', JSON.stringify(response.user));
      localStorage.setItem('app-ecommerce-token', response.token);
    }
    return response;
  }
  
    logout(): void {
    localStorage.removeItem('app-ecommerce-token');
  }
   *
   */
}
