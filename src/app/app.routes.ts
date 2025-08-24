// src/app/app.routes.ts

import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list';
import { ProductDetailComponent } from './components/product-detail/product-detail';
import { CheckoutFormComponent  } from './components/checkout-form/checkout-form';

export const routes: Routes = [
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { path: 'products', component: ProductListComponent },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'checkout', component: CheckoutFormComponent },
  { path: '**', redirectTo: '/products' }, // Redireciona para a lista caso a rota não exista
];
