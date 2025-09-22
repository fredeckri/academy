import { Injectable, inject } from '@angular/core';
import { GlobalStateService } from './global-state.service';
import { User } from '../models/user.model';
import { Product } from '../models/product.model';


export interface LoginResponse {
  success: boolean;
  user: User;
  token: string;
}


export interface RegisterResponse {
  success: boolean;
  user: User;
}

const BASE_URL = 'http://localhost:3000';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private globalState = inject(GlobalStateService);

  private async _fetch(endpoint: string, options: RequestInit = {}): Promise<any> {
    this.globalState.isLoading.set(true);
    const token = localStorage.getItem('angular-ecommerce-token');
    const headers = new Headers(options.headers || {});
    
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    if (!(options.body instanceof FormData)) {
      headers.set('Content-Type', 'application/json');
    }

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });
      
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") !== -1) {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || data.error || 'Erro na API.');
        }
        return data;
      } else {
         if (!response.ok) throw new Error('Erro na API.');
         return {}; 
      }
    } catch (error) {
      console.error(`Erro na API em ${endpoint}:`, error);
      throw error;
    } finally {
      this.globalState.isLoading.set(false);
    }
  }

  login(email: string, password: string): Promise<LoginResponse> { 
    return this._fetch('/login', { method: 'POST', body: JSON.stringify({ email, password }) }); 
  }
  
  //
  register(userData: Partial<User>): Promise<RegisterResponse> { 
    return this._fetch('/register', { method: 'POST', body: JSON.stringify(userData) }); 
  }
  
  getProducts(): Promise<Product[]> { 
    return this._fetch('/products'); 
  }
  
  getProduct(id: string): Promise<Product> { 
    return this._fetch(`/products/${id}`); 
  }
  
  addProduct(formData: FormData): Promise<Product> { 
    return this._fetch('/products', { method: 'POST', body: formData }); 
  }
  
  updateProduct(id: string, formData: FormData): Promise<Product> { 
    return this._fetch(`/products/${id}`, { method: 'PUT', body: formData }); 
  }
  
  deleteProduct(id: string): Promise<{ message: string }> { 
    return this._fetch(`/products/${id}`, { method: 'DELETE' }); 
  }
}

