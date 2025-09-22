import { inject } from '@angular/core';
import { Routes, Router } from '@angular/router';
import { AuthService } from './services/auth.service';

// --- Guards ---
const authGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isLoggedIn()) {
    return true;
  }
  return router.parseUrl('/login');
};
/**
 * const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (!authService.isLoggedIn()) { 
    return false; 
  }
      return router.parseUrl('/login');
 */

const adminGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isAdmin()) {
    return true;
  }
  return router.parseUrl('/');
};

const guestGuard = () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (!authService.isLoggedIn()) {
    return true;
  }
  return router.parseUrl('/');
};

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/catalog/catalog.component').then(
        (m) => m.CatalogComponent
      ),
    title: 'Catálogo',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./components/login/login.component').then(
        (m) => m.LoginComponent
      ),
    canActivate: [guestGuard],
    title: 'Login',
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./components/register/register.component').then(
        (m) => m.RegisterComponent
      ),
    canActivate: [guestGuard],
    title: 'Cadastro',
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./components/cart/cart.component').then((m) => m.CartComponent),
    title: 'Carrinho',
  },
  {
    path: 'payment',
    loadComponent: () =>
      import('./components/payment/payment.component').then(
        (m) => m.PaymentComponent
      ),
    canActivate: [authGuard],
    title: 'Pagamento',
  },
  {
    path: 'product/add',
    loadComponent: () =>
      import('./components/product-form/product-form.component').then(
        (m) => m.ProductFormComponent
      ),
    canActivate: [authGuard, adminGuard],
    title: 'Adicionar Produto',
  },
  {
    path: 'product/edit/:id',
    loadComponent: () =>
      import('./components/product-form/product-form.component').then(
        (m) => m.ProductFormComponent
      ),
    canActivate: [authGuard, adminGuard],
    title: 'Editar Produto',
  },
  { path: '**', redirectTo: '' },
];
